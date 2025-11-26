# DV.net Python SDK (`dv_net_client`)

عميل بايثون للتكامل مع بوابة الدفع DV.net.

- يدعم نسختي العميل المتزامن وغير المتزامن.
- جميع الطرق تعيد كائنات DTO مُقننة النوع (dataclass)، وليس قواميس «خام».
- توجد أدوات جاهزة للعمل مع الويبهوكات والتحقق من توقيع الطلبات.

الحزمة: `dv_net_client`.

---

## التثبيت

```bash
pip install dv-net-client
```

للعميل غير المتزامن تحتاج أيضاً إلى `aiohttp`:

```bash
pip install aiohttp
```

---

## المفاهيم الأساسية

### المضيف و x-api-key

تُرسل جميع الطلبات إلى واجهة DV.net عبر مضيف أساسي، مثلاً:

```python
DV_HOST = "https://cloud.dv.net"
```

يتم التفويض عبر ترويسة HTTP باسم `x-api-key` (مفتاح واجهة برمجة التطبيقات العام للمتجر):

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

يمكن تمرير هذه المعاملات:

- مرة واحدة في مُنشئ العميل؛
- أو لكل طريقة (مع تجاوز قيم المُنشئ).

إذا لم يتم تحديد `host` أو `x_api_key` لا في المُنشئ ولا في الطريقة، سيتم رمي الاستثناءين:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## العملاء

يوفر SDK نوعين من العميل:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### عميل متزامن

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

يُستخدم افتراضياً `UrllibHttpClient` (مبني على مكتبة بايثون المعيارية `urllib`).

### عميل غير متزامن

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

يُستخدم افتراضياً `AiohttpHttpClient` (مبني على `aiohttp`).

> العملاء لا يطبّقون مدير سياق (`with` / `async with`).  
> يُنصح بإنشاء نسخة واحدة عند بدء التطبيق وإعادة استخدامها.

---

## الأخطاء والاستثناءات

الاستثناءات الرئيسية في الوحدة:

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

- `DvNetInvalidRequestException` — خطأ في الطلب (4xx).
- `DvNetServerException` — خطأ من طرف DV.net (5xx).
- `DvNetNetworkException` — مشاكل شبكة، انتهاء مهلة، إلخ.
- `DvNetInvalidResponseDataException` — تعذر مطابقة الاستجابة مع DTO المتوقع.
- `DvNetInvalidWebhookException` — تنسيق ويبهوك غير صحيح أو غير معروف.

يُنصح بتغليف استدعاءات العميل في `try/except` مع التسجيل (logging).

---

## طرق العميل

أدناه وصف للطرق المشتركة بين `MerchantClient` و`AsyncMerchantClient`.  
التواقيع متطابقة، باستثناء أن النسخة غير المتزامنة تُعلَّم بالكلمة المفتاحية `async` ويتم استدعاؤها عبر `await`.

تُؤخذ أنواع DTO من `dv_net_client.dto.merchant_client`.

---

### 1. `get_exchange_balances`

الحصول على رصيد المتجر الإجمالي عبر جميع العملات والشبكات (exchange-balance).

```python
total_balance = await async_client.get_exchange_balances()
# أو
total_balance = client.get_exchange_balances()
```

**التوقيع:**

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

**يُرجع:** `TotalExchangeBalanceResponse`:

- `total_usd: str` — الرصيد الإجمالي بالدولار الأمريكي.
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` يحتوي على:

- `amount: str` — الرصيد بالعملة.
- `amount_usd: str` — ما يعادله بالدولار الأمريكي.
- `currency: str` — رمز العملة.

**مثال (async):**

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

إنشاء (أو الحصول على الموجود) محفظة/رابط دفع لمستخدم محدد.

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

**التوقيع:**

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

المعاملات:

- `store_external_id` — المعرّف الداخلي الخاص بك للمستخدم (إلزامي).
- `email` — بريد المستخدم الإلكتروني (اختياري).
- `ip` — عنوان IP للمستخدم (اختياري).
- `amount` — مبلغ الشحن (كسلسلة، مثلاً `"5.00"`).
- `currency` — رمز العملة، مثلاً `"USD"`.

**يُرجع:** `ExternalAddressesResponse`:

- `pay_url: str` — رابط الدفع.
- `address: List[AddressDto]` — قائمة العناوين الفردية.
- `amount_usd: str` — المبلغ بالدولار الأمريكي.
- `rates: List[str]` — معلومات عن أسعار الصرف.
- حقول خدمية (`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` إلخ).

**مثال (async):**

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

رصيد المحافظ «المعالجة» (حيث تتم معالجة المعاملات الواردة).

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

**التوقيع:**

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

**يُرجع:** `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

يشمل `ProcessingWalletBalanceDto` على سبيل المثال:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (الرمز، الاسم، البلوكشين)
- حقول تقنية إضافية.

---

### 4. `get_store_currencies`

قائمة العملات المتاحة للمتجر.

```python
currencies = await async_client.get_store_currencies()
```

**التوقيع:**

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

