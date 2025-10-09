# वेबहुक प्राप्त करना

वेबहुक को सफलतापूर्वक प्रोसेस करने के लिए, आपको हमेशा निम्न प्रतिक्रिया लौटानी चाहिए; अन्यथा सेवा पुनः प्रयास करती रहेगी (अधिकतम 30 बार):

```json
{
  "success": true
}
```

## 1. वेबहुक: भुगतान प्राप्त

आप प्रोजेक्ट सेटिंग्स पेज पर भुगतान सूचनाएँ प्राप्त करने के लिए URLs कॉन्फ़िगर कर सकते हैं।  
यह वेबहुक तब भेजा जाता है जब ब्लॉकचेन पर भुगतान की पुष्टि हो जाती है और क्रेडिट कर दिया जाता है।

### उदाहरण: भुगतान प्राप्त वेबहुक

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

## 2. वेबहुक: मेमपूल में भुगतान (पुष्टिकरण लंबित)

यह वेबहुक तब भेजा जाता है जब भुगतान मेमपूल में आ जाता है लेकिन अभी आवश्यक संख्या में पुष्टिकरण प्राप्त नहीं हुए हैं।  
राशि केवल पुष्टि के बाद ही क्रेडिट होगी (`PaymentReceived` वेबहुक प्राप्त होने के बाद)।

**नोट:** इस वेबहुक प्रकार के सभी फ़ील्ड में `unconfirmed_` उपसर्ग होता है।

### उदाहरण: मेमपूल में भुगतान वेबहुक

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

## 3. वेबहुक: प्रोसेसिंग वॉलेट से निकासी

यह वेबहुक आपको सूचित करता है कि सेवा के माध्यम से आपने अपने उपयोगकर्ताओं को जो धनराशि भेजी थी, वह प्राप्तकर्ता के वॉलेट में **सफलतापूर्वक क्रेडिट** हो गई है।

### उदाहरण: प्रोसेसिंग वॉलेट से निकासी वेबहुक

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

### वेबहुक प्राप्त करते समय इडेम्पोटेंसी जाँच

इनकमिंग वेबहुक प्रोसेस करते समय, डुप्लिकेट इवेंट प्रोसेसिंग (जैसे दो बार क्रेडिट) से बचने के लिए **इडेम्पोटेंसी** सुनिश्चित करना महत्वपूर्ण है।  
इसके लिए `transactions` (या `unconfirmed_transactions`) ऑब्जेक्ट के निम्न दो फ़ील्ड का उपयोग करें:

`tx_hash` — लेन-देन हैश (रिक्वेस्ट या इवेंट कंटेंट का चेकसम)।  
`bc_uniq_key` — लेन-देन के भीतर **अद्वितीय इवेंट पहचानकर्ता**, जो वेबहुक भेजने वाला प्रदान करता है।

### सत्यापन एल्गोरिद्म:
1. वेबहुक प्रोसेस करने से पहले जाँचें कि `hash + uniq_key` का संयोजन पहले कभी प्रोसेस नहीं हुआ है और आपकी प्रणाली में संग्रहीत नहीं है।
2. यदि इवेंट पहले से मौजूद है, तो उसे **डुप्लिकेट** मानकर अनदेखा करें।
3. यदि इवेंट नया है, तो उसे प्रोसेस करें और अपनी डेटाबेस में **रिकॉर्ड** करें।