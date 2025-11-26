# DV.net Python SDK (`dv_net_client`)

DV.net 결제 게이트웨이와 연동하기 위한 Python 클라이언트입니다.

- 동기 및 비동기 클라이언트를 모두 지원합니다.
- 모든 메서드는 “생(raw)” 딕셔너리 대신 타입 지정된 DTO(dataclass)를 반환합니다.
- 웹훅 처리와 요청 서명 검증을 위한 도구가 제공됩니다.

패키지: `dv_net_client`.

---

## 설치

```bash
pip install dv-net-client
```

비동기 클라이언트를 사용하려면 `aiohttp`가 추가로 필요합니다:

```bash
pip install aiohttp
```

---

## 기본 개념

### Host와 x-api-key

모든 요청은 기본 호스트의 DV.net API로 전송됩니다. 예:

```python
DV_HOST = "https://cloud.dv.net"
```

인증은 HTTP 헤더 `x-api-key`(상점의 공개 API 키)를 통해 수행됩니다:

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

이 파라미터들은 다음 방식으로 전달할 수 있습니다:

- 클라이언트 생성자에서 한 번 설정;
- 또는 각 메서드 호출 시(생성자 값을 재정의).

만약 `host`나 `x_api_key`가 생성자와 메서드 모두에서 지정되지 않으면 다음 예외가 발생합니다:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## 클라이언트

SDK는 두 가지 클라이언트 변형을 제공합니다:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### 동기 클라이언트

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

기본적으로 `UrllibHttpClient`(표준 라이브러리 `urllib` 기반)를 사용합니다.

### 비동기 클라이언트

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

기본적으로 `AiohttpHttpClient`(`aiohttp` 기반)를 사용합니다.

> 클라이언트는 컨텍스트 매니저(`with` / `async with`)를 구현하지 않습니다.  
> 애플리케이션 시작 시 인스턴스를 한 번 생성하여 재사용하는 것을 권장합니다.

---

## 오류와 예외

모듈의 주요 예외:

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

- `DvNetInvalidRequestException` — 요청 오류(4xx).
- `DvNetServerException` — DV.net 서버측 오류(5xx).
- `DvNetNetworkException` — 네트워크 문제, 타임아웃 등.
- `DvNetInvalidResponseDataException` — 응답을 기대한 DTO로 매핑할 수 없음.
- `DvNetInvalidWebhookException` — 잘못됐거나 알 수 없는 웹훅 형식.

클라이언트 호출을 로깅과 함께 `try/except`로 감싸는 것을 권장합니다.

---

## 클라이언트 메서드

아래는 `MerchantClient`와 `AsyncMerchantClient`에 공통인 메서드입니다.  
시그니처는 동일하며, 비동기 버전에서만 메서드가 `async`로 표시되고 `await`로 호출됩니다.

DTO 타입은 `dv_net_client.dto.merchant_client`에서 가져옵니다.

---

### 1. `get_exchange_balances`

모든 통화 및 네트워크에 대한 상점의 합산 잔액(exchange 잔액)을 조회합니다.

```python
total_balance = await async_client.get_exchange_balances()
# или
total_balance = client.get_exchange_balances()
```

**시그니처:**

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

**반환:** `TotalExchangeBalanceResponse`:

- `total_usd: str` — USD 기준 합계 잔액.
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` 포함:

- `amount: str` — 해당 통화 잔액.
- `amount_usd: str` — USD 환산액.
- `currency: str` — 통화 코드.

**예시(async):**

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

특정 사용자에 대한 결제 지갑/결제 링크를 생성(또는 기존 것이 있으면 조회)합니다.

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

**시그니처:**

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

매개변수:

- `store_external_id` — 내부 사용자 ID(필수).
- `email` — 사용자 이메일(선택).
- `ip` — 사용자 IP(선택).
- `amount` — 충전 금액(문자열, 예: `"5.00"`).
- `currency` — 통화 코드, 예: `"USD"`.

**반환:** `ExternalAddressesResponse`:

- `pay_url: str` — 결제 링크.
- `address: List[AddressDto]` — 개별 주소 목록.
- `amount_usd: str` — USD 기준 금액.
- `rates: List[str]` — 환율 정보.
- 서비스용 필드(`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` 등).

**예시(async):**

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

입금 트랜잭션을 처리하는 ‘프로세싱’ 지갑들의 잔액.

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

**시그니처:**

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

**반환:** `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto`는 특히 다음을 포함:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (코드, 이름, 블록체인)
- 기타 기술적 필드.

---

### 4. `get_store_currencies`

상점에서 사용 가능한 통화 목록.

```python
currencies = await async_client.get_store_currencies()
```

**시그니처:**

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

**반환:** `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

`CurrencyDto` 포함:

- `id: str` — `"USDT.Tron"` 형태의 통화 식별자.
- `code: str` — 짧은 코드, 예: `"USDT"`.
- `name: str` — 사람이 읽기 쉬운 이름.
- `blockchain: str` — 네트워크(예: `"Tron"`).
- `precision: int` 및 기타 필드.

**예시:**

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

특정 통화의 환율을 조회합니다.

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

**시그니처:**

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

