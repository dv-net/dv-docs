# 接收 Webhook

要成功处理 Webhook，你必须始终返回以下响应；否则服务将持续重试（最多 30 次）：

```json
{
  "success": true
}
```

## 1. Webhook：付款已到账

你可以在项目设置页面配置接收付款通知的 URL。  
当付款在区块链上确认并入账时，将发送此 Webhook。

### 示例：付款已到账 Webhook

```json
{
  "amount": "2.395", - 以 USD 计的付款金额
  "created_at": "2025-03-17T12:57:52.449795Z", - 付款创建时间
  "paid_at": "2025-03-17T12:57:19Z", - 付款确认时间
  "status": "completed", - 付款状态
  "transactions": {
    "amount": "0.02552778", - 以加密货币计的付款金额
    "amount_usd": "2.395", - 以 USD 计的付款金额
    "bc_uniq_key": "0", - 交易内的顺序号（对 BTC 类网络很重要；bc_uniq_key + tx_hash 可确保唯一性）
    "blockchain": "litecoin", - 区块链名称
    "created_at": "2025-03-17T12:57:52.449795Z", - 付款创建时间
    "currency": "LTC", - 加密货币代码
    "currency_id": "LTC.Litecoin", - 加密货币标识符
    "tx_hash": "2be41b0cad76bc5699c3da5d5a1d390f9fb4038e5bfe49aec3b675f9dd4515fd", - 交易哈希
    "tx_id": "4bbc91fd-a950-4fd0-83f3-9f1c09a6b54f" - 商户系统中的交易 ID
  },
  "type": "PaymentReceived", - Webhook 类型
  "wallet": {
    "id": "9a07b545-f99e-4f51-bf37-a84fcbe4df4d", - 内部用户 ID
    "store_external_id": "1" - 外部用户 ID
  }
}
```

## 2. Webhook：Mempool 中的付款（等待确认）

当付款进入 mempool 但尚未达到所需确认数时，会发送此 Webhook。  
资金只有在确认后（收到 `PaymentReceived` Webhook 后）才会入账。

注意：此类 Webhook 中的所有字段都带有 `unconfirmed_` 前缀。

### 示例：Mempool 中的付款 Webhook

```json
{
  "unconfirmed_amount":"1000000000000", - 以 USD 计的付款金额（未确认）
  "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - 付款创建时间（未确认）
  "unconfirmed_paid_at":"2025-10-06T12:39:39.457399475", - 付款时间（未确认）
  "unconfirmed_status":"completed", - 付款状态（未确认）
  "unconfirmed_transactions":{
    "unconfirmed_amount":"1000000000000", - 以加密货币计的付款金额（未确认）
    "unconfirmed_amount_usd":"1000000000000", - 以 USD 计的付款金额（未确认）
    "unconfirmed_bc_uniq_key":"bc_uniq_key_example", - 交易内顺序号（用于幂等性）
    "unconfirmed_blockchain":"bitcoin", - 区块链名称
    "unconfirmed_created_at":"2025-10-06T12:39:39.457399475", - 付款创建时间（未确认）
    "unconfirmed_currency":"BTC", - 加密货币代码
    "unconfirmed_currency_id":"BTC.Bitcoin", - 加密货币标识符
    "unconfirmed_tx_hash":"tx_hash_example", - 交易哈希（用于幂等性）
    "unconfirmed_tx_id":"165d8dd3-0d9b-4144-979e-23f593f48cdf" - 商户系统中的交易 ID
  },
  "unconfirmed_type":"PaymentNotConfirmed", - Webhook 类型：付款待确认
  "unconfirmed_wallet":{
    "unconfirmed_id":"5f185a18-a8d5-469d-a853-7fbcb048635b", - 内部用户 ID
    "unconfirmed_store_external_id":"store_external_example" - 外部用户 ID
  }
}
```

## 3. Webhook：从处理钱包提现

此 Webhook 通知你，通过该服务发送给用户的资金已成功记入收款方钱包。

### 示例：从处理钱包提现 Webhook

```json
{
  "amount": "100", - 以 USD 计的提现金额
  "created_at": "2025-09-23T12:27:08.166963191", - 提现创建时间
  "paid_at": "2025-09-23T12:27:08.166963191", - 实际执行提现的时间
  "status": "completed", - 提现状态
  "transactions": {
    "amount": "100", - 以加密货币计的提现金额
    "amount_usd": "100", - 以 USD 计的提现金额
    "bc_uniq_key": "bc_uniq_key_example", - 唯一事件标识（用于幂等性）
    "blockchain": "bitcoin", - 区块链名称
    "created_at": "2025-09-23T12:27:08.166963191", - 交易创建时间
    "currency": "BTC", - 加密货币代码
    "currency_id": "BTC.Bitcoin", - 加密货币标识符
    "tx_hash": "tx_hash_example", - 区块链交易哈希（用于幂等性）
    "tx_id": "408a97b1-d1e3-423e-9c8b-5ae4cd902f7f" - 商户系统中的交易 ID
  },
  "type": "WithdrawalFromProcessingReceived", - Webhook 类型：提现完成通知
  "wallet": {
    "id": "8a279ec7-31fb-41f2-a2a5-3d066b77bd8a", - 发起方（处理）钱包的内部 ID
    "store_external_id": "store_external_example" - 外部用户/商店 ID
  }
}
```

### 接收 Webhook 时的幂等性校验

处理入站 Webhook 时，确保幂等性至关重要，以防止重复处理事件（例如重复入账）。  
为此，请使用 `transactions`（或 `unconfirmed_transactions`）对象中的以下两个字段：

`tx_hash` — 交易哈希（请求或事件内容的校验和）。  
`bc_uniq_key` — 交易内的唯一事件标识，由 Webhook 发送方提供。

### 校验算法：
1. 在处理 Webhook 之前，检查 hash + uniq_key 的组合此前未被处理，且未存储在你的系统中。
2. 如果该事件已存在，应将其视为重复并忽略。
3. 如果是新事件，则处理并将其记录到你的数据库。