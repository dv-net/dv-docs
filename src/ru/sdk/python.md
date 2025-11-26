# DV.net Python SDK (`dv_net_client`)

Python-клиент для интеграции с платежным шлюзом DV.net.

- Поддерживаются синхронный и асинхронный варианты клиента.
- Все методы возвращают типизированные DTO (dataclass), а не «сырые» словари.
- Есть готовые инструменты для работы с вебхуками и проверки подписи запросов.

Пакет: `dv_net_client`.

---

## Установка

```bash
pip install dv-net-client
```

Для асинхронного клиента дополнительно нужен `aiohttp`:

```bash
pip install aiohttp
```

---

## Базовые понятия

### Host и x-api-key

Все запросы идут к API DV.net по базовому хосту, например:

```python
DV_HOST = "https://cloud.dv.net"
```

Авторизация осуществляется через HTTP-заголовок `x-api-key` (публичный API-ключ магазина):

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

Эти параметры можно передавать:

- один раз в конструктор клиента;
- либо в каждый метод (переопределяя значения конструктора).

Если `host` или `x_api_key` не заданы ни в конструкторе, ни в методе, будет выброшено исключение:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## Клиенты

SDK предоставляет два варианта клиента:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### Синхронный клиент

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

По умолчанию используется `UrllibHttpClient` (на базе стандартной библиотеки `urllib`).

### Асинхронный клиент

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

По умолчанию используется `AiohttpHttpClient` (на базе `aiohttp`).

> Клиенты не реализуют контекстный менеджер (`with` / `async with`).  
> Рекомендуется создать экземпляр один раз при старте приложения и переиспользовать.

---

## Ошибки и исключения

Основные исключения модуля:

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

- `DvNetInvalidRequestException` — ошибка в запросе (4xx).
- `DvNetServerException` — ошибка на стороне DV.net (5xx).
- `DvNetNetworkException` — сетевые проблемы, таймауты и т.п.
- `DvNetInvalidResponseDataException` — ответ не удалось замапить в ожидаемый DTO.
- `DvNetInvalidWebhookException` — неправильный или неизвестный формат вебхука.

Рекомендуется оборачивать вызовы клиента в `try/except` с логированием.

---

## Методы клиента

Ниже описаны методы, общие для `MerchantClient` и `AsyncMerchantClient`.  
Сигнатуры одинаковые, отличаются только тем, что в асинхронном варианте методы помечены ключевым словом `async` и вызываются через `await`.

Типы DTO берутся из `dv_net_client.dto.merchant_client`.

---

### 1. `get_exchange_balances`

Получение сводного баланса магазина по всем валютам и сетям (exchange-баланс).

```python
total_balance = await async_client.get_exchange_balances()
# или
total_balance = client.get_exchange_balances()
```

**Сигнатура:**

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

**Возвращает:** `TotalExchangeBalanceResponse`:

- `total_usd: str` — суммарный баланс в USD.
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` содержит:

- `amount: str` — баланс в валюте.
- `amount_usd: str` — эквивалент в USD.
- `currency: str` — код валюты.

**Пример (async):**

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

Создание (или получение существующего) платёжного кошелька/ссылки для конкретного пользователя.

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

**Сигнатура:**

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

Параметры:

- `store_external_id` — ваш внутренний ID пользователя (обязателен).
- `email` — email пользователя (опционально).
- `ip` — IP пользователя (опционально).
- `amount` — сумма пополнения (строкой, например `"5.00"`).
- `currency` — код валюты, например `"USD"`.

**Возвращает:** `ExternalAddressesResponse`:

- `pay_url: str` — платёжная ссылка.
- `address: List[AddressDto]` — список отдельных адресов.
- `amount_usd: str` — сумма в USD.
- `rates: List[str]` — информация о курсах.
- служебные поля (`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` и т.д.).

**Пример (async):**

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

Баланс «процессинговых» кошельков (там, где обрабатываются входящие транзакции).

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

**Сигнатура:**

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

**Возвращает:** `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto` включает, в частности:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (код, название, блокчейн)
- дополнительные технические поля.

---

### 4. `get_store_currencies`

Список валют, доступных магазину.

```python
currencies = await async_client.get_store_currencies()
```

**Сигнатура:**

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

**Возвращает:** `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

`CurrencyDto` содержит:

- `id: str` — идентификатор валюты вида `"USDT.Tron"`.
- `code: str` — краткий код, например `"USDT"`.
- `name: str` — человекочитаемое название.
- `blockchain: str` — сеть (например, `"Tron"`).
- `precision: int` и другие поля.

**Пример:**

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

Получение курса конкретной валюты.

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

**Сигнатура:**

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

Параметры:

- `currency_id` — ID из `get_store_currencies`, например `"USDT.Tron"`.

