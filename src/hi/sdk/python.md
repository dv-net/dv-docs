# DV.net Python SDK (`dv_net_client`)

DV.net पेमेंट गेटवे के साथ एकीकरण के लिए Python क्लाइंट।

- सिंक्रोनस और असिंक्रोनस दोनों क्लाइंट उपलब्ध हैं।
- सभी मेथड टाइप्ड DTO (dataclass) लौटाते हैं, "कच्चे" dict नहीं।
- वेबहुक्स के साथ काम करने और रिक्वेस्ट सिग्नेचर वेरिफिकेशन के लिए तैयार टूल उपलब्ध हैं।

पैकेज: `dv_net_client`.

---

## इंस्टॉलेशन

```bash
pip install dv-net-client
```

असिंक्रोनस क्लाइंट के लिए अतिरिक्त रूप से `aiohttp` चाहिए:

```bash
pip install aiohttp
```

---

## मूल अवधारणाएँ

### Host और x-api-key

सभी रिक्वेस्ट DV.net API को बेस होस्ट पर भेजी जाती हैं, उदाहरण के लिए:

```python
DV_HOST = "https://cloud.dv.net"
```

ऑथराइजेशन HTTP हैडर `x-api-key` (स्टोर का पब्लिक API-की) के जरिए होता है:

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

इन पैरामीटर्स को आप:

- एक बार क्लाइंट के कंस्ट्रक्टर में;
- या हर मेथड कॉल में (कंस्ट्रक्टर के मानों को ओवरराइड करते हुए)

दे सकते हैं।

यदि `host` या `x_api_key` न तो कंस्ट्रक्टर में और न ही मेथड में दिए गए हैं, तो एक्सेप्शन फेंका जाएगा:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## क्लाइंट्स

SDK दो प्रकार के क्लाइंट प्रदान करता है:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### सिंक्रोनस क्लाइंट

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

डिफॉल्ट रूप से `UrllibHttpClient` (स्टैंडर्ड लाइब्रेरी `urllib` पर आधारित) उपयोग होता है।

### असिंक्रोनस क्लाइंट

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

डिफॉल्ट रूप से `AiohttpHttpClient` (`aiohttp` पर आधारित) उपयोग होता है।

> क्लाइंट्स कंटेक्स्ट मैनेजर (`with` / `async with`) इम्प्लीमेंट नहीं करते।  
> सलाह है कि ऐप स्टार्ट पर एक इंस्टेंस बनाएँ और उसे पुनः उपयोग करें।

---

## त्रुटियाँ और अपवाद

मॉड्यूल की मुख्य एक्सेप्शंस:

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

- `DvNetInvalidRequestException` — रिक्वेस्ट में त्रुटि (4xx)।
- `DvNetServerException` — DV.net की तरफ़ त्रुटि (5xx)।
- `DvNetNetworkException` — नेटवर्क समस्याएँ, टाइमआउट आदि।
- `DvNetInvalidResponseDataException` — रिस्पॉन्स अपेक्षित DTO में मैप नहीं हो पाया।
- `DvNetInvalidWebhookException` — गलत या अज्ञात वेबहुक फ़ॉर्मैट।

क्लाइंट कॉल्स को `try/except` के साथ रैप कर लॉग करना अनुशंसित है।

---

## क्लाइंट मेथड्स

नीचे `MerchantClient` और `AsyncMerchantClient` के लिए कॉमन मेथड्स दिए गए हैं।  
सिग्नेचर समान हैं; फर्क सिर्फ इतना है कि असिंक्रोनस वर्जन में मेथड्स `async` होते हैं और `await` से कॉल किए जाते हैं।

DTO टाइप्स `dv_net_client.dto.merchant_client` से आते हैं।

---

### 1. `get_exchange_balances`

सभी करेंसी और नेटवर्क्स का समग्र स्टोर बैलेंस (exchange-बैलेंस) प्राप्त करना।

```python
total_balance = await async_client.get_exchange_balances()
# или
total_balance = client.get_exchange_balances()
```

सिग्नेचर:

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

वापसी: `TotalExchangeBalanceResponse`:

