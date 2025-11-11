# **dv-net-client का उपयोग करके DV.net को अपनी Python एप्लिकेशन में इंटीग्रेट करना**

dv-net-client लाइब्रेरी आपकी Python एप्लिकेशनों से सीधे DV.net API के साथ इंटरैक्ट करने का एक सुविधाजनक तरीका प्रदान करती है। चाहे आप एक वेब बैकएंड, स्क्रिप्ट, या कोई अन्य Python-आधारित सिस्टम बना रहे हों, यह क्लाइंट भुगतान अनुरोध (इनवॉइस) बनाने और वेबहुक के जरिए स्टेटस अपडेट संभालने जैसे कार्यों को सरल बनाता है।  
यह गाइड आपको dv-net-client के साथ शुरुआत करने के आवश्यक चरणों से परिचित कराएगा।  
**पूर्वापेक्षाएँ:**

* Python 3.8 या उससे उच्च संस्करण इंस्टॉल हो।
* pip (Python पैकेज इंस्टॉलर)।
* एक सक्रिय DV.net अकाउंट।
* Python की बेसिक समझ (यदि async क्लाइंट का उपयोग कर रहे हैं तो asyncio सहित)।

### **चरण 1: DV.net क्लाइंट लाइब्रेरी इंस्टॉल करें**

पहला कदम pip का उपयोग करके पैकेज इंस्टॉल करना है। अपना टर्मिनल या कमांड प्रॉम्प्ट खोलें और चलाएँ:  

`pip install dv-net-client`

यह कमांड क्लाइंट लाइब्रेरी और इसकी डिपेंडेंसीज़ के नवीनतम संस्करण को डाउनलोड और इंस्टॉल कर देगा।

### **चरण 2: अपने DV.net API क्रेडेंशियल्स प्राप्त करें**

DV.net API से संवाद करने के लिए, आपको अपने DV.net अकाउंट से तीन चीज़ों की आवश्यकता होगी:

1. **API URL:** आपके DV.net इंस्टेंस का बेस URL (जैसे, https://api.your-dv-instance.com)।
2. **API Key:** आपकी पब्लिक API की।
3. **API Secret:** आपका प्राइवेट API सीक्रेट।

आप ये क्रेडेंशियल्स अपने DV.net अकाउंट डैशबोर्ड में, आमतौर पर "API Keys" या "Developer" सेक्शन के तहत जनरेट कर सकते हैं।  
**महत्वपूर्ण:** अपने API Secret को सुरक्षित रखें और इसे क्लाइंट-साइड कोड या पब्लिक रिपॉज़िटरी में एक्सपोज़ न करें।

### **चरण 3: क्लाइंट को इनिशियलाइज़ करें**

लाइब्रेरी सिंक्रोनस और असिंक्रोनस दोनों प्रकार के क्लाइंट प्रदान करती है। अपने एप्लिकेशन की आर्किटेक्चर के अनुसार चुनें।  
**Synchronous Client:**  
पारंपरिक स्क्रिप्ट्स या Flask/Django जैसे वेब फ्रेमवर्क (यदि async व्यूज़ का उपयोग नहीं कर रहे) के लिए उपयुक्त।

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

**Asynchronous Client:**  
asyncio का उपयोग करने वाले एप्लिकेशनों के लिए आदर्श, जैसे FastAPI, Starlette, या असिंक्रोनस स्क्रिप्ट्स।  

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
### **चरण 4: एक भुगतान अनुरोध (इनवॉइस) बनाना**

इनवॉइस बनाना एक सामान्य उपयोग मामला है। आपको राशि, मुद्रा, और वैकल्पिक रूप से अपने सिस्टम से एक ऑर्डर ID जैसी जानकारी प्रदान करनी होगी।  

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
*(async क्लाइंट के लिए, एक async फ़ंक्शन के भीतर `await async_client.create_invoice(invoice_data)` का उपयोग करें।)*

### **चरण 5: वेबहुक हैंडल करना**

वेबहुक भुगतान स्थिति के रियल-टाइम अपडेट प्राप्त करने के लिए आवश्यक हैं (जैसे जब कोई इनवॉइस पे हो जाती है)। DV.net आपके द्वारा DV.net अकाउंट में कॉन्फ़िगर किए गए URL पर POST रिक्वेस्ट भेजता है।  
**Security:** यह सत्यापित करना महत्वपूर्ण है कि आने वाली वेबहुक रिक्वेस्ट वास्तव में DV.net से हैं। dv-net-client इसके लिए आपके द्वारा तय किए गए Webhook Secret का उपयोग कर एक यूटिलिटी प्रदान करता है।

1. **DV.net में वेबहुक कॉन्फ़िगर करें:**
    * Project -> Your project -> Edit पर जाएँ।
    * पेज से API key और secret key प्राप्त करें।
    * जिन इवेंट्स के लिए आप नोटिफिकेशन चाहते हैं, उनके लिए वेबहुक URLs सेटअप करें (उदा., Confirmed transactions, Unconfirmed transaction और Withdrawal)।
2. **अपने एप्लिकेशन में वेबहुक को वेरिफ़ाई और प्रोसेस करें:**

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
*(यह उदाहरण FastAPI का उपयोग करता है, लेकिन verify_webhook_signature और WebhookMapper.map_webhook फ़ंक्शंस को Flask, Django, या किसी भी अन्य Python फ्रेमवर्क के साथ उपयोग किया जा सकता है। आपको केवल रिक्वेस्ट बॉडी और हेडर्स एक्सेस करने का तरीका अनुकूलित करना होगा।)*

### **निष्कर्ष**

dv-net-client लाइब्रेरी DV.net API के साथ इंटरैक्ट करने के लिए सिंक्रोनस और असिंक्रोनस दोनों इंटरफेसेज़ के साथ-साथ वेबहुक वेरिफ़िकेशन के आवश्यक यूटिलिटी प्रदान करती है। इन चरणों का पालन करके, आप अपनी Python एप्लिकेशन में DV.net क्रिप्टो भुगतान को प्रभावी और सुरक्षित रूप से इंटीग्रेट कर सकते हैं। सभी उपलब्ध मेथड्स और DTOs के विवरण के लिए लाइब्रेरी के सोर्स कोड या डाक्यूमेंटेशन को अवश्य देखें।