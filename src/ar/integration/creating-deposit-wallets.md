# إنشاء محافظ للإيداع

- احصل على مفتاح API (`x-api-key`) في قسم إعدادات التاجر (كما هو موضح في لقطة الشاشة "Your API key").

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)


- أرسل طلبًا إلى API، مع تحديد هذا المفتاح في العنوان. مثال على cURL:

  ```bash
  curl -X POST \
    'https://{نطاقك أو نطاقك الفرعي}/api/v1/external/wallet' \
    -H 'Content-Type: application/json' \
    -H 'x-api-key: {مفتاح_API_الخاص_بك}' \
    --data '{
      "amount": 20,
      "store_external_id": "معرف_المستخدم_في_متجرك"
  }'
  ```

- بعد الاستجابة الناجحة، سيعيد النظام بيانات JSON تحتوي على رابط الدفع (`pay_url`) الذي تحتاج إلى إعادة توجيه المستخدم إليه.