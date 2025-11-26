# DV.net Python SDK (`dv_net_client`)

用于与 DV.net 支付网关集成的 Python 客户端。

- 支持同步和异步两种客户端。
- 所有方法返回带类型的 DTO（dataclass），而不是“原始”字典。
- 提供用于处理 webhook 和验证请求签名的现成工具。

包：`dv_net_client`。

---

## 安装

```bash
pip install dv-net-client
```

对于异步客户端还需要 `aiohttp`：

```bash
pip install aiohttp
```

---

## 基本概念

### Host 与 x-api-key

所有请求都会发送到 DV.net API 的基础主机，例如：

```python
DV_HOST = "https://cloud.dv.net"
```

认证通过 HTTP 头 `x-api-key`（商户的公共 API 密钥）完成：

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

这些参数可以：

- 在创建客户端时传入一次；
- 或在每个方法中传入（覆盖构造器中的值）。

如果既未在构造器也未在方法中设置 `host` 或 `x_api_key`，将抛出异常：

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## 客户端

SDK 提供两种客户端：

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### 同步客户端

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

默认使用 `UrllibHttpClient`（基于标准库 `urllib`）。

### 异步客户端

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

默认使用 `AiohttpHttpClient`（基于 `aiohttp`）。

> 客户端未实现上下文管理器（`with` / `async with`）。  
> 建议在应用启动时创建一个实例并复用。

---

## 错误与异常

模块中的主要异常：

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

- `DvNetInvalidRequestException` — 请求错误（4xx）。
- `DvNetServerException` — DV.net 端错误（5xx）。
- `DvNetNetworkException` — 网络问题、超时等。
- `DvNetInvalidResponseDataException` — 无法将响应映射到预期的 DTO。
- `DvNetInvalidWebhookException` — webhook 格式错误或未知。

建议用 `try/except` 包裹客户端调用并进行日志记录。

---

## 客户端方法

下文描述 `MerchantClient` 与 `AsyncMerchantClient` 共有的方法。  
签名相同，唯一区别是异步版本的方法使用 `async` 并通过 `await` 调用。

DTO 类型来自 `dv_net_client.dto.merchant_client`。

---

### 1. `get_exchange_balances`

获取商户在所有货币与网络上的汇总余额（exchange 余额）。

```python
total_balance = await async_client.get_exchange_balances()
# или
total_balance = client.get_exchange_balances()
```

签名：

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

返回：`TotalExchangeBalanceResponse`：

- `total_usd: str` — 总余额（USD）。
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` 包含：

- `amount: str` — 该币种余额。
- `amount_usd: str` — 折合 USD。
- `currency: str` — 币种代码。

示例（async）：

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

为指定用户创建（或获取现有的）收款钱包/支付链接。

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

签名：

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

参数：

- `store_external_id` — 您的用户内部 ID（必填）。
- `email` — 用户邮箱（可选）。
- `ip` — 用户 IP（可选）。
- `amount` — 充值金额（字符串，例如 `"5.00"`）。
- `currency` — 币种代码，例如 `"USD"`。

返回：`ExternalAddressesResponse`：

- `pay_url: str` — 支付链接。
- `address: List[AddressDto]` — 各个收款地址列表。
- `amount_usd: str` — USD 金额。
- `rates: List[str]` — 汇率信息。
- 其他服务字段（`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` 等）。

示例（async）：

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

“处理”钱包（用于处理入站交易）的余额。

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

签名：

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

返回：`ProcessingWalletsBalancesResponse`：

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto` 特别包含：

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (код, название, блокчейн)
- 其他技术字段。

---

### 4. `get_store_currencies`

商户可用的币种列表。

```python
currencies = await async_client.get_store_currencies()
```

签名：

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

返回：`CurrenciesResponse`：

- `currencies: List[CurrencyDto]`

`CurrencyDto` 包含：

- `id: str` — 币种标识，如 `"USDT.Tron"`。
- `code: str` — 简称，例如 `"USDT"`。
- `name: str` — 人类可读名称。
- `blockchain: str` — 网络（例如 `"Tron"`）。
- `precision: int` 及其他字段。

示例：

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

获取指定币种的汇率。

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

签名：

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

参数：

- `currency_id` — 来自 `get_store_currencies` 的 ID，例如 `"USDT.Tron"`。

返回：`CurrencyRateResponse`：

