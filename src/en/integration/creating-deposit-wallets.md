# Creating deposit wallets

- Get the API key (`x-api-key`) in the merchant settings section (as in the screenshot «Your API key»).
- Send a request to the API, specifying this key in the header. cURL example:

```bash
curl -X POST \
'https://{your_domain or subdomain}/api/v1/external/wallet' \
-H 'Content-Type: application/json' \
-H 'x-api-key: {Your_API_key}' \
--data '{
"amount": 20,
"store_external_id": "user_id_in_your_store"
}'
```

- After a successful response, the system will return JSON data containing the payment link (`pay_url`), to which the user should be redirected.