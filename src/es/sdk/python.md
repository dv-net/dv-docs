# **Integrando DV.net con tu aplicación de Python usando dv-net-client**

La biblioteca dv-net-client proporciona una forma práctica de interactuar con la API de DV.net directamente desde tus aplicaciones Python. Ya sea que estés creando un backend web, un script u otro sistema basado en Python, este cliente simplifica tareas como crear solicitudes de pago (facturas) y manejar actualizaciones de estado mediante webhooks.  
Esta guía te llevará a través de los pasos esenciales para comenzar con dv-net-client.  
**Requisitos previos:**

* Python 3.8 o superior instalado.
* pip (el instalador de paquetes de Python).
* Una cuenta activa de DV.net.
* Conocimientos básicos de Python (incluido asyncio si usas el cliente asíncrono).

### **Paso 1: Instalar la biblioteca del cliente de DV.net**

El primer paso es instalar el paquete usando pip. Abre tu terminal o símbolo del sistema y ejecuta:  

`pip install dv-net-client`

Este comando descarga e instala la versión más reciente de la biblioteca del cliente y sus dependencias.

### **Paso 2: Obtén tus credenciales de la API de DV.net**

Para comunicarte con la API de DV.net, necesitas tres elementos de tu cuenta de DV.net:

1. **URL de la API:** La URL base de tu instancia de DV.net (por ejemplo, https://api.your-dv-instance.com).
2. **API Key:** Tu clave pública de API.
3. **API Secret:** Tu secreto privado de API.

Puedes generar estas credenciales en el panel de tu cuenta de DV.net, normalmente en una sección "API Keys" o "Developer".  
**Importante:** Mantén tu API Secret segura y no la expongas en código del lado del cliente ni en repositorios públicos.

### **Paso 3: Inicializa el cliente**

La biblioteca ofrece clientes sincrónicos y asíncronos. Elige el que se ajuste a la arquitectura de tu aplicación.  
**Cliente sincrónico:**  
Adecuado para scripts tradicionales o frameworks web como Flask/Django si no usas vistas asíncronas.

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

**Cliente asíncrono:**  
Ideal para aplicaciones que usan asyncio, como FastAPI, Starlette o scripts asíncronos.  

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
### **Paso 4: Crear una solicitud de pago (factura)**

Crear una factura es un caso de uso común. Deberás proporcionar detalles como el importe, la moneda y, opcionalmente, un ID de pedido de tu sistema.  

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
*(Para el cliente asíncrono, usa await async_client.create_invoice(invoice_data) dentro de una función async).*

### **Paso 5: Manejo de webhooks**

Los webhooks son esenciales para recibir actualizaciones en tiempo real sobre estados de pago (por ejemplo, cuando se paga una factura). DV.net envía solicitudes POST a una URL que configuras en tu cuenta de DV.net.  
**Seguridad:** Es crucial verificar que las solicitudes entrantes de webhook provienen realmente de DV.net. dv-net-client proporciona una utilidad para esto usando el Webhook Secret que definas.

1. **Configurar el webhook en DV.net:**
    * Ve a Project -> Your project -> Edit.
    * Obtén una API key y una secret key de la página.
    * Configura URLs de webhook para los eventos que quieres recibir (por ejemplo, Confirmed transactions, Unconfirmed transaction y Withdrawal).
2. **Verificar y procesar el webhook en tu aplicación:**

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
*(Este ejemplo usa FastAPI, pero las funciones verify_webhook_signature y WebhookMapper.map_webhook pueden usarse con Flask, Django o cualquier otro framework de Python. Debes adaptar cómo accedes al cuerpo y los encabezados de la solicitud).*

### **Conclusión**

La biblioteca dv-net-client proporciona interfaces sincrónicas y asíncronas para interactuar con la API de DV.net, junto con utilidades esenciales para la verificación de webhooks. Siguiendo estos pasos, puedes integrar pagos cripto de DV.net en tu aplicación de Python de forma eficiente y segura. Recuerda consultar el código fuente o la documentación de la biblioteca para ver los detalles de todos los métodos y DTO disponibles.