- `code: str` — 币种代码。
- `rate` — 汇率（动态类型，通常为字符串/数字）。
- 其他字段（来源、报价货币等）。

---

### 6. `get_withdrawal_processing_status`

正在处理中的提现状态。

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

签名：

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

参数：

- `withdrawal_id` — 提现 ID，之前获取（例如来自 `WithdrawalWebhookResponse` 或 `initialize_transfer` 的响应）。

返回：`ProcessingWithdrawalResponse`：

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- 以及 `created_at`、`updated_at` 等。

---

### 7. `initialize_transfer`

从商户余额向外部钱包发起提现。

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

签名：

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

参数：

- `address_to` — 收款地址（钱包）。
- `currency_id` — 币种 ID，如 `"USDT.Tron"`。
- `amount` — 提现金额（字符串）。
- `request_id` — 您的请求唯一 ID（用于幂等性以及与您系统的关联）。

返回：`WithdrawalResponse`：

- `id: str` — DV.net 中的提现 ID。
- `address_from: str` — 付款地址。
- `address_to: str` — 收款地址。
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — 在操作进行中时可能为 `None`。

---

### 8. `get_hot_wallet_balances`

“热钱包”的余额。

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

签名：

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

返回：`AccountDto` 列表：

- `balance: str`
- `balance_usd: str`
- `count: int` — 地址数量。
- `count_with_balance: int` — 余额非零的地址数量。
- `currency: CurrencyShortDto` (код, название, блокчейн).

---

### 9. `delete_withdrawal_from_processing`

取消正在处理中的提现。

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

签名：

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

参数：

- `withdrawal_id` — 需要取消的提现 ID。

异常：

- 发生错误（未找到、已完成、服务器错误等）时，将抛出 `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException` 之一。

---

## Webhook

模块 `dv_net_client.mappers` 提供 `WebhookMapper`，可将接收到的 webhook JSON 映射为 `dv_net_client.dto.webhook` 中的某个 DTO。

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

签名：

```python
map_webhook(data: Dict[str, Any]) -> Any
```

处理逻辑：

- 如果 `data` 中包含 `withdrawal_id` 字段，返回 `WithdrawalWebhookResponse`。
- 如果包含 `type` 字段，返回 `ConfirmedWebhookResponse`。
- 如果包含 `unconfirmed_type` 字段，返回 `UnconfirmedWebhookResponse`。
- 否则抛出 `DvNetInvalidWebhookException`。

### Webhook 的 DTO

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

### Webhook 处理示例

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

## 工具（`MerchantUtilsManager`）

`dv_net_client.utils` 中的 `MerchantUtilsManager` 提供辅助方法。

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

验证 DV.net 请求（webhook）的签名。

签名：

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

算法：

1. 将请求体转换为字符串：
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — 不变。
2. 拼接 `string_body + client_key`。
3. 计算 SHA-256 的十六进制字符串。
4. 使用 `hmac.compare_digest` 与 `client_signature` 比较。

示例（aiohttp）：

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

生成形如 `host/store_uuid/client_id?email=...` 的链接的工具方法。

签名：

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## 将支付集成到 Telegram 机器人的示例

下面是将 DV.net 支付集成到使用 `python-telegram-bot`（v20+）的 Telegram 机器人中的简化示例，使用 `AsyncMerchantClient` 和用于接收 webhook 的 aiohttp 服务器。

### 目标

- 命令 `/pay` 给用户返回 DV.net 支付链接。
- 另一个 HTTP 端点接收 DV.net 的 webhook：
    - 验证签名；
    - 将 webhook 映射为 DTO；
    - 支付成功时给用户发送 Telegram 消息。

### 依赖

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### 配置

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### 机器人 + webhook 代码

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

### 流程简述

1. 用户在 Telegram 中发送 `/pay`。
2. 机器人调用 `AsyncMerchantClient.get_external_wallet(...)` 并向用户发送 `pay_url`。
3. 用户按链接完成支付。
4. DV.net 向 `http://<your-serverр>:7623/dv/webhook` 发送 webhook：
    - 使用 `MerchantUtilsManager.check_sign` 校验签名；
    - 使用 `WebhookMapper.map_webhook` 映射 JSON；
    - 若收到状态为 `"completed"` 的 `ConfirmedWebhookResponse`，机器人获取 `store_external_id` 和金额，执行业务逻辑（例如增加数据库余额），并向用户发送消息。

---