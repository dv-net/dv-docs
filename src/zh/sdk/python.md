# **使用 dv-net-client 将 DV.net 集成到你的 Python 应用中**

dv-net-client 库为你在 Python 应用中直接与 DV.net API 交互提供了便捷方式。无论你在构建 Web 后端、脚本，还是其他基于 Python 的系统，该客户端都能简化创建支付请求（发票）以及通过 webhook 处理状态更新等任务。  
本指南将带你完成开始使用 dv-net-client 的关键步骤。  
**前置条件：**

* 已安装 Python 3.8 或更高版本。
* pip（Python 包管理器）。
* 有效的 DV.net 账户。
* 具备基础的 Python 知识（如果使用异步客户端，还需要了解 asyncio）。

### **步骤 1：安装 DV.net 客户端库**

首先使用 pip 安装该包。打开终端或命令提示符并运行：  
pip install dv-net-client

该命令会下载并安装最新版客户端库及其依赖。

### **步骤 2：获取你的 DV.net API 凭据**

与 DV.net API 通信需要从你的 DV.net 账户获取三项信息：

1. **API URL：** 你的 DV.net 实例的基础 URL（例如：https://api.your-dv-instance.com）。
2. **API Key：** 你的公共 API 密钥。
3. **API Secret：** 你的私有 API 密钥。

你可以在 DV.net 账户控制台中生成这些凭据，通常位于“API Keys”或“Developer”部分。  
**重要：** 请妥善保管你的 API Secret，切勿在客户端代码或公共代码仓库中暴露。

### **步骤 3：初始化客户端**

该库提供同步和异步两种客户端。根据你的应用架构进行选择。  
**同步客户端：**  
适合传统脚本或未使用异步视图的 Flask/Django 等 Web 框架。

```python
from dv_net_client import Client

API_URL = "YOUR_DV_NET_API_URL"  # Replace with your actual API URL  
API_KEY = "YOUR_API_KEY"        # Replace with your API Key  
API_SECRET = "YOUR_API_SECRET"    # Replace with your API Secret

# Initialize the synchronous client  
client = Client(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

# You can now use the 'client' object to make API calls  
# Example: Get available currencies  
try:  
currencies_response = client.get_currencies()  
print("Available Currencies:", currencies_response.currencies)  
except Exception as e:  
print(f"An error occurred: {e}")
```

**异步客户端：**  
适合使用 asyncio 的应用，例如 FastAPI、Starlette 或异步脚本。  

```python
import asyncio  
from dv_net_client import AsyncClient

API_URL = "YOUR_DV_NET_API_URL"  # Replace with your actual API URL  
API_KEY = "YOUR_API_KEY"        # Replace with your API Key  
API_SECRET = "YOUR_API_SECRET"    # Replace with your API Secret

async def main():  
# Initialize the asynchronous client  
async_client = AsyncClient(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

    # You can now use the 'async_client' object to make API calls  
    # Example: Get available currencies asynchronously  
    try:  
        currencies_response = await async_client.get_currencies()  
        print("Available Currencies:", currencies_response.currencies)  
    except Exception as e:  
        print(f"An error occurred: {e}")  
    finally:  
        # Important: Close the client session when done  
        await async_client.close()

if __name__ == "__main__":  
asyncio.run(main())
```
### **步骤 4：创建支付请求（发票）**

创建发票是常见用例。你需要提供金额、货币等信息，并可选地提供系统中的订单 ID。  

```python
from dv_net_client import Client  
from dv_net_client.dto.merchant_client import CreateInvoiceDto # Import the DTO

# Assume 'client' is initialized as shown in Step 3

# Define the invoice details using the DTO  
invoice_data = CreateInvoiceDto(  
amount=10.50,               # The amount for the invoice  
currency_code="USD",        # The fiat currency code (e.g., USD, EUR)  
order_id="MY_ORDER_123",    # Your internal order ID (optional but recommended)  
description="Payment for Order #MY_ORDER_123" # Optional description  
# Add other optional parameters like return_url, success_url if needed  
)

try:  
# Create the invoice  
invoice_response = client.create_invoice(invoice_data)

    print(f"Invoice created successfully!")  
    print(f"Invoice ID: {invoice_response.invoice_id}")  
    print(f"Payment URL: {invoice_response.payment_url}") # Redirect customer here

    # Store invoice_response.invoice_id with your order MY_ORDER_123  
    # Redirect the user to invoice_response.payment_url

except Exception as e:  
print(f"Failed to create invoice: {e}")
```
（对于异步客户端，请在异步函数中使用 `await async_client.create_invoice(invoice_data)`。）