- `total_usd: str` — USD में कुल बैलेंस।
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` में शामिल है:

- `amount: str` — करेंसी में बैलेंस।
- `amount_usd: str` — USD में समतुल्य।
- `currency: str` — करेंसी कोड।

उदाहरण (async):

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

किसी विशेष उपयोगकर्ता के लिए पेमेंट वॉलेट/लिंक बनाना (या मौजूद हो तो पाना)।

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

सिग्नेचर:

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

पैरामीटर्स:

- `store_external_id` — आपका आंतरिक यूज़र ID (आवश्यक)।
- `email` — उपयोगकर्ता का ईमेल (वैकल्पिक)।
- `ip` — उपयोगकर्ता का IP (वैकल्पिक)।
- `amount` — टॉप-अप राशि (स्ट्रिंग जैसे `"5.00"`)।
- `currency` — करेंसी कोड, जैसे `"USD"`।

वापसी: `ExternalAddressesResponse`:

- `pay_url: str` — पेमेंट लिंक।
- `address: List[AddressDto]` — अलग-अलग ऐड्रेस की सूची।
- `amount_usd: str` — USD में राशि।
- `rates: List[str]` — रेट्स की जानकारी।
- सर्विस फ़ील्ड्स (`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` आदि)।

उदाहरण (async):

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

"प्रोसेसिंग" वॉलेट्स (जहाँ इनकमिंग ट्रांज़ैक्शंस प्रोसेस होती हैं) का बैलेंस।

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

सिग्नेचर:

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

वापसी: `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto` में, विशेष रूप से:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (कोड, नाम, ब्लॉकचेन)
- अतिरिक्त तकनीकी फ़ील्ड्स।

---

### 4. `get_store_currencies`

स्टोर के लिए उपलब्ध करेंसी सूची।

```python
currencies = await async_client.get_store_currencies()
```

सिग्नेचर:

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

वापसी: `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

`CurrencyDto` में शामिल है:

- `id: str` — करेंसी पहचानकर्ता जैसे `"USDT.Tron"`।
- `code: str` — छोटा कोड, जैसे `"USDT"`।
- `name: str` — पठनीय नाम।
- `blockchain: str` — नेटवर्क (उदा., `"Tron"`)।
- `precision: int` और अन्य फ़ील्ड्स।

उदाहरण:

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

किसी विशेष करेंसी का रेट प्राप्त करना।

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

सिग्नेचर:

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

पैरामीटर्स:

- `currency_id` — `get_store_currencies` से मिला ID, जैसे `"USDT.Tron"`।

वापसी: `CurrencyRateResponse`:

- `code: str` — करेंसी कोड।
- `rate` — रेट (डायनेमिक टाइप, आमतौर पर स्ट्रिंग/नंबर)।
- अतिरिक्त फ़ील्ड्स (सोर्स, क्वोट करेंसी आदि)।

---

### 6. `get_withdrawal_processing_status`

प्रोसेसिंग में मौजूद विदड्रॉल का स्टेटस।

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

सिग्नेचर:

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

पैरामीटर्स:

- `withdrawal_id` — पहले प्राप्त विदड्रॉल ID (उदा., `WithdrawalWebhookResponse` या `initialize_transfer` के रिस्पॉन्स से)।

वापसी: `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` आदि।

---

### 7. `initialize_transfer`

स्टोर बैलेंस से बाहरी वॉलेट पर विदड्रॉल इनिशियलाइज़ करना।

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

सिग्नेचर:

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

पैरामीटर्स:

- `address_to` — रिसीवर का एड्रेस (वॉलेट)।
- `currency_id` — `"USDT.Tron"` जैसी करेंसी ID।
- `amount` — विदड्रॉल राशि (स्ट्रिंग)।
- `request_id` — आपका यूनिक रिक्वेस्ट ID (इडेम्पोटेंसी और आपकी सिस्टम से सम्बद्धता के लिए)।

वापसी: `WithdrawalResponse`:

- `id: str` — DV.net में विदड्रॉल ID।
- `address_from: str` — सेंडर का एड्रेस।
- `address_to: str` — रिसीवर का एड्रेस।
- `amount: str`, `amount_usd: str`।
- `currency_id: str`।
- `store_id: str`।
- `created_at: datetime`।
- `transfer_id: Optional[str]` — ऑपरेशन प्रोसेस में होने तक `None` हो सकता है।

---

### 8. `get_hot_wallet_balances`

"हॉट" वॉलेट्स का बैलेंस।

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

सिग्नेचर:

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

वापसी: `AccountDto` की सूची:

- `balance: str`
- `balance_usd: str`
- `count: int` — एड्रेस की संख्या।
- `count_with_balance: int` — नॉन-ज़ीरो बैलेंस वाले एड्रेस की संख्या।
- `currency: CurrencyShortDto` (कोड, नाम, ब्लॉकचेन)।

---

### 9. `delete_withdrawal_from_processing`

प्रोसेसिंग में चल रहे विदड्रॉल को रद्द करना।

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

सिग्नेचर:

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

पैरामीटर्स:

- `withdrawal_id` — वह विदड्रॉल ID जिसे रद्द करना है।

एक्सेप्शंस:

- त्रुटि पर (नहीं मिला, पहले ही पूर्ण, सर्वर त्रुटि आदि) `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException` में से कोई एक फेंका जाएगा।

---

## वेबहुक्स

मॉड्यूल `dv_net_client.mappers` में `WebhookMapper` है, जो इनकमिंग वेबहुक JSON को `dv_net_client.dto.webhook` के किसी DTO में मैप करता है।

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

सिग्नेचर:

```python
map_webhook(data: Dict[str, Any]) -> Any
```

एल्गोरिथ्म:

- यदि `data` में `withdrawal_id` फ़ील्ड है — `WithdrawalWebhookResponse` लौटाता है।
- यदि `type` है — `ConfirmedWebhookResponse` लौटाता है।
- यदि `unconfirmed_type` है — `UnconfirmedWebhookResponse` लौटाता है।
- अन्यथा `DvNetInvalidWebhookException` फेंकता है।

### वेबहुक DTO

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

### वेबहुक प्रोसेसिंग का उदाहरण

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

## यूटिलिटीज़ (`MerchantUtilsManager`)

`dv_net_client.utils` का `MerchantUtilsManager` सहायक मेथड्स प्रदान करता है।

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

DV.net रिक्वेस्ट्स (वेबहुक्स) की सिग्नेचर वेरिफिकेशन।

सिग्नेचर:

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

एल्गोरिथ्म:

1. रिक्वेस्ट बॉडी को स्ट्रिंग में बदला जाता है:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — जैसा है वैसा।
2. `string_body + client_key` को जोड़ा जाता है।
3. SHA-256 का hex निकाला जाता है।
4. परिणाम `client_signature` से `hmac.compare_digest` के जरिए तुलना होता है।

उदाहरण (aiohttp):

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

`host/store_uuid/client_id?email=...` स्कीम के अनुरूप लिंक जेनरेट करने का यूटिलिटी मेथड।

सिग्नेचर:

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## Telegram-बॉट में पेमेंट इंटीग्रेशन का उदाहरण

नीचे — `python-telegram-bot` (v20+) पर `AsyncMerchantClient` और वेबहुक्स के लिए aiohttp सर्वर के साथ DV.net के जरिए पेमेंट एम्बेड करने का सरल उदाहरण।

### कार्य

- कमांड `/pay` उपयोगकर्ता को DV.net पेमेंट लिंक देती है।
- एक अलग HTTP एंडपॉइंट DV.net वेबहुक्स स्वीकार करता है:
    - सिग्नेचर की जाँच करता है;
    - वेबहुक को DTO में मैप करता है;
    - सफल भुगतान पर उपयोगकर्ता को Telegram में मैसेज भेजता है।

### डिपेंडेंसीज़

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### कॉन्फ़िगरेशन

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### बॉट + वेबहुक कोड

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

### संक्षिप्त फ्लो

1. उपयोगकर्ता Telegram में `/pay` भेजता है।
2. बॉट `AsyncMerchantClient.get_external_wallet(...)` कॉल करता है और उपयोगकर्ता को `pay_url` भेजता है।
3. उपयोगकर्ता लिंक से भुगतान करता है।
4. DV.net वेबहुक `http://<आपका-सर्वर>:7623/dv/webhook` पर भेजता है:
    - सिग्नेचर `MerchantUtilsManager.check_sign` से जाँची जाती है;
    - JSON को `WebhookMapper.map_webhook` से DTO में मैप किया जाता है;
    - `ConfirmedWebhookResponse` और `"completed"` स्टेटस पर बॉट `store_external_id` और राशि प्राप्त करता है, बिजनेस-लॉजिक (जैसे DB में बैलेंस बढ़ाना) करता है और उपयोगकर्ता को संदेश भेजता है।

---