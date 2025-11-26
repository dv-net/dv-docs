# DV.net Python SDK (`dv_net_client`)

Python-Client für die Integration mit dem Zahlungs-Gateway DV.net.

- Sowohl synchrone als auch asynchrone Client-Varianten werden unterstützt.
- Alle Methoden geben typisierte DTOs (dataclass) zurück, keine „rohen“ Dictionaries.
- Es gibt fertige Werkzeuge für Webhooks und die Prüfung von Signaturen von Anfragen.

Paket: `dv_net_client`.

---

## Installation

```bash
pip install dv-net-client
```

Für den asynchronen Client wird zusätzlich `aiohttp` benötigt:

```bash
pip install aiohttp
```

---

## Grundbegriffe

### Host und x-api-key

Alle Anfragen gehen an die DV.net-API über den Basis-Host, z. B.:

```python
DV_HOST = "https://cloud.dv.net"
```

Die Autorisierung erfolgt über den HTTP-Header `x-api-key` (öffentlicher API-Schlüssel des Shops):

```python
DV_API_KEY = "ВАШ_X_API_KEY"
```

Diese Parameter können übergeben werden:

- einmal an den Client-Konstruktor;
- oder an jede Methode (womit die im Konstruktor gesetzten Werte überschrieben werden).

Wenn `host` oder `x_api_key` weder im Konstruktor noch in der Methode gesetzt sind, wird eine Ausnahme ausgelöst:

- `DvNetUndefinedHostException`
- `DvNetUndefinedXApiKeyException`

---

## Clients

Das SDK stellt zwei Varianten des Clients bereit:

```python
from dv_net_client import MerchantClient, AsyncMerchantClient
```

### Synchroner Client

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

Standardmäßig wird `UrllibHttpClient` (basierend auf der Standardbibliothek `urllib`) verwendet.

### Asynchroner Client

```python
from dv_net_client import AsyncMerchantClient

client = AsyncMerchantClient(
    host="https://cloud.dv.net",
    x_api_key="ВАШ_X_API_KEY",
)
```

Standardmäßig wird `AiohttpHttpClient` (auf Basis von `aiohttp`) verwendet.

> Die Clients implementieren keinen Kontextmanager (`with` / `async with`).  
> Es wird empfohlen, beim Start der Anwendung eine Instanz zu erzeugen und wiederzuverwenden.

---

## Fehler und Ausnahmen

Die wichtigsten Ausnahmen des Moduls:

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

- `DvNetInvalidRequestException` — Fehler in der Anfrage (4xx).
- `DvNetServerException` — Fehler auf Seiten von DV.net (5xx).
- `DvNetNetworkException` — Netzwerkprobleme, Timeouts etc.
- `DvNetInvalidResponseDataException` — Die Antwort konnte nicht in das erwartete DTO gemappt werden.
- `DvNetInvalidWebhookException` — Falsches oder unbekanntes Webhook-Format.

Es wird empfohlen, Client-Aufrufe in `try/except` mit Logging zu kapseln.

---

## Client-Methoden

Im Folgenden sind die Methoden beschrieben, die sowohl für `MerchantClient` als auch `AsyncMerchantClient` gelten.  
Die Signaturen sind identisch; im asynchronen Fall sind die Methoden mit `async` versehen und werden mit `await` aufgerufen.

DTO-Typen stammen aus `dv_net_client.dto.merchant_client`.

---

### 1. `get_exchange_balances`

Abruf des konsolidierten Shop-Guthabens über alle Währungen und Netzwerke (Exchange-Balance).

```python
total_balance = await async_client.get_exchange_balances()
# oder
total_balance = client.get_exchange_balances()
```

**Signatur:**

```python
get_exchange_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> TotalExchangeBalanceResponse
```

**Rückgabe:** `TotalExchangeBalanceResponse`:

- `total_usd: str` — Gesamtguthaben in USD.
- `exchange_balance: List[ExchangeBalanceDto]`

`ExchangeBalanceDto` enthält:

- `amount: str` — Betrag in der Währung.
- `amount_usd: str` — Gegenwert in USD.
- `currency: str` — Währungscode.

**Beispiel (async):**

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

Erstellen (oder Abrufen eines vorhandenen) Zahlungs-Wallets/-Links für einen bestimmten Benutzer.

```python
wallet = await async_client.get_external_wallet(
    store_external_id="user_123",
    amount="10.00",
    currency="USD",
)
```

**Signatur:**

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

Parameter:

- `store_external_id` — Ihre interne Benutzer-ID (erforderlich).
- `email` — E-Mail des Benutzers (optional).
- `ip` — IP des Benutzers (optional).
- `amount` — Aufladebetrag (als String, z. B. `"5.00"`).
- `currency` — Währungscode, z. B. `"USD"`.

**Rückgabe:** `ExternalAddressesResponse`:

- `pay_url: str` — Zahlungslink.
- `address: List[AddressDto]` — Liste einzelner Adressen.
- `amount_usd: str` — Betrag in USD.
- `rates: List[str]` — Kursinformationen.
- Servicefelder (`id`, `store_id`, `store_external_id`, `created_at`, `updated_at` usw.).

**Beispiel (async):**

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

Guthaben der „Processing“-Wallets (dort, wo eingehende Transaktionen verarbeitet werden).

```python
processing_balances = await async_client.get_processing_wallets_balances()
```

**Signatur:**

```python
get_processing_wallets_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWalletsBalancesResponse
```

**Rückgabe:** `ProcessingWalletsBalancesResponse`:

- `balances: List[ProcessingWalletBalanceDto]`

`ProcessingWalletBalanceDto` enthält unter anderem:

- `balance: str`
- `balance_usd: str`
- `currency: CurrencyShortDto` (Code, Name, Blockchain)
- zusätzliche technische Felder.

---

### 4. `get_store_currencies`

Liste der dem Shop verfügbaren Währungen.

```python
currencies = await async_client.get_store_currencies()
```

**Signatur:**

```python
get_store_currencies(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrenciesResponse
```

**Rückgabe:** `CurrenciesResponse`:

- `currencies: List[CurrencyDto]`

`CurrencyDto` enthält:

- `id: str` — Währungskennung im Format `"USDT.Tron"`.
- `code: str` — Kurzcode, z. B. `"USDT"`.
- `name: str` — Menschlich lesbarer Name.
- `blockchain: str` — Netzwerk (z. B. `"Tron"`).
- `precision: int` und weitere Felder.

**Beispiel:**

```python
currencies = await client.get_store_currencies()
for cur in currencies.currencies:
    print(f"{cur.code} ({cur.id}) — сеть: {cur.blockchain}")
```

---

### 5. `get_store_currency_rate`

Abrufen des Kurses einer bestimmten Währung.

```python
rate = await async_client.get_store_currency_rate("USDT.Tron")
```

**Signatur:**

```python
get_store_currency_rate(
    currency_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> CurrencyRateResponse
```

Parameter:

- `currency_id` — ID aus `get_store_currencies`, z. B. `"USDT.Tron"`.

**Rückgabe:** `CurrencyRateResponse`:

- `code: str` — Währungscode.
- `rate` — Kurs (dynamischer Typ, meist String/Zahl).
- zusätzliche Felder (Quelle, Quotierungswährung usw.).

---

### 6. `get_withdrawal_processing_status`

Status einer Auszahlung, die sich in Verarbeitung befindet.

```python
status = await async_client.get_withdrawal_processing_status(withdrawal_id)
```

**Signatur:**

```python
get_withdrawal_processing_status(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> ProcessingWithdrawalResponse
```

Parameter:

- `withdrawal_id` — Auszahlung-ID, die zuvor erhalten wurde (z. B. aus `WithdrawalWebhookResponse` oder der Antwort `initialize_transfer`).

**Rückgabe:** `ProcessingWithdrawalResponse`:

- `id: str`
- `status: str`
- `amount: str`
- `amount_usd: str`
- `currency_id: str`
- `created_at`, `updated_at` und weitere.

---

### 7. `initialize_transfer`

Initialisierung einer Auszahlung vom Shop-Guthaben auf eine externe Wallet.

```python
withdrawal = await async_client.initialize_transfer(
    address_to="TExm...",
    currency_id="USDT.Tron",
    amount="100.0",
    request_id="unique_id_1",
)
```

**Signatur:**

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

Parameter:

- `address_to` — Empfängeradresse (Wallet).
- `currency_id` — Währungs-ID im Format `"USDT.Tron"`.
- `amount` — Auszahlungsbetrag (als String).
- `request_id` — Ihre eindeutige Anfragen-ID (für Idempotenz und Bezug zu Ihrem System).

**Rückgabe:** `WithdrawalResponse`:

- `id: str` — Auszahlungs-ID in DV.net.
- `address_from: str` — Absenderadresse.
- `address_to: str` — Empfängeradresse.
- `amount: str`, `amount_usd: str`.
- `currency_id: str`.
- `store_id: str`.
- `created_at: datetime`.
- `transfer_id: Optional[str]` — kann `None` sein, solange der Vorgang noch läuft.

---

### 8. `get_hot_wallet_balances`

Guthaben der „Hot“-Wallets.

```python
hot_wallets = await async_client.get_hot_wallet_balances()
```

**Signatur:**

```python
get_hot_wallet_balances(
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> List[AccountDto]
```

**Rückgabe:** Liste von `AccountDto`:

- `balance: str`
- `balance_usd: str`
- `count: int` — Anzahl der Adressen.
- `count_with_balance: int` — Anzahl der Adressen mit positivem Guthaben.
- `currency: CurrencyShortDto` (Code, Name, Blockchain).

---

### 9. `delete_withdrawal_from_processing`

Abbruch einer Auszahlung in Verarbeitung.

```python
await async_client.delete_withdrawal_from_processing(withdrawal_id)
```

**Signatur:**