**يُرجع:** `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

يحتوي `CurrencyDto` على:

- `id: str` — معرّف العملة بالشكل `"USDT.Tron"`.
- `code: str` — الرمز المختصر، مثل `"USDT"`.
- `name: str` — اسم قابل للقراءة.
- `blockchain: str` — الشبكة (مثلاً `"Tron"`).
- `precision: int` وحقول أخرى.

**مثال:**

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

الحصول على سعر صرف عملة محددة.

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

**التوقيع:**

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

المعاملات:

- `currency_id` — المعرّف من `get_store_currencies`، مثلاً `"USDT.Tron"`.

**يُرجع:** `CurrencyRateResponse`:

- `code: str` — رمز العملة.
- `rate` — السعر (نوع ديناميكي، غالباً سلسلة/رقم).
- حقول إضافية (المصدر، عملة التسعير، إلخ).

---

### 6. `get_withdrawal_processing_status`

حالة عملية سحب قيد المعالجة.

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

**التوقيع:**

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

المعاملات:

- `withdrawal_id` — معرّف السحب الذي تم الحصول عليه سابقاً (مثلاً من `WithdrawalWebhookResponse` أو استجابة `initialize_transfer`).

**يُرجع:** `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` وغيرها.

---

### 7. `initialize_transfer`

تهيئة سحب الأموال من رصيد المتجر إلى محفظة خارجية.

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

**التوقيع:**

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

المعاملات:

- `address_to` — عنوان المستلم (المحفظة).
- `currency_id` — معرّف العملة بالشكل `"USDT.Tron"`.
- `amount` — مبلغ السحب (كسلسلة).
- `request_id` — معرّفك الفريد للطلب (لضمان عدم التكرار وربط الطلب بنظامك).

**يُرجع:** `WithdrawalResponse`:

- `id: str` — معرّف السحب في DV.net.
- `address_from: str` — عنوان المرسل.
- `address_to: str` — عنوان المستلم.
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — قد تكون `None` بينما العملية قيد التنفيذ.

---

### 8. `get_hot_wallet_balances`

رصيد المحافظ «الساخنة».

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

**التوقيع:**

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

**يُرجع:** قائمة `AccountDto`:

- `balance: str`
- `balance_usd: str`
- `count: int` — عدد العناوين.
- `count_with_balance: int` — عدد العناوين ذات الرصيد غير الصفري.
- `currency: CurrencyShortDto` (الرمز، الاسم، البلوكشين).

---

### 9. `delete_withdrawal_from_processing`

إلغاء سحب قيد المعالجة.

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

**التوقيع:**

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

المعاملات:

- `withdrawal_id` — معرّف السحب المطلوب إلغاؤه.

الاستثناءات:

- عند حدوث خطأ (غير موجود، مُكتمل بالفعل، خطأ خادم، إلخ) سيتم رمي أحد: `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException`.

---

## الويبهوكات

تحتوي الوحدة `dv_net_client.mappers` على `WebhookMapper` الذي يحوّل JSON الوارد من الويبهوك إلى أحد كائنات DTO من `dv_net_client.dto.webhook`.

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

**التوقيع:**

```python
map_webhook(data: Dict[str, Any]) -> Any
```

الخوارزمية:

- إذا كان في `data` الحقل `withdrawal_id` — يُرجع `WithdrawalWebhookResponse`.
- إذا كان هناك الحقل `type` — يُرجع `ConfirmedWebhookResponse`.
- إذا كان هناك الحقل `unconfirmed_type` — يُرجع `UnconfirmedWebhookResponse`.
- خلاف ذلك يتم رمي `DvNetInvalidWebhookException`.

### كائنات DTO للويبهوك

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

### مثال على معالجة الويبهوك

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

## الأدوات (`MerchantUtilsManager`)

تحتوي الفئة `MerchantUtilsManager` من `dv_net_client.utils` على طرق مساعدة.

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

التحقق من توقيع طلبات DV.net (الويبهوكات).

**التوقيع:**

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

الخوارزمية:

1. يتم تحويل جسم الطلب إلى سلسلة:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — دون تغيير.
2. يتم ربط `string_body + client_key`.
3. يُحسب SHA-256 بصيغة hex.
4. تتم مقارنة الناتج مع `client_signature` عبر `hmac.compare_digest`.

**مثال (aiohttp):**

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

طريقة مساعدة لإنشاء رابط وفق النمط `host/store_uuid/client_id?email=...`.

**التوقيع:**

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## مثال دمج الدفع في بوت تيليغرام

فيما يلي مثال مبسّط لدمج الدفع عبر DV.net في بوت تيليغرام باستخدام `python-telegram-bot` (v20+) مع `AsyncMerchantClient` وخادم aiohttp للويبهوكات.

### المهمة

- الأمر `/pay` يعطي المستخدم رابط دفع من DV.net.
- مسار HTTP منفصل يستقبل ويبهوكات DV.net:
    - يتحقق من التوقيع؛
    - يحوّل الويبهوك إلى DTO؛
    - عند الدفع الناجح يرسل رسالة للمستخدم في تيليغرام.

### التبعيات

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### الإعداد

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### كود البوت + الويبهوك

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

### مخطط تبادل مختصر

1. يرسل المستخدم الأمر `/pay` في تيليغرام.
2. يستدعي البوت `AsyncMerchantClient.get_external_wallet(...)` ويرسل للمستخدم `pay_url`.
3. يُتم المستخدم الدفع عبر الرابط.
4. يرسل DV.net ويبهوك إلى `http://<your-server>:7623/dv/webhook`:
    - يتم التحقق من التوقيع عبر `MerchantUtilsManager.check_sign`;
    - يُحوَّل JSON عبر `WebhookMapper.map_webhook`;
    - عند `ConfirmedWebhookResponse` بالحالة `"completed"` يحصل البوت على `store_external_id` والمبلغ، ينفّذ منطق العمل (مثلاً زيادة الرصيد في قاعدة البيانات) ويرسل رسالة للمستخدم.

---