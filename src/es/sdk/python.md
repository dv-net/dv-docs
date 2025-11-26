# SDK de Python de DV.net (`dv_net_client`)

Cliente de Python para la integración con la pasarela de pago de DV.net.

- Se admiten las variantes síncrona y asíncrona del cliente.
- Todos los métodos devuelven DTO tipados (dataclass), no diccionarios «crudos».
- Hay herramientas listas para trabajar con webhooks y verificar la firma de las solicitudes.

Paquete: `dv_net_client`.

---

## Instalación

```bash
pip install dv-net-client
```

Para el cliente asíncrono se necesita además `aiohttp`:

```bash
pip install aiohttp
```

---

## Conceptos básicos

### Host y x-api-key

Todas las solicitudes se envían al API de DV.net usando un host base, por ejemplo:

```python
DV_HOST = "https://cloud.dv.net"
```

La autorización se realiza mediante la cabecera HTTP `x-api-key` (clave API pública de la tienda):

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

Estos parámetros se pueden pasar:

- una vez al constructor del cliente;
- o en cada método (sobrescribiendo los valores del constructor).

Si `host` o `x_api_key` no están definidos ni en el constructor ni en el método, se lanzará una excepción:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## Clientes

El SDK proporciona dos variantes de cliente:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### Cliente síncrono

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

Por defecto se usa `UrllibHttpClient` (basado en la biblioteca estándar `urllib`).

### Cliente asíncrono

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

Por defecto se usa `AiohttpHttpClient` (basado en `aiohttp`).

> Los clientes no implementan un gestor de contexto (`with` / `async with`).  
> Se recomienda crear una instancia una vez al iniciar la aplicación y reutilizarla.

---

## Errores y excepciones

Principales excepciones del módulo:

```python
from dv_net_client.exceptions import (
    DvNetException,
    DvNetRequestException,
    DvNetInvalidRequestException,
    DvNetServerException,
    DvNetNetworkException,
    DvNetInvalidResponseDataException,
    DvNetInvalidWebhookException,
    DvNetUndefinedHostException,
    DvNetUndefinedXApiKeyException,
)
```

- `DvNetInvalidRequestException` — error en la solicitud (4xx).
- `DvNetServerException` — error del lado de DV.net (5xx).
- `DvNetNetworkException` — problemas de red, timeouts, etc.
- `DvNetInvalidResponseDataException` — no se pudo mapear la respuesta al DTO esperado.
- `DvNetInvalidWebhookException` — formato de webhook incorrecto o desconocido.

Se recomienda envolver las llamadas del cliente en `try/except` con registro (logging).

---

## Métodos del cliente

A continuación se describen los métodos comunes a `MerchantClient` y `AsyncMerchantClient`.  
Las firmas son iguales; solo difieren en que, en la variante asíncrona, los métodos están marcados con la palabra clave `async` y se llaman con `await`.

Los tipos DTO se toman de `dv_net_client.dto.merchant_client`.

---

### 1. `get_exchange_balances`

Obtiene el balance consolidado de la tienda por todas las monedas y redes (balance de exchange).

```python
total_balance = await async_client.get_exchange_balances()
# или
total_balance = client.get_exchange_balances()
```

**Firma:**

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

**Devuelve:** `TotalExchangeBalanceResponse`:

- `total_usd: str` — balance total en USD.
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` contiene:

- `amount: str` — balance en la moneda.
- `amount_usd: str` — equivalente en USD.
- `currency: str` — código de la moneda.

**Ejemplo (async):**

```python
from dv_net_client import AsyncMerchantClient

DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"

client = AsyncMerchantClient(host=DV_HOST, x_api_key=DV_API_KEY)

balance = await client.get_exchange_balances()
print("Total USD:", balance.total_usd)
for item in balance.exchange_balance:
    print(f"{item.currency}: {item.amount} ({item.amount_usd} USD)")
