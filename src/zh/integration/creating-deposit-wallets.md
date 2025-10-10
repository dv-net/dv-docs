# 创建充值钱包

- 在商户设置部分获取 API 密钥 (`x-api-key`)（如“Your API key”截图中所示）。

![creatingDepositWallets.png](../../assets/images/integration/creating-deposit-wallets/creatingDepositWallets.png)

- 向 API 发送请求，并在标头中指定此密钥。cURL 示例：

  ```bash
  curl -X POST \
    'https://{您的域名或子域名}/api/v1/external/wallet' \
    -H 'Content-Type: application/json' \
    -H 'x-api-key: {您的API密钥}' \
    --data '{
      "amount": 20,
      "store_external_id": "您商店中的用户ID"
  }'
  ```

- 成功响应后，系统将返回包含支付链接 (`pay_url`) 的 JSON 数据，您需要将用户重定向到该链接。