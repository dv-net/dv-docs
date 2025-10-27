# **Integrating DV.net with Your Python Application using dv-net-client**

The dv-net-client library provides a convenient way to interact with the DV.net API directly from your Python applications. Whether you're building a web backend, a script, or any other Python-based system, this client simplifies tasks like creating payment requests (invoices) and handling status updates via webhooks.  
This guide will walk you through the essential steps to get started with the dv-net-client.  
**Prerequisites:**

* Python 3.8 or higher installed.
* pip (Python package installer).
* An active DV.net account.
* Basic understanding of Python (including asyncio if using the async client).

### **Step 1: Install the DV.net Client Library**

The first step is to install the package using pip. Open your terminal or command prompt and run:  
pip install dv-net-client

This command downloads and installs the latest version of the client library and its dependencies.

### **Step 2: Obtain Your DV.net API Credentials**

To communicate with the DV.net API, you need three pieces of information from your DV.net account:

1. **API URL:** The base URL of your DV.net instance (e.g., https://api.your-dv-instance.com).
2. **API Key:** Your public API key.
3. **API Secret:** Your private API secret.

You can generate these credentials in your DV.net account dashboard, typically under an "API Keys" or "Developer" section.  
**Important:** Keep your API Secret secure and do not expose it in client-side code or public repositories.

### **Step 3: Initialize the Client**

The library offers both synchronous and asynchronous clients. Choose the one that fits your application's architecture.  
**Synchronous Client:**  
Suitable for traditional scripts or web frameworks like Flask/Django if not using async views.

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
Ideal for applications using asyncio, such as FastAPI, Starlette, or asynchronous scripts.  

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
### **Step 4: Creating a Payment Request (Invoice)**

Creating an invoice is a common use case. You'll need to provide details like the amount, currency, and optionally an order ID from your system.  

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
*(For the async client, use await async_client.create_invoice(invoice_data) within an async function).*

### **Step 5: Handling Webhooks**

Webhooks are essential for receiving real-time updates about payment statuses (e.g., when an invoice is paid). DV.net sends POST requests to a URL you configure in your DV.net account.  
**Security:** It's crucial to verify that incoming webhook requests are genuinely from DV.net. The dv-net-client provides a utility for this using the Webhook Secret you define.

1. **Configure Webhook in DV.net:**
    * Go to the Webhooks section in your DV.net dashboard.
    * Set the **Payload URL** to the endpoint in your application that will handle these requests (e.g., https://yourdomain.com/webhooks/dvnet).
    * Create a strong, unique **Webhook Secret** and save it securely.
    * Configure the events you want to receive (e.g., payment.completed, payment.failed).
2. **Verify and Process Webhook in Your Application:**

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
*(This example uses FastAPI, but the verify_webhook_signature and WebhookMapper.map_webhook functions can be used with Flask, Django, or any other Python framework. You'll need to adapt how you access the request body and headers.)*

### **Conclusion**

The dv-net-client library provides synchronous and asynchronous interfaces to interact with the DV.net API, along with essential utilities for webhook verification. By following these steps, you can integrate DV.net crypto payments into your Python application efficiently and securely. Remember to consult the library's source code or documentation for details on all available methods and DTOs.