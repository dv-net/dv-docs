# **دمج DV.net مع تطبيق Python الخاص بك باستخدام dv-net-client**

يوفر مكتبة dv-net-client طريقة مريحة للتعامل مع واجهة برمجة تطبيقات DV.net مباشرة من تطبيقات Python الخاصة بك. سواء كنت تبني واجهة خلفية للويب، أو سكربت، أو أي نظام يعتمد على Python، فإن هذا العميل يبسط مهام مثل إنشاء طلبات الدفع (الفواتير) والتعامل مع تحديثات الحالة عبر خطافات الويب (Webhooks).  
سيرشدك هذا الدليل عبر الخطوات الأساسية للبدء باستخدام dv-net-client.  
**المتطلبات الأساسية:**

* Python 3.8 أو أعلى مثبت.
* pip (مدير حزم Python).
* حساب DV.net نشط.
* فهم أساسي للغة Python (بما في ذلك asyncio إذا كنت تستخدم العميل غير المتزامن).

### **الخطوة 1: تثبيت مكتبة عميل DV.net**

الخطوة الأولى هي تثبيت الحزمة باستخدام pip. افتح الطرفية أو موجه الأوامر وشغّل:  

`pip install dv-net-client`

يقوم هذا الأمر بتنزيل وتثبيت أحدث إصدار من مكتبة العميل وتبعياتها.

### **الخطوة 2: الحصول على بيانات اعتماد واجهة DV.net**

للتواصل مع واجهة DV.net، ستحتاج إلى ثلاثة عناصر من حسابك في DV.net:

1. **API URL:** عنوان URL الأساسي لن instance DV.net الخاص بك (مثال: https://api.your-dv-instance.com).
2. **API Key:** مفتاح API العام الخاص بك.
3. **API Secret:** سر API الخاص بك.

يمكنك إنشاء هذه البيانات من لوحة تحكم حساب DV.net، عادةً ضمن قسم "API Keys" أو "Developer".  
**مهم:** احتفظ بسر API بسرية ولا تفصح عنه في أكواد الواجهة الأمامية أو المستودعات العامة.

### **الخطوة 3: تهيئة العميل**

توفّر المكتبة عميلاً متزامناً وآخر غير متزامن. اختر ما يناسب بنية تطبيقك.  
**العميل المتزامن:**  
مناسب للسكربتات التقليدية أو أطر الويب مثل Flask/Django إذا لم تكن تستخدم مسارات async.

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

**العميل غير المتزامن:**  
مثالي للتطبيقات التي تستخدم asyncio مثل FastAPI وStarlette أو السكربتات غير المتزامنة.  

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
### **الخطوة 4: إنشاء طلب دفع (فاتورة)**

يُعد إنشاء الفاتورة حالة استخدام شائعة. ستحتاج إلى توفير تفاصيل مثل المبلغ والعملة، وبشكل اختياري معرّف الطلب من نظامك.  

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
*(بالنسبة للعميل غير المتزامن، استخدم `await async_client.create_invoice(invoice_data)` داخل دالة async).*

### **الخطوة 5: التعامل مع خطافات الويب (Webhooks)**

تُعد خطافات الويب ضرورية لتلقي التحديثات الفورية حول حالات الدفع (مثل عند دفع الفاتورة). يرسل DV.net طلبات POST إلى عنوان URL تقوم بتكوينه في حساب DV.net الخاص بك.  
**الأمان:** من الضروري التحقق من أن طلبات webhook الواردة صادرة فعلاً من DV.net. يوفر dv-net-client أداة لذلك باستخدام Webhook Secret الذي تحدده.

1. **تهيئة Webhook في DV.net:**
    * انتقل إلى Project -> مشروعك -> Edit.
    * احصل على مفتاح API والمفتاح السري من الصفحة
    * اضبط عناوين URL للويب هوك للأحداث التي تريد تلقيها (مثال: Confirmed transactions وUnconfirmed transaction وWithdrawal).
2. **التحقق من صحة الـ Webhook ومعالجته في تطبيقك:**

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
*(يستخدم هذا المثال FastAPI، ولكن يمكن استخدام الدوال verify_webhook_signature وWebhookMapper.map_webhook مع Flask أو Django أو أي إطار عمل Python آخر. ستحتاج فقط إلى تكييف كيفية الوصول إلى جسم الطلب والرؤوس).*

### **الخلاصة**

يوفّر dv-net-client واجهات متزامنة وغير متزامنة للتفاعل مع واجهة DV.net، بالإضافة إلى أدوات أساسية للتحقق من خطافات الويب. باتباع هذه الخطوات، يمكنك دمج مدفوعات DV.net بالعملات المشفرة في تطبيق Python الخاص بك بكفاءة وأمان. تذكّر الرجوع إلى كود المصدر الخاص بالمكتبة أو توثيقها للاطلاع على جميع الطرق وكيانات DTO المتاحة.