**Возвращает:** `CurrencyRateResponse`:

- `code: str` — код валюты.
- `rate` — курс (тип динамический, обычно строка/число).
- дополнительные поля (источник, валюта котировки и т.п.).

---

### 6. `get_withdrawal_processing_status`

Статус вывода средств, находящегося в обработке.

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

**Сигнатура:**

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

Параметры:

- `withdrawal_id` — ID вывода, полученный ранее (например, из `WithdrawalWebhookResponse` или ответа `initialize_transfer`).

**Возвращает:** `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` и др.

---

### 7. `initialize_transfer`

Инициализация вывода средств с баланса магазина на внешний кошелёк.

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

**Сигнатура:**

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

Параметры:

- `address_to` — адрес получателя (кошелёк).
- `currency_id` — ID валюты вида `"USDT.Tron"`.
- `amount` — сумма вывода (строкой).
- `request_id` — ваш уникальный ID запроса (для идемпотентности и связи с вашей системой).

**Возвращает:** `WithdrawalResponse`:

- `id: str` — ID вывода в DV.net.
- `address_from: str` — адрес отправителя.
- `address_to: str` — адрес получателя.
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — может быть `None`, пока операция в процессе.

---

### 8. `get_hot_wallet_balances`

Баланс «горячих» кошельков.

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

**Сигнатура:**

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

**Возвращает:** список `AccountDto`:

- `balance: str`
- `balance_usd: str`
- `count: int` — количество адресов.
- `count_with_balance: int` — количество адресов с ненулевым балансом.
- `currency: CurrencyShortDto` (код, название, блокчейн).

---

### 9. `delete_withdrawal_from_processing`

Отмена вывода в обработке.

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

**Сигнатура:**

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

Параметры:

- `withdrawal_id` — ID вывода, который нужно отменить.

Исключения:

- При ошибке (не найден, уже завершён, ошибка сервера и т.п.) будет выброшено одно из `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException`.

---

## Вебхуки

Модуль `dv_net_client.mappers` содержит `WebhookMapper`, который преобразует входящий JSON вебхука в один из DTO из `dv_net_client.dto.webhook`.

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

**Сигнатура:**

```python
map_webhook(data: Dict[str, Any]) -> Any
```

Алгоритм:

- Если в `data` есть поле `withdrawal_id` — возвращает `WithdrawalWebhookResponse`.
- Если есть поле `type` — возвращает `ConfirmedWebhookResponse`.
- Если есть поле `unconfirmed_type` — возвращает `UnconfirmedWebhookResponse`.
- В противном случае выбрасывается `DvNetInvalidWebhookException`.

### DTO вебхуков

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

### Пример обработки вебхука

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

## Утилиты (`MerchantUtilsManager`)

Класс `MerchantUtilsManager` из `dv_net_client.utils` содержит вспомогательные методы.

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

Проверка подписи запросов DV.net (вебхуки).

**Сигнатура:**

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

Алгоритм:

1. Тело запроса приводится к строке:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — без изменений.
2. Склеивается `string_body + client_key`.
3. Вычисляется SHA-256 в hex.
4. Результат сравнивается с `client_signature` через `hmac.compare_digest`.

**Пример (aiohttp):**

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

Утилитарный метод для генерации ссылки по схеме `host/store_uuid/client_id?email=...`.

**Сигнатура:**

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## Пример интеграции оплаты в Telegram-бот

Ниже — упрощённый пример встройки оплаты через DV.net в Telegram-бот на `python-telegram-bot` (v20+) с использованием `AsyncMerchantClient` и aiohttp-сервера для вебхуков.

### Задача

- Команда `/pay` выдаёт пользователю платёжную ссылку DV.net.
- Отдельный HTTP-эндпоинт принимает вебхуки DV.net:
    - проверяет подпись;
    - маппит вебхук в DTO;
    - при успешной оплате отправляет сообщение пользователю в Telegram.

### Зависимости

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### Конфигурация

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### Код бота + вебхука

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

### Краткая схема обмена

1. Пользователь отправляет `/pay` в Telegram.
2. Бот вызывает `AsyncMerchantClient.get_external_wallet(...)` и отправляет пользователю `pay_url`.
3. Пользователь оплачивает по ссылке.
4. DV.net отправляет вебхук на `http://<ваш-сервер>:7623/dv/webhook`:
    - подпись проверяется через `MerchantUtilsManager.check_sign`;
    - JSON маппится через `WebhookMapper.map_webhook`;
    - при `ConfirmedWebhookResponse` со статусом `"completed"` бот получает `store_external_id` и сумму, выполняет бизнес-логику (например, увеличивает баланс в базе) и отправляет пользователю сообщение.

---