매개변수:

- `currency_id` — `get_store_currencies`에서 얻은 ID, 예: `"USDT.Tron"`.

**반환:** `CurrencyRateResponse`:

- `code: str` — 통화 코드.
- `rate` — 환율(동적 타입, 보통 문자열/숫자).
- 추가 필드(소스, 견적 통화 등).

---

### 6. `get_withdrawal_processing_status`

처리 중인 출금의 상태.

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

**시그니처:**

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

매개변수:

- `withdrawal_id` — 이전에 받은 출금 ID(예: `WithdrawalWebhookResponse` 또는 `initialize_transfer`의 응답에서).

**반환:** `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` 등.

---

### 7. `initialize_transfer`

상점 잔액에서 외부 지갑으로의 출금을 초기화합니다.

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

**시그니처:**

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

매개변수:

- `address_to` — 수신자 주소(지갑).
- `currency_id` — `"USDT.Tron"` 형태의 통화 ID.
- `amount` — 출금 금액(문자열).
- `request_id` — 요청의 고유 ID(멱등성 및 내부 시스템과의 연계를 위해).

**반환:** `WithdrawalResponse`:

- `id: str` — DV.net 내 출금 ID.
- `address_from: str` — 송신자 주소.
- `address_to: str` — 수신자 주소.
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — 처리 중일 때는 `None`일 수 있습니다.

---

### 8. `get_hot_wallet_balances`

‘핫’ 지갑들의 잔액.

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

**시그니처:**

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

**반환:** `AccountDto` 목록:

- `balance: str`
- `balance_usd: str`
- `count: int` — 주소 개수.
- `count_with_balance: int` — 잔액이 0이 아닌 주소 개수.
- `currency: CurrencyShortDto` (코드, 이름, 블록체인).

---

### 9. `delete_withdrawal_from_processing`

처리 중인 출금을 취소합니다.

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

**시그니처:**

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

매개변수:

- `withdrawal_id` — 취소할 출금의 ID.

예외:

- 오류(미존재, 이미 완료됨, 서버 오류 등) 시 `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException` 중 하나가 발생합니다.

---

## 웹훅

모듈 `dv_net_client.mappers`에는 `WebhookMapper`가 포함되어 있으며, 들어오는 웹훅 JSON을 `dv_net_client.dto.webhook`의 DTO 중 하나로 변환합니다.

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

**시그니처:**

```python
map_webhook(data: Dict[str, Any]) -> Any
```

알고리즘:

- `data`에 `withdrawal_id` 필드가 있으면 `WithdrawalWebhookResponse`를 반환합니다.
- `type` 필드가 있으면 `ConfirmedWebhookResponse`를 반환합니다.
- `unconfirmed_type` 필드가 있으면 `UnconfirmedWebhookResponse`를 반환합니다.
- 그 외의 경우 `DvNetInvalidWebhookException`이 발생합니다.

### 웹훅 DTO

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

### 웹훅 처리 예시

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

## 유틸리티(`MerchantUtilsManager`)

`dv_net_client.utils`의 `MerchantUtilsManager` 클래스는 보조 메서드를 제공합니다.

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

DV.net 요청(웹훅)의 서명을 검증합니다.

**시그니처:**

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

알고리즘:

1. 요청 본문을 문자열로 변환:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — 그대로 사용.
2. `string_body + client_key`를 이어 붙입니다.
3. SHA-256 해시를 hex로 계산합니다.
4. 결과를 `hmac.compare_digest`로 `client_signature`와 비교합니다.

**예시(aiohttp):**

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

`host/store_uuid/client_id?email=...` 형태의 링크를 생성하는 유틸리티 메서드입니다.

**시그니처:**

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## Telegram 봇에 결제 연동 예시

아래는 `AsyncMerchantClient`와 웹훅용 aiohttp 서버를 사용하여 DV.net 결제를 `python-telegram-bot`(v20+)에 연동하는 단순화된 예시입니다.

### 목표

- 명령어 `/pay`는 사용자에게 DV.net 결제 링크를 제공합니다.
- 별도의 HTTP 엔드포인트가 DV.net 웹훅을 수신:
    - 서명 검증;
    - 웹훅을 DTO로 매핑;
    - 성공 결제 시 Telegram에서 사용자에게 메시지 전송.

### 의존성

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### 설정

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### 봇 + 웹훅 코드

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

### 간단한 흐름

1. 사용자가 Telegram에서 `/pay`를 보냅니다.
2. 봇이 `AsyncMerchantClient.get_external_wallet(...)`를 호출하여 사용자에게 `pay_url`을 보냅니다.
3. 사용자가 링크로 결제합니다.
4. DV.net이 `http://<your-server>:7623/dv/webhook`로 웹훅을 전송:
    - 서명은 `MerchantUtilsManager.check_sign`로 검증;
    - JSON은 `WebhookMapper.map_webhook`으로 매핑;
    - `ConfirmedWebhookResponse`이며 상태가 `"completed"`인 경우 봇이 `store_external_id`와 금액을 받아 비즈니스 로직(예: DB 잔액 증가)을 수행하고 사용자에게 메시지를 전송합니다.

---