### **步骤 5：处理 Webhook**

Webhook 对于接收支付状态的实时更新至关重要（例如，当发票被支付时）。DV.net 会向你在 DV.net 账户中配置的 URL 发送 POST 请求。  
**安全性：** 验证传入的 webhook 请求确实来自 DV.net 非常重要。dv-net-client 提供了使用你设置的 Webhook Secret 进行验证的实用工具。

1. **在 DV.net 中配置 Webhook：**
    * 前往 DV.net 控制台的 Webhooks 部分。
    * 将 **Payload URL** 设置为你应用中用于处理这些请求的端点（例如：https://yourdomain.com/webhooks/dvnet）。
    * 创建一个强且唯一的 **Webhook Secret** 并妥善保存。
    * 配置希望接收的事件（例如：payment.completed、payment.failed）。
2. **在你的应用中验证并处理 Webhook：**

```python
from fastapi import FastAPI, Request, Header, HTTPException # Example using FastAPI  
import uvicorn  
from dv_net_client.utils import verify_webhook_signature # Utility for verification  
from dv_net_client.mappers import WebhookMapper # Mapper to parse data  
from dv_net_client.dto.webhook import WebhookType # Enum for webhook types

# --- Configuration ---  
DV_NET_WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET" # Replace with your actual secret

app = FastAPI()

@app.post("/webhooks/dvnet") # Your Payload URL endpoint  
async def handle_dvnet_webhook(request: Request, x_dv_signature: str = Header(None)):  
if not x_dv_signature:  
raise HTTPException(status_code=400, detail="Missing X-DV-Signature header")

    # Get raw body bytes  
    raw_body = await request.body()

    # 1. Verify the signature  
    if not verify_webhook_signature(  
        signature=x_dv_signature,  
        payload=raw_body,  
        secret=DV_NET_WEBHOOK_SECRET  
    ):  
        print("Webhook signature verification failed!")  
        raise HTTPException(status_code=400, detail="Invalid signature")

    print("Webhook signature verified successfully.")

    # 2. Parse the webhook data  
    try:  
        webhook_data = WebhookMapper.map_webhook(raw_body.decode('utf-8')) # Decode bytes to string  
    except Exception as e:  
        print(f"Error parsing webhook data: {e}")  
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

    # 3. Process based on webhook type  
    print(f"Received webhook type: {webhook_data.type}")

    if webhook_data.type == WebhookType.CONFIRMED:  
        # Payment is confirmed (equivalent to payment.completed or invoice.paid)  
        invoice_id = webhook_data.invoice_id  
        order_id = webhook_data.order_id # The order_id you sent when creating the invoice  
        print(f"Payment confirmed for Invoice ID: {invoice_id}, Order ID: {order_id}")  
        # --- Update your order status in your database here ---  
        # Find the order associated with 'order_id' or 'invoice_id'  
        # Mark the order as paid/completed.  
        # Maybe send a confirmation email to the customer.  
        pass

    elif webhook_data.type == WebhookType.UNCONFIRMED:  
        # Payment detected but waiting for blockchain confirmations (optional handling)  
        invoice_id = webhook_data.invoice_id  
        print(f"Payment unconfirmed for Invoice ID: {invoice_id}")  
        # You might update the order status to "Pending Confirmation"  
        pass

    elif webhook_data.type == WebhookType.WITHDRAWAL:  
        # Related to withdrawal operations, not typically invoice payments  
        print(f"Received withdrawal webhook: {webhook_data}")  
        pass

    else:  
        # Handle other types or unknown types if necessary  
        print(f"Received unhandled webhook type: {webhook_data.type}")  
        pass

    # Return a 2xx status code to acknowledge receipt  
    return {"status": "received"}

# --- Running the Server (Example) ---  
# if __name__ == "__main__":  
#     uvicorn.run(app, host="0.0.0.0", port=8000)  
# Remember to run this behind a proper web server (like Nginx) and use HTTPS in production.
```
（此示例使用 FastAPI，但 `verify_webhook_signature` 和 `WebhookMapper.map_webhook` 也可用于 Flask、Django 或其他任意 Python 框架。你需要根据所用框架调整获取请求体和请求头的方式。）

### **总结**

dv-net-client 库提供了与 DV.net API 交互的同步与异步接口，以及用于 webhook 验证的关键工具。按照以上步骤，你可以高效且安全地将 DV.net 加密支付集成到你的 Python 应用中。请参考该库的源代码或文档以了解全部可用方法和 DTO。