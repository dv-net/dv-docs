# Receiving Webhooks

To successfully process webhooks, you must always return the following response; otherwise, the service will keep retrying (up to 30 times):

```json
{
  "success": true
}
```

## 1. Webhook: Payment Received

You can configure the URLs for receiving payment notifications on the project settings page.  
This webhook is sent when a payment is confirmed on the blockchain and credited.

### Example: Payment Received webhook

```json
{
  "amount": "2.395", - Payment amount in USD
  "created_at": "2025-03-17T12:57:52.449795Z", - Payment creation time
  "paid_at": "2025-03-17T12:57:19Z", - Payment confirmation time
  "status": "completed", - Payment status
  "transactions": {
    "amount": "0.02552778", - Payment amount in cryptocurrency
    "amount_usd": "2.395", - Payment amount in USD
    "bc_uniq_key": "0", - Sequential number within the transaction (important for BTC-like networks; bc_uniq_key + tx_hash ensures uniqueness)
    "blockchain": "litecoin", - Blockchain name
    "created_at": "2025-03-17T12:57:52.449795Z", - Payment creation time
    "currency": "LTC", - Cryptocurrency code
    "currency_id": "LTC.Litecoin", - Cryptocurrency identifier
    "tx_hash": "2be41b0cad76bc5699c3da5d5a1d390f9fb4038e5bfe49aec3b675f9dd4515fd", - Transaction hash
    "tx_id": "4bbc91fd-a950-4fd0-83f3-9f1c09a6b54f" - Transaction ID in the merchant system
  },
  "type": "PaymentReceived", - Webhook type
  "wallet": {
    "id": "9a07b545-f99e-4f51-bf37-a84fcbe4df4d", - Internal user ID
    "store_external_id": "1" - External user ID
  }
}
```

## 2. Webhook: Payment in Mempool (Pending Confirmation)

This webhook is sent when a payment has entered the mempool but has not yet received the required number of confirmations.  
The funds will only be credited after confirmation (after receiving the `PaymentReceived` webhook).

**Note:** All fields in this webhook type have the `unconfirmed_` prefix.

### Example: Payment in Mempool webhook

```json
{
  "unconfirmed_amount":"1000000000000", - Payment amount in USD (unconfirmed)
  "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - Payment creation time (unconfirmed)
  "unconfirmed_paid_at":"2025-10-06T12:39:39.457399475", - Payment time (unconfirmed)
  "unconfirmed_status":"completed", - Payment status (unconfirmed)
  "unconfirmed_transactions":{
    "unconfirmed_amount":"1000000000000", - Payment amount in crypto (unconfirmed)
    "unconfirmed_amount_usd":"1000000000000", - Payment amount in USD (unconfirmed)
    "unconfirmed_bc_uniq_key":"bc_uniq_key_example", - Sequential transaction number (for idempotency)
    "unconfirmed_blockchain":"bitcoin", - Blockchain name
    "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - Payment creation time (unconfirmed)
    "unconfirmed_currency":"BTC", - Cryptocurrency code
    "unconfirmed_currency_id":"BTC.Bitcoin", - Cryptocurrency identifier
    "unconfirmed_tx_hash":"tx_hash_example", - Transaction hash (for idempotency)
    "unconfirmed_tx_id":"165d8dd3-0d9b-4144-979e-23f593f48cdf" - Transaction ID in the merchant system
  },
  "unconfirmed_type":"PaymentNotConfirmed", - Webhook type: Payment pending confirmation
  "unconfirmed_wallet":{
    "unconfirmed_id":"5f185a18-a8d5-469d-a853-7fbcb048635b", - Internal user ID
    "unconfirmed_store_external_id":"store_external_example" - External user ID
  }
}
```

## 3. Webhook: Withdrawal from Processing Wallet

This webhook notifies you that the funds you sent to your users through the service have been **successfully credited** to the recipient’s wallet.

### Example: Withdrawal from Processing Wallet webhook

```json
{
  "amount": "100", - Withdrawal amount in USD
  "created_at": "2025-09-23T12:27:08.166963191", - Withdrawal creation time
  "paid_at": "2025-09-23T12:27:08.166963191", - Actual withdrawal execution time
  "status": "completed", - Withdrawal status
  "transactions": {
    "amount": "100", - Withdrawal amount in cryptocurrency
    "amount_usd": "100", - Withdrawal amount in USD
    "bc_uniq_key": "bc_uniq_key_example", - Unique event identifier (for idempotency)
    "blockchain": "bitcoin", - Blockchain name
    "created_at": "2025-09-23T12:27:08.166963191", - Transaction creation time
    "currency": "BTC", - Cryptocurrency code
    "currency_id": "BTC.Bitcoin", - Cryptocurrency identifier
    "tx_hash": "tx_hash_example", - Blockchain transaction hash (for idempotency)
    "tx_id": "408a97b1-d1e3-423e-9c8b-5ae4cd902f7f" - Transaction ID in the merchant system
  },
  "type": "WithdrawalFromProcessingReceived", - Webhook type: Withdrawal completed notification
  "wallet": {
    "id": "8a279ec7-31fb-41f2-a2a5-3d066b77bd8a", - Internal ID of the sender’s (processing) wallet
    "store_external_id": "store_external_example" - External user/store ID
  }
}
```

### Idempotency Check When Receiving Webhooks

When processing incoming webhooks, it’s crucial to ensure **idempotency** to prevent duplicate event processing (e.g., double crediting).  
To achieve this, use the following two fields from the `transactions` (or `unconfirmed_transactions`) object:

`tx_hash` — **Transaction hash** (checksum of the request or event content).  
`bc_uniq_key` — **Unique event identifier** within the transaction, provided by the webhook sender.

### Validation Algorithm:
1. Before processing a webhook, check that the **combination** of `hash + uniq_key` has **not been processed** before and is not stored in your system.
2. If the event already exists, it should be ignored as a **duplicate**.
3. If the event is new, process it and **record** it in your database.