```python
delete_withdrawal_from_processing(
    withdrawal_id: str,
    x_api_key: Optional[str] = None,
    host: Optional[str] = None,
) -> None
```

Parameter:

- `withdrawal_id` — Auszahlung-ID, die storniert werden soll.

Ausnahmen:

- Bei Fehlern (nicht gefunden, bereits abgeschlossen, Serverfehler usw.) wird eine der folgenden Ausnahmen ausgelöst: `DvNetRequestException` / `DvNetServerException` / `DvNetNetworkException`.

---

## Webhooks

Das Modul `dv_net_client.mappers` enthält `WebhookMapper`, der eingehendes Webhook-JSON in eines der DTOs aus `dv_net_client.dto.webhook` transformiert.

```python
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import (
    ConfirmedWebhookResponse,
    UnconfirmedWebhookResponse,
    WithdrawalWebhookResponse,
)
```

### `WebhookMapper.map_webhook`

**Signatur:**

```python
map_webhook(data: Dict[str, Any]) -> Any
```

Ablauf:

- Wenn in `data` das Feld `withdrawal_id` vorhanden ist — wird `WithdrawalWebhookResponse` zurückgegeben.
- Wenn das Feld `type` vorhanden ist — wird `ConfirmedWebhookResponse` zurückgegeben.
- Wenn das Feld `unconfirmed_type` vorhanden ist — wird `UnconfirmedWebhookResponse` zurückgegeben.
- Andernfalls wird `DvNetInvalidWebhookException` ausgelöst.

### Webhook-DTOs

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

### Beispiel zur Verarbeitung eines Webhooks

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

## Utilities (`MerchantUtilsManager`)

Die Klasse `MerchantUtilsManager` aus `dv_net_client.utils` enthält Hilfsmethoden.

```python
from dv_net_client.utils import MerchantUtilsManager

utils = MerchantUtilsManager()
```

### `check_sign`

Überprüfung der Signatur von DV.net-Anfragen (Webhooks).

**Signatur:**

```python
check_sign(
    client_signature: str,
    client_key: str,
    request_body: Union[Dict[str, Any], str, bytes],
) -> bool
```

Algorithmus:

1. Der Anfrage-Body wird in einen String umgewandelt:
    - `dict` → `json.dumps(..., sort_keys=True, separators=(',', ':'))`
    - `bytes` → `.decode('utf-8')`
    - `str` — unverändert.
2. `string_body + client_key` wird verkettet.
3. SHA-256 (hex) wird berechnet.
4. Das Ergebnis wird mit `client_signature` mittels `hmac.compare_digest` verglichen.

**Beispiel (aiohttp):**

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

Hilfsmethode zum Generieren eines Links nach dem Schema `host/store_uuid/client_id?email=...`.

**Signatur:**

```python
generate_link(host: str, store_uuid: str, client_id: str, email: str) -> str
```

---

## Beispiel für die Zahlungsintegration in einen Telegram-Bot

Unten ein vereinfachtes Beispiel für die Einbindung von Zahlungen über DV.net in einen Telegram-Bot auf `python-telegram-bot` (v20+) mit `AsyncMerchantClient` und einem aiohttp-Server für Webhooks.

### Ziel

- Der Befehl `/pay` gibt dem Benutzer einen DV.net-Zahlungslink aus.
- Ein separater HTTP-Endpunkt empfängt DV.net-Webhooks:
    - überprüft die Signatur;
    - mappt den Webhook in ein DTO;
    - sendet bei erfolgreicher Zahlung eine Nachricht an den Benutzer in Telegram.

### Abhängigkeiten

```bash
pip install python-telegram-bot aiohttp dv-net-client
```

### Konfiguration

```python
# config.py (пример)

TG_TOKEN = "ВАШ_TELEGRAM_TOKEN"
DV_HOST = "https://cloud.dv.net"
DV_API_KEY = "ВАШ_X_API_KEY"
DV_SECRET_KEY = "ВАШ_SECRET_KEY_ИЗ_КАБИНЕТА"  # для проверки подписи вебхуков

WEBHOOK_PORT = 7623
WEBHOOK_PATH = "/dv/webhook"
```

### Bot- und Webhook-Code

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

### Kurzablauf

1. Der Nutzer sendet `/pay` in Telegram.
2. Der Bot ruft `AsyncMerchantClient.get_external_wallet(...)` auf und sendet dem Nutzer `pay_url`.
3. Der Nutzer bezahlt über den Link.
4. DV.net sendet einen Webhook an `http://<Ihr-Server>:7623/dv/webhook`:
    - die Signatur wird über `MerchantUtilsManager.check_sign` geprüft;
    - das JSON wird über `WebhookMapper.map_webhook` gemappt;
    - bei `ConfirmedWebhookResponse` mit Status `"completed"` erhält der Bot `store_external_id` und den Betrag, führt die Business-Logik aus (z. B. Erhöhung des Guthabens in der Datenbank) und sendet dem Nutzer eine Nachricht.

---