# **Integration von DV.net in Ihre Python-Anwendung mit dv-net-client**

Die Bibliothek dv-net-client bietet eine bequeme Möglichkeit, direkt aus Ihren Python-Anwendungen mit der DV.net-API zu interagieren. Egal, ob Sie ein Web-Backend, ein Skript oder ein anderes Python-basiertes System entwickeln – dieser Client vereinfacht Aufgaben wie das Erstellen von Zahlungsanforderungen (Rechnungen) und das Verarbeiten von Statusaktualisierungen über Webhooks.  
Dieser Leitfaden führt Sie durch die wichtigsten Schritte, um mit dem dv-net-client zu starten.  
**Voraussetzungen:**

* Python 3.8 oder höher installiert.
* pip (Python-Paketmanager).
* Ein aktives DV.net-Konto.
* Grundlegendes Verständnis von Python (einschließlich asyncio bei Verwendung des Async-Clients).

### **Schritt 1: DV.net-Client-Bibliothek installieren**

Installieren Sie das Paket zuerst mit pip. Öffnen Sie Ihr Terminal oder die Eingabeaufforderung und führen Sie aus:  

`pip install dv-net-client`

Dieser Befehl lädt die neueste Version der Client-Bibliothek samt Abhängigkeiten herunter und installiert sie.

### **Schritt 2: DV.net-API-Zugangsdaten abrufen**

Für die Kommunikation mit der DV.net-API benötigen Sie drei Informationen aus Ihrem DV.net-Konto:

1. **API-URL:** Die Basis-URL Ihrer DV.net-Instanz (z. B. https://api.your-dv-instance.com).
2. **API Key:** Ihr öffentlicher API-Schlüssel.
3. **API Secret:** Ihr privater API-Secret.

Diese Zugangsdaten können Sie im Dashboard Ihres DV.net-Kontos generieren, üblicherweise im Bereich "API Keys" oder "Developer".  
**Wichtig:** Bewahren Sie Ihr API Secret sicher auf und veröffentlichen Sie es nicht in Client-seitigem Code oder öffentlichen Repositories.

### **Schritt 3: Client initialisieren**

Die Bibliothek bietet sowohl synchrone als auch asynchrone Clients. Wählen Sie den Ansatz, der zur Architektur Ihrer Anwendung passt.  
**Synchroner Client:**  
Geeignet für klassische Skripte oder Webframeworks wie Flask/Django, sofern keine Async-Views verwendet werden.

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

**Asynchroner Client:**  
Ideal für Anwendungen mit asyncio, etwa FastAPI, Starlette oder asynchrone Skripte.  

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
### **Schritt 4: Eine Zahlungsanforderung (Rechnung) erstellen**

Das Erstellen einer Rechnung ist ein häufiger Anwendungsfall. Sie müssen Details wie Betrag, Währung und optional eine Bestell-ID aus Ihrem System angeben.  

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
*(Für den Async-Client verwenden Sie await async_client.create_invoice(invoice_data) innerhalb einer asynchronen Funktion.)*

### **Schritt 5: Webhooks verarbeiten**

Webhooks sind unerlässlich, um Echtzeit-Updates zu Zahlungsstatus zu erhalten (z. B. wenn eine Rechnung bezahlt wurde). DV.net sendet POST-Anfragen an eine URL, die Sie in Ihrem DV.net-Konto konfigurieren.  
**Sicherheit:** Es ist entscheidend zu überprüfen, dass eingehende Webhook-Anfragen tatsächlich von DV.net stammen. Der dv-net-client stellt hierzu ein Hilfswerkzeug bereit, das Ihr definiertes Webhook-Secret verwendet.

1. **Webhook in DV.net konfigurieren:**
    * Gehen Sie zu Project -> Ihr Projekt -> Edit.
    * Entnehmen Sie der Seite den API Key und den Secret Key.
    * Richten Sie Webhook-URLs für die Ereignisse ein, die Sie erhalten möchten (z. B. Confirmed transactions, Unconfirmed transaction und Withdrawal).
2. **Webhook in Ihrer Anwendung verifizieren und verarbeiten:**

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
*(Dieses Beispiel verwendet FastAPI, aber die Funktionen verify_webhook_signature und WebhookMapper.map_webhook können auch mit Flask, Django oder jedem anderen Python-Framework genutzt werden. Sie müssen lediglich den Zugriff auf Request-Body und Header entsprechend anpassen.)*

### **Fazit**

Die Bibliothek dv-net-client bietet synchrone und asynchrone Schnittstellen zur Interaktion mit der DV.net-API sowie wichtige Hilfsfunktionen zur Webhook-Verifizierung. Wenn Sie diese Schritte befolgen, integrieren Sie DV.net-Kryptozahlungen effizient und sicher in Ihre Python-Anwendung. Konsultieren Sie die Quelltexte oder die Dokumentation der Bibliothek für Details zu allen verfügbaren Methoden und DTOs.