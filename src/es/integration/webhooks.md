# Recepción de webhooks

Para procesar correctamente los webhooks, siempre debes devolver la siguiente respuesta; de lo contrario, el servicio seguirá reintentando (hasta 30 veces):

```json
{
  "success": true
}
```

## 1. Webhook: Pago recibido

Puedes configurar las URL para recibir notificaciones de pago en la página de configuración del proyecto.  
Este webhook se envía cuando un pago se confirma en la blockchain y se abona.

### Ejemplo: webhook de pago recibido

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

## 2. Webhook: Pago en mempool (pendiente de confirmación)

Este webhook se envía cuando un pago ha entrado en el mempool pero aún no ha recibido el número requerido de confirmaciones.  
Los fondos solo se abonarán tras la confirmación (después de recibir el webhook `PaymentReceived`).

**Nota:** Todos los campos de este tipo de webhook tienen el prefijo `unconfirmed_`.

### Ejemplo: webhook de pago en mempool

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

## 3. Webhook: Retiro desde la billetera de procesamiento

Este webhook te notifica que los fondos que enviaste a tus usuarios a través del servicio se han **acreditado correctamente** en la billetera del destinatario.

### Ejemplo: webhook de retiro desde la billetera de procesamiento

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

### Comprobación de idempotencia al recibir webhooks

Al procesar webhooks entrantes, es fundamental garantizar la idempotencia para evitar el procesamiento duplicado de eventos (p. ej., abonos dobles).  
Para lograrlo, utiliza los siguientes dos campos del objeto `transactions` (o `unconfirmed_transactions`):

`tx_hash` — Hash de la transacción (suma de verificación del contenido de la solicitud o del evento).  
`bc_uniq_key` — Identificador único del evento dentro de la transacción, proporcionado por el emisor del webhook.

### Algoritmo de validación:
1. Antes de procesar un webhook, verifica que la combinación de `hash + uniq_key` no se haya procesado previamente y no esté almacenada en tu sistema.
2. Si el evento ya existe, debe ignorarse como un duplicado.
3. Si el evento es nuevo, procésalo y regístralo en tu base de datos.