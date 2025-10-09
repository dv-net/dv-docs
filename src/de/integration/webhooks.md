# Empfangen von Webhooks

Um Webhooks erfolgreich zu verarbeiten, müssen Sie stets die folgende Antwort zurückgeben; andernfalls versucht der Dienst es weiterhin (bis zu 30 Mal):

```json
{
  "success": true
}
```

## 1. Webhook: Zahlung eingegangen

Sie können die URLs für den Empfang von Zahlungsbenachrichtigungen auf der Projekt-Einstellungsseite konfigurieren.  
Dieser Webhook wird gesendet, wenn eine Zahlung in der Blockchain bestätigt und gutgeschrieben wurde.

### Beispiel: Webhook Zahlung eingegangen

```json
{
  "amount": "2.395", - Zahlungsbetrag in USD
  "created_at": "2025-03-17T12:57:52.449795Z", - Zeitpunkt der Zahlungserstellung
  "paid_at": "2025-03-17T12:57:19Z", - Zeitpunkt der Zahlungsbestätigung
  "status": "completed", - Zahlungsstatus
  "transactions": {
    "amount": "0.02552778", - Zahlungsbetrag in Kryptowährung
    "amount_usd": "2.395", - Zahlungsbetrag in USD
    "bc_uniq_key": "0", - Fortlaufende Nummer innerhalb der Transaktion (wichtig für BTC‑ähnliche Netzwerke; bc_uniq_key + tx_hash gewährleistet Eindeutigkeit)
    "blockchain": "litecoin", - Name der Blockchain
    "created_at": "2025-03-17T12:57:52.449795Z", - Zeitpunkt der Zahlungserstellung
    "currency": "LTC", - Kryptowährungscode
    "currency_id": "LTC.Litecoin", - Kryptowährungskennung
    "tx_hash": "2be41b0cad76bc5699c3da5d5a1d390f9fb4038e5bfe49aec3b675f9dd4515fd", - Transaktionshash
    "tx_id": "4bbc91fd-a950-4fd0-83f3-9f1c09a6b54f" - Transaktions-ID im Händlersystem
  },
  "type": "PaymentReceived", - Webhook-Typ
  "wallet": {
    "id": "9a07b545-f99e-4f51-bf37-a84fcbe4df4d", - Interne Benutzer-ID
    "store_external_id": "1" - Externe Benutzer-ID
  }
}
```

## 2. Webhook: Zahlung im Mempool (ausstehende Bestätigung)

Dieser Webhook wird gesendet, wenn eine Zahlung in den Mempool gelangt ist, aber noch nicht die erforderliche Anzahl an Bestätigungen erhalten hat.  
Die Gelder werden erst nach der Bestätigung gutgeschrieben (nach Erhalt des Webhooks `PaymentReceived`).

Hinweis: Alle Felder dieses Webhook-Typs haben das Präfix `unconfirmed_`.

### Beispiel: Webhook Zahlung im Mempool

```json
{
  "unconfirmed_amount":"1000000000000", - Zahlungsbetrag in USD (unbestätigt)
  "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - Zeitpunkt der Zahlungserstellung (unbestätigt)
  "unconfirmed_paid_at":"2025-10-06T12:39:39.457399475", - Zeitpunkt der Zahlung (unbestätigt)
  "unconfirmed_status":"completed", - Zahlungsstatus (unbestätigt)
  "unconfirmed_transactions":{
    "unconfirmed_amount":"1000000000000", - Zahlungsbetrag in Kryptowährung (unbestätigt)
    "unconfirmed_amount_usd":"1000000000000", - Zahlungsbetrag in USD (unbestätigt)
    "unconfirmed_bc_uniq_key":"bc_uniq_key_example", - Fortlaufende Transaktionsnummer (für Idempotenz)
    "unconfirmed_blockchain":"bitcoin", - Name der Blockchain
    "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - Zeitpunkt der Zahlungserstellung (unbestätigt)
    "unconfirmed_currency":"BTC", - Kryptowährungscode
    "unconfirmed_currency_id":"BTC.Bitcoin", - Kryptowährungskennung
    "unconfirmed_tx_hash":"tx_hash_example", - Transaktionshash (für Idempotenz)
    "unconfirmed_tx_id":"165d8dd3-0d9b-4144-979e-23f593f48cdf" - Transaktions-ID im Händlersystem
  },
  "unconfirmed_type":"PaymentNotConfirmed", - Webhook-Typ: Zahlung wartet auf Bestätigung
  "unconfirmed_wallet":{
    "unconfirmed_id":"5f185a18-a8d5-469d-a853-7fbcb048635b", - Interne Benutzer-ID
    "unconfirmed_store_external_id":"store_external_example" - Externe Benutzer-ID
  }
}
```

## 3. Webhook: Auszahlung aus der Processing-Wallet

Dieser Webhook informiert Sie, dass die über den Dienst an Ihre Nutzer gesendeten Gelder erfolgreich auf der Empfänger-Wallet gutgeschrieben wurden.

### Beispiel: Webhook Auszahlung aus der Processing-Wallet

```json
{
  "amount": "100", - Auszahlungsbetrag in USD
  "created_at": "2025-09-23T12:27:08.166963191", - Zeitpunkt der Erstellung der Auszahlung
  "paid_at": "2025-09-23T12:27:08.166963191", - Tatsächlicher Ausführungszeitpunkt der Auszahlung
  "status": "completed", - Auszahlungsstatus
  "transactions": {
    "amount": "100", - Auszahlungsbetrag in Kryptowährung
    "amount_usd": "100", - Auszahlungsbetrag in USD
    "bc_uniq_key": "bc_uniq_key_example", - Eindeutiger Ereignisbezeichner (für Idempotenz)
    "blockchain": "bitcoin", - Name der Blockchain
    "created_at": "2025-09-23T12:27:08.166963191", - Zeitpunkt der Transaktionserstellung
    "currency": "BTC", - Kryptowährungscode
    "currency_id": "BTC.Bitcoin", - Kryptowährungskennung
    "tx_hash": "tx_hash_example", - Blockchain-Transaktionshash (für Idempotenz)
    "tx_id": "408a97b1-d1e3-423e-9c8b-5ae4cd902f7f" - Transaktions-ID im Händlersystem
  },
  "type": "WithdrawalFromProcessingReceived", - Webhook-Typ: Benachrichtigung über abgeschlossene Auszahlung
  "wallet": {
    "id": "8a279ec7-31fb-41f2-a2a5-3d066b77bd8a", - Interne ID der Wallet des Absenders (Processing)
    "store_external_id": "store_external_example" - Externe Benutzer-/Shop-ID
  }
}
```

### Idempotenzprüfung beim Empfangen von Webhooks

Bei der Verarbeitung eingehender Webhooks ist es entscheidend, die Idempotenz sicherzustellen, um doppelte Ereignisverarbeitung (z. B. doppelte Gutschrift) zu verhindern.  
Verwenden Sie dazu die folgenden zwei Felder aus dem Objekt `transactions` (oder `unconfirmed_transactions`):

`tx_hash` — Transaktionshash (Prüfsumme der Anforderung bzw. des Ereignisinhalts).  
`bc_uniq_key` — Eindeutiger Ereignisbezeichner innerhalb der Transaktion, bereitgestellt vom Webhook-Absender.

### Validierungsalgorithmus:
1. Prüfen Sie vor der Verarbeitung eines Webhooks, dass die Kombination aus `hash + uniq_key` noch nicht verarbeitet wurde und nicht in Ihrem System gespeichert ist.
2. Falls das Ereignis bereits existiert, sollte es als Duplikat ignoriert werden.
3. Wenn das Ereignis neu ist, verarbeiten Sie es und zeichnen Sie es in Ihrer Datenbank auf.