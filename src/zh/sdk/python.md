# **使用 dv-net-client 将 DV.net 集成到你的 Python 应用**

dv-net-client 库为你在 Python 应用中直接与 DV.net API 交互提供了便捷方式。无论你在构建 Web 后端、脚本，还是任何其他基于 Python 的系统，该客户端都能简化创建付款请求（发票）以及通过 Webhook 处理状态更新等任务。  
本指南将带你完成开始使用 dv-net-client 的关键步骤。  
**先决条件：**

* 已安装 Python 3.8 或更高版本。
* pip（Python 包管理器）。
* 一个有效的 DV.net 账号。
* 具备 Python 基础知识（如果使用异步客户端，还需了解 asyncio）。

### **步骤 1：安装 DV.net 客户端库**

第一步是在终端或命令行中使用 pip 安装该包：  

`pip install dv-net-client`

此命令将下载并安装最新版客户端库及其依赖。

### **步骤 2：获取你的 DV.net API 凭证**

要与 DV.net API 通信，你需要从 DV.net 账户中获得以下三项信息：

1. **API URL：** 你的 DV.net 实例的基础 URL（例如 https://api.your-dv-instance.com）。
2. **API Key：** 你的公共 API 密钥。
3. **API Secret：** 你的私有 API 密钥。

你可以在 DV.net 账户控制台中生成这些凭证，通常位于“API Keys”或“Developer”部分。  
**重要提示：** 请妥善保管你的 API Secret，切勿在客户端代码或公共仓库中暴露。

### **步骤 3：初始化客户端**

该库同时提供同步与异步客户端。选择与你的应用架构相匹配的方式。  
**同步客户端：**  
适用于传统脚本或未使用异步视图的 Flask/Django 等 Web 框架。

```python
from dv_net_client import Client

API_URL = "YOUR_DV_NET_API_URL"  # 替换为你的实际 API URL  
API_KEY = "YOUR_API_KEY"        # 替换为你的 API Key  
API_SECRET = "YOUR_API_SECRET"    # 替换为你的 API Secret

# 初始化同步客户端  
client = Client(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

# 现在可以使用 'client' 对象发起 API 调用  
# 示例：获取可用法币  
try:  
currencies_response = client.get_currencies()  
print("Available Currencies:", currencies_response.currencies)  
except Exception as e:  
print(f"An error occurred: {e}")
```

**异步客户端：**  
适用于使用 asyncio 的应用，例如 FastAPI、Starlette 或异步脚本。  

```python
import asyncio  
from dv_net_client import AsyncClient

API_URL = "YOUR_DV_NET_API_URL"  # 替换为你的实际 API URL  
API_KEY = "YOUR_API_KEY"        # 替换为你的 API Key  
API_SECRET = "YOUR_API_SECRET"    # 替换为你的 API Secret

async def main():  
# 初始化异步客户端  
async_client = AsyncClient(host=API_URL, api_key=API_KEY, api_secret=API_SECRET)

    # 现在可以使用 'async_client' 对象发起 API 调用  
    # 示例：异步获取可用法币  
    try:  
        currencies_response = await async_client.get_currencies()  
        print("Available Currencies:", currencies_response.currencies)  
    except Exception as e:  
        print(f"An error occurred: {e}")  
    finally:  
        # 重要：使用完毕后关闭客户端会话  
        await async_client.close()

if __name__ == "__main__":  
asyncio.run(main())
```
### **步骤 4：创建付款请求（发票）**

创建发票是一个常见用例。你需要提供金额、货币，以及可选的系统订单 ID 等信息。  

```python
from dv_net_client import Client  
from dv_net_client.dto.merchant_client import CreateInvoiceDto # 引入 DTO

# 假设 'client' 已按步骤 3 初始化

# 使用 DTO 定义发票详情  
invoice_data = CreateInvoiceDto(  
amount=10.50,               # 发票金额  
currency_code="USD",        # 法币代码（例如 USD、EUR）  
order_id="MY_ORDER_123",    # 你的内部订单 ID（可选但推荐）  
description="Payment for Order #MY_ORDER_123" # 可选描述  
# 如有需要可添加其他可选参数，如 return_url、success_url  
)

try:  
# 创建发票  
invoice_response = client.create_invoice(invoice_data)

    print(f"Invoice created successfully!")  
    print(f"Invoice ID: {invoice_response.invoice_id}")  
    print(f"Payment URL: {invoice_response.payment_url}") # 将客户重定向至此

    # 将 invoice_response.invoice_id 与订单 MY_ORDER_123 进行关联存储  
    # 将用户重定向到 invoice_response.payment_url

except Exception as e:  
print(f"Failed to create invoice: {e}")
```
（对于异步客户端，请在异步函数中使用 await async_client.create_invoice(invoice_data)。）

