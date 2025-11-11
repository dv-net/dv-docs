# **Интеграция DV.net с вашим Python‑приложением с помощью dv-net-client**

Библиотека dv-net-client предоставляет удобный способ взаимодействовать с API DV.net напрямую из ваших Python‑приложений. Независимо от того, создаёте ли вы веб‑бэкенд, скрипт или любую другую систему на Python, этот клиент упрощает задачи, такие как создание платёжных запросов (инвойсов) и обработка обновлений статуса через вебхуки.  
Это руководство проведёт вас через основные шаги для начала работы с dv-net-client.  
**Предварительные требования:**

* Установленный Python 3.8 или выше.
* pip (установщик пакетов Python).
* Активная учётная запись DV.net.
* Базовые знания Python (включая asyncio, если используете асинхронный клиент).

### **Шаг 1: Установка клиентской библиотеки DV.net**

Сначала установите пакет с помощью pip. Откройте терминал или командную строку и выполните:  

`pip install dv-net-client`

Эта команда загрузит и установит последнюю версию клиентской библиотеки и её зависимости.

### **Шаг 2: Получение ваших учётных данных DV.net API**

Для взаимодействия с API DV.net вам нужны три параметра из вашей учётной записи DV.net:

1. **API URL:** Базовый URL вашего экземпляра DV.net (например, https://api.your-dv-instance.com).
2. **API Key:** Ваш публичный API‑ключ.
3. **API Secret:** Ваш приватный секрет API.

Сгенерировать эти учётные данные можно в панели управления аккаунтом DV.net, обычно в разделе «API Keys» или «Developer».  
**Важно:** Храните ваш API Secret в безопасности и не публикуйте его в клиентском коде или открытых репозиториях.

### **Шаг 3: Инициализация клиента**

Библиотека предлагает синхронный и асинхронный клиенты. Выберите тот, который подходит архитектуре вашего приложения.  
**Синхронный клиент:**  
Подходит для традиционных скриптов или веб‑фреймворков вроде Flask/Django, если не используете асинхронные представления.

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

**Асинхронный клиент:**  
Идеален для приложений на asyncio, таких как FastAPI, Starlette, или асинхронные скрипты.  

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
### **Шаг 4: Создание платёжного запроса (счёта)**

Создание инвойса — распространённый сценарий. Вам нужно указать сумму, валюту и при желании ID заказа вашей системы.  

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
*(Для асинхронного клиента используйте `await async_client.create_invoice(invoice_data)` внутри асинхронной функции).*

### **Шаг 5: Обработка вебхуков**

Вебхуки необходимы для получения обновлений статуса платежей в режиме реального времени (например, когда инвойс оплачен). DV.net отправляет POST‑запросы на URL, который вы настраиваете в своём аккаунте DV.net.  
**Безопасность:** Важно проверять, что входящие запросы вебхука действительно отправлены DV.net. Библиотека dv-net-client предоставляет утилиту для этого, используя Webhook Secret, который вы задаёте.

1. **Настройка вебхука в DV.net:**
    * Перейдите в Project -> Your project -> Edit.
    * Скопируйте API key и secret key со страницы.
    * Настройте webhook URLs для событий, которые хотите получать (например, Confirmed transactions, Unconfirmed transaction и Withdrawal).
2. **Проверка и обработка вебхука в вашем приложении:**

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
*(В примере используется FastAPI, но функции verify_webhook_signature и WebhookMapper.map_webhook можно применять с Flask, Django или любым другим Python‑фреймворком. Вам потребуется адаптировать способ получения тела запроса и заголовков.)*

### **Заключение**

Библиотека dv-net-client предоставляет синхронные и асинхронные интерфейсы для взаимодействия с API DV.net, а также необходимые утилиты для проверки вебхуков. Следуя этим шагам, вы сможете интегрировать криптоплатежи DV.net в своё Python‑приложение эффективно и безопасно. Не забудьте обращаться к исходному коду библиотеки или документации для подробностей по всем доступным методам и DTO.