```

---

### 2. `get_external_wallet`

Crear (o recuperar el existente) un monedero/enlace de pago para un usuario concreto.

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

**Firma:**

```python
get_external_wallet(
    store_external_id: str,
    email: Optional[str] = None,
    ip: Optional[str] = None,
    amount: Optional[str] = None,
    currency: Optional[str] = None,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ExternalAddressesResponse
```

Parámetros:

- `store_external_id` — tu ID interno del usuario (obligatorio).
- `email` — email del usuario (opcional).
- `ip` — IP del usuario (opcional).
- `amount` — importe de recarga (cadena, por ejemplo `"5.00"`).
- `currency` — código de moneda, por ejemplo `"USD"`.

**Devuelve:** `ExternalAddressesResponse`:

- `pay_url: str` — enlace de pago.
- `address: List[AddressDto]` — lista de direcciones individuales.
- `amount_usd: str` — importe en USD.
- `rates: List[str]` — información sobre tipos de cambio.
- campos de servicio (`id`, `store_id`, `store_external_id`, `created_at`, `updated_at`, etc.).

**Ejemplo (async):**

```python
resp = await client.get_external_wallet(
    store_external_id="user_123",
    amount="5.00",
    currency="USD",
    email="user@example.com",
    ip="203.0.113.10",
)

print("Pay URL:", resp.pay_url)
for addr in resp.address:
    print(f"{addr.currency_id} ({addr.blockchain}): {addr.address}")
```

---

### 3. `get_processing_wallets_balances`

Saldo de los monederos de procesamiento (donde se gestionan las transacciones entrantes).

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

**Firma:**

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

**Devuelve:** `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto` incluye, en particular:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (código, nombre, blockchain)
- campos técnicos adicionales.

---

### 4. `get_store_currencies`

Lista de monedas disponibles para la tienda.

```python
currencies = await async_client.get_store_currencies()
```

**Firma:**

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

**Devuelve:** `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

`CurrencyDto` contiene:

- `id: str` — identificador de la moneda del tipo `"USDT.Tron"`.
- `code: str` — código corto, por ejemplo `"USDT"`.
- `name: str` — nombre legible.
- `blockchain: str` — red (por ejemplo, `"Tron"`).
- `precision: int` y otros campos.

**Ejemplo:**

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

Obtención del tipo de cambio de una moneda concreta.

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

**Firma:**

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

Parámetros:

- `currency_id` — ID de `get_store_currencies`, por ejemplo `"USDT.Tron"`.

**Devuelve:** `CurrencyRateResponse`:

- `code: str` — código de la moneda.
- `rate` — tipo de cambio (tipo dinámico, normalmente cadena/número).
- campos adicionales (fuente, moneda de cotización, etc.).

---

### 6. `get_withdrawal_processing_status`

Estado de una retirada en procesamiento.

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

**Firma:**

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

Parámetros:

- `withdrawal_id` — ID de la retirada recibido previamente (por ejemplo, de `WithdrawalWebhookResponse` o de la respuesta de `initialize_transfer`).

**Devuelve:** `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` y otros.

---

### 7. `initialize_transfer`

Inicializar una retirada de fondos del balance de la tienda a un monedero externo.

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

**Firma:**

```python
initialize_transfer(
    address_to: str,
    currency_id: str,
    amount: str,
    request_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> WithdrawalResponse
```

Parámetros:

- `address_to` — dirección del destinatario (monedero).
- `currency_id` — ID de la moneda del tipo `"USDT.Tron"`.
- `amount` — importe de la retirada (cadena).
- `request_id` — tu ID único de solicitud (para idempotencia y para enlazar con tu sistema).

**Devuelve:** `WithdrawalResponse`:

- `id: str` — ID de la retirada en DV.net.
- `address_from: str` — dirección del remitente.
- `address_to: str` — dirección del destinatario.
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — puede ser `None` mientras la operación está en proceso.

---

### 8. `get_hot_wallet_balances`

Saldo de los monederos «hot».

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

**Firma:**

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

**Devuelve:** lista de `AccountDto`:

- `balance: str`
- `balance_usd: str`
- `count: int` — número de direcciones.
- `count_with_balance: int` — número de direcciones con balance distinto de cero.
- `currency: CurrencyShortDto` (código, nombre, blockchain).

---

### 9. `delete_withdrawal_from_processing`

Cancelar una retirada en procesamiento.

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

**Firma:**

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

Parámetros:

- `withdrawal_id` — ID de la retirada que se desea cancelar.

Excepciones:

- En caso de error (no encontrado, ya finalizado, error del servidor, etc.) se lanzará una de `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException`.

---

## Webhooks

El módulo `dv_net_client.mappers` contiene `WebhookMapper`, que convierte el JSON entrante de un webhook en uno de los DTO de `dv_net_client.dto.webhook`.

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

**Firma:**

```python
map_webhook(data: Dict[str, Any]) -> Any
```

Algoritmo:

- Si `data` tiene el campo `withdrawal_id` — devuelve `WithdrawalWebhookResponse`.
- Si tiene el campo `type` — devuelve `ConfirmedWebhookResponse`.
- Si tiene el campo `unconfirmed_type` — devuelve `UnconfirmedWebhookResponse`.
- En caso contrario se lanza `DvNetInvalidWebhookException`.

### DTO de webhooks

```python
@dataclass
class TransactionDto:
    tx_id: str
    tx_hash: str
    bc_uniq_key: str
    created_at: datetime
    currency: str
    currency_id: str
    blockchain: str
    amount: str
    amount_usd: str
```

```python
@dataclass
class WalletDto:
    id: str
    store_external_id: str
```

```python
@dataclass
class ConfirmedWebhookResponse:
    type: str
    status: str
    created_at: datetime
    paid_at: datetime
    amount: str
    transactions: TransactionDto
    wallet: WalletDto
```

```python
@dataclass
class UnconfirmedWebhookResponse:
    type: str
    status: str
    created_at: datetime
    paid_at: datetime
    amount: str
    transactions: TransactionDto
    wallet: WalletDto
```

```python
@dataclass
class WithdrawalWebhookResponse:
    type: str
    created_at: datetime
    paid_at: datetime
    amount: str
    transactions: TransactionDto
    withdrawal_id: str
```

### Ejemplo de procesamiento de webhook

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

mapper = WebhookMapper()

def handle_webhook(data: dict):
    webhook = mapper.map_webhook(data)

    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount_usd = webhook.transactions.amount_usd
        tx_id = webhook.transactions.tx_id

        # бизнес-логика пополнения
        print(f"Платёж от {user_id}: {amount_usd} USD, tx_id={tx_id}")
```

---

## Utilidades (`MerchantUtilsManager`)

La clase `MerchantUtilsManager` de `dv_net_client.utils` contiene métodos auxiliares.

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

Verificación de la firma de las solicitudes de DV.net (webhooks).

**Firma:**

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

Algoritmo:

1. El cuerpo de la solicitud se convierte a cadena:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — sin cambios.
2. Se concatena `string_body + client_key`.
3. Se calcula el SHA-256 en hex.
4. El resultado se compara con `client_signature` mediante `hmac.compare_digest`.

**Ejemplo (aiohttp):**

```python
from aiohttp import web
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
SECRET_KEY = "ВАШ_SECRET_KEY"

async def handle_webhook(request: web.Request):
    raw_body = await request.text()
    signature = request.headers.get("X-Signature", "")

    if not utils.check_sign(signature, SECRET_KEY, raw_body):
        return web.Response(status=403, text="invalid signature")

    data = await request.json()
    ...
```

### `generate_link`

Método utilitario para generar un enlace con el esquema `host/store_uuid/client_id?email=...`.

**Firma:**

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## Ejemplo de integración de pago en un bot de Telegram

A continuación — un ejemplo simplificado de integración de pagos de DV.net en un bot de Telegram con `python-telegram-bot` (v20+), utilizando `AsyncMerchantClient` y un servidor aiohttp para webhooks.

### Objetivo

- El comando `/pay` proporciona al usuario un enlace de pago de DV.net.
- Un endpoint HTTP aparte recibe los webhooks de DV.net:
    - verifica la firma;
    - mapea el webhook a un DTO;
    - ante un pago exitoso envía un mensaje al usuario en Telegram.

### Dependencias

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### Configuración

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### Código del bot + webhook

```python
import logging
from aiohttp import web
from telegram import Update
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
)

from dv_net_client import AsyncMerchantClient
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse
from dv_net_client.utils import MerchantUtilsManager

from config import (
    TG_TOKEN, DV_HOST, DV_API_KEY, DV_SECRET_KEY,
    WEBHOOK_PORT, WEBHOOK_PATH,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация SDK
dv_client = AsyncMerchantClient(host=DV_HOST, x_api_key=DV_API_KEY)
webhook_mapper = WebhookMapper()
utils_manager = MerchantUtilsManager()


# 1. Команда /pay — создание платёжной ссылки
async def cmd_pay(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    msg = await update.message.reply_text("Генерирую платёжную ссылку...")

    try:
        resp = await dv_client.get_external_wallet(
            store_external_id=str(user_id),
            amount="5.00",     # сумма платежа
            currency="USD",    # валюта
        )

        if resp and resp.pay_url:
            text = (
                "<b>Счёт на оплату</b>

"
                "Сумма: 5.00 USD
"
                f"Ссылка на оплату: {resp.pay_url}"
            )
            await msg.edit_text(text, parse_mode=ParseMode.HTML)
        else:
            await msg.edit_text("Не удалось получить платёжную ссылку.")
    except Exception as e:
        logger.exception("DV API error")
        await msg.edit_text(f"Ошибка DV API: {e}")


# 2. HTTP-обработчик вебхуков DV.net
async def dv_webhook_handler(request: web.Request):
    # Проверка подписи
    raw_body = await request.text()
    signature = request.headers.get("X-Signature", "")

    if not utils_manager.check_sign(signature, DV_SECRET_KEY, raw_body):
        logger.warning("Invalid DV webhook signature")
        return web.Response(status=403, text="invalid signature")

    # Разбор JSON
    try:
        data = await request.json()
    except Exception:
        return web.Response(status=400, text="invalid json")

    # Маппинг вебхука в DTO
    try:
        webhook = webhook_mapper.map_webhook(data)
    except Exception as e:
        logger.error(f"Webhook mapping failed: {e}")
        return web.json_response({"success": True})

    # Обработка подтверждённого платежа
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        try:
            user_id = int(webhook.wallet.store_external_id)
        except ValueError:
            logger.error("Invalid store_external_id in webhook")
            return web.json_response({"success": True})

        amount_usd = webhook.transactions.amount_usd

        app: Application = request.app["bot_app"]
        await app.bot.send_message(
            chat_id=user_id,
            text=f"Оплата получена. Начислено: {amount_usd} USD.",
            parse_mode=ParseMode.HTML,
        )

    return web.json_response({"success": True})


# 3. Настройка запуска Telegram-бота и aiohttp-сервера
async def on_startup(application: Application):
    # aiohttp-приложение для приёма вебхуков DV.net
    web_app = web.Application()
    web_app["bot_app"] = application
    web_app.router.add_post(WEBHOOK_PATH, dv_webhook_handler)

    runner = web.AppRunner(web_app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", WEBHOOK_PORT)
    await site.start()

    logger.info("DV webhook server started on port %s", WEBHOOK_PORT)


def main():
    app = Application.builder().token(TG_TOKEN).build()

    # Телеграм-хендлеры
    app.add_handler(CommandHandler("pay", cmd_pay))

    # При инициализации бота поднимаем и HTTP-сервер для вебхуков
    app.post_init = on_startup

    app.run_polling()


if __name__ == "__main__":
    main()
```

### Esquema breve del flujo

1. El usuario envía `/pay` en Telegram.
2. El bot llama a `AsyncMerchantClient.get_external_wallet(...)` y envía al usuario `pay_url`.
3. El usuario paga mediante el enlace.
4. DV.net envía un webhook a `http://<su-servidor>:7623/dv/webhook`:
    - la firma se verifica mediante `MerchantUtilsManager.check_sign`;
    - el JSON se mapea con `WebhookMapper.map_webhook`;
    - con `ConfirmedWebhookResponse` y estado `"completed"` el bot obtiene `store_external_id` y el importe, ejecuta la lógica de negocio (por ejemplo, incrementa el balance en la base de datos) y envía un mensaje al usuario.

---