### **步骤 5：处理 Webhook**

Webhook 用于接收关于付款状态的实时更新（例如发票已支付）。DV.net 会向你在账户中配置的 URL 发送 POST 请求。  
**安全性：** 验证传入的 Webhook 请求确实来自 DV.net 非常重要。dv-net-client 提供了使用你定义的 Webhook Secret 的验证工具。

1. **在 DV.net 中配置 Webhook：**
    * 前往 Project -> 你的项目 -> Edit。
    * 从页面获取 API key 和 secret key
    * 为你想接收的事件设置 Webhook URL（例如：Confirmed transactions、Unconfirmed transaction 以及 Withdrawal）。
2. **在你的应用中验证并处理 Webhook：**

```python
from fastapi import FastAPI, Request, Header, HTTPException # 以 FastAPI 为例  
import uvicorn  
from dv_net_client.utils import verify_webhook_signature # 用于验证的工具  
from dv_net_client.mappers import WebhookMapper # 用于解析数据的映射器  
from dv_net_client.dto.webhook import WebhookType # Webhook 类型枚举

# --- 配置 ---  
DV_NET_WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET" # 替换为你的实际 secret

app = FastAPI()

@app.post("/webhooks/dvnet") # 你的 Payload URL 端点  
async def handle_dvnet_webhook(request: Request, x_dv_signature: str = Header(None)):  
if not x_dv_signature:  
raise HTTPException(status_code=400, detail="Missing X-DV-Signature header")

    # 获取原始请求体字节  
    raw_body = await request.body()

    # 1. 验证签名  
    if not verify_webhook_signature(  
        signature=x_dv_signature,  
        payload=raw_body,  
        secret=DV_NET_WEBHOOK_SECRET  
    ):  
        print("Webhook signature verification failed!")  
        raise HTTPException(status_code=400, detail="Invalid signature")

    print("Webhook signature verified successfully.")

    # 2. 解析 Webhook 数据  
    try:  
        webhook_data = WebhookMapper.map_webhook(raw_body.decode('utf-8')) # 将字节解码为字符串  
    except Exception as e:  
        print(f"Error parsing webhook data: {e}")  
        raise HTTPException(status_code=400, detail="Invalid webhook payload")

    # 3. 根据 Webhook 类型处理  
    print(f"Received webhook type: {webhook_data.type}")

    if webhook_data.type == WebhookType.CONFIRMED:  
        # 付款已确认（相当于 payment.completed 或 invoice.paid）  
        invoice_id = webhook_data.invoice_id  
        order_id = webhook_data.order_id # 创建发票时你传入的 order_id  
        print(f"Payment confirmed for Invoice ID: {invoice_id}, Order ID: {order_id}")  
        # --- 在此更新你数据库中的订单状态 ---  
        # 根据 'order_id' 或 'invoice_id' 查找关联订单  
        # 将订单标记为已支付/已完成。  
        # 可能向客户发送确认邮件。  
        pass

    elif webhook_data.type == WebhookType.UNCONFIRMED:  
        # 已检测到付款，但等待区块链确认（可选处理）  
        invoice_id = webhook_data.invoice_id  
        print(f"Payment unconfirmed for Invoice ID: {invoice_id}")  
        # 你可以将订单状态更新为“待确认”  
        pass

    elif webhook_data.type == WebhookType.WITHDRAWAL:  
        # 与提现操作相关，通常不涉及发票支付  
        print(f"Received withdrawal webhook: {webhook_data}")  
        pass

    else:  
        # 如有需要，处理其他或未知类型  
        print(f"Received unhandled webhook type: {webhook_data.type}")  
        pass

    # 返回 2xx 状态码以确认已接收  
    return {"status": "received"}

# --- 运行服务（示例） ---  
# if __name__ == "__main__":  
#     uvicorn.run(app, host="0.0.0.0", port=8000)  
# 生产环境请在合适的 Web 服务器（如 Nginx）后运行，并使用 HTTPS。
```
（此示例基于 FastAPI，但 verify_webhook_signature 和 WebhookMapper.map_webhook 可在 Flask、Django 或任何其他 Python 框架中使用。你需要根据框架调整获取请求体和请求头的方式。）

### **结语**

dv-net-client 库提供了与 DV.net API 交互的同步与异步接口，并包含用于 Webhook 验证的关键工具。按照上述步骤，你可以高效且安全地将 DV.net 加密支付集成到你的 Python 应用中。请参考该库的源码或文档以了解所有可用的方法与 DTO。