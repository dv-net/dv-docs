# 웹훅 수신

웹훅을 정상적으로 처리하려면 항상 다음 응답을 반환해야 합니다. 그렇지 않으면 서비스가 계속 재시도합니다(최대 30회):

```json
{
  "success": true
}
```

## 1. 웹훅: 결제 수신

결제 알림을 수신할 URL은 프로젝트 설정 페이지에서 구성할 수 있습니다.  
이 웹훅은 블록체인에서 결제가 확인되어 입금 처리되었을 때 전송됩니다.

### 예시: 결제 수신 웹훅

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

## 2. 웹훅: 멤풀에 진입한 결제(확인 대기)

결제가 멤풀에 진입했지만 아직 필요한 수의 확인을 받지 못했을 때 이 웹훅이 전송됩니다.  
자금은 확인이 완료된 후(즉, `PaymentReceived` 웹훅을 수신한 이후)에만 입금 처리됩니다.

**참고:** 이 유형의 웹훅의 모든 필드는 `unconfirmed_` 접두사를 가집니다.

### 예시: 멤풀 결제 웹훅

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

## 3. 웹훅: 처리 지갑 출금

이 웹훅은 서비스를 통해 사용자에게 보낸 자금이 수신자의 지갑에 성공적으로 입금되었음을 알려줍니다.

### 예시: 처리 지갑 출금 웹훅

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

### 웹훅 수신 시 멱등성(Idempotency) 확인

수신한 웹훅을 처리할 때는 중복 이벤트 처리(예: 중복 입금)를 방지하기 위해 멱등성을 보장하는 것이 중요합니다.  
이를 위해 `transactions`(또는 `unconfirmed_transactions`) 객체의 다음 두 필드를 사용하십시오:

`tx_hash` — 트랜잭션 해시(요청 또는 이벤트 내용의 체크섬).  
`bc_uniq_key` — 트랜잭션 내 고유 이벤트 식별자(웹훅 발신자가 제공).

### 검증 알고리즘:
1. 웹훅을 처리하기 전에 `hash + uniq_key` 조합이 이전에 처리되지 않았고 시스템에 저장되어 있지 않은지 확인합니다.
2. 이벤트가 이미 존재하면 중복으로 간주하고 무시합니다.
3. 이벤트가 새 것이라면 처리하고 데이터베이스에 기록합니다.