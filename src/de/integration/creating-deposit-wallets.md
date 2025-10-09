# Erstellung von Aufladungs-Wallets

- Besorgen Sie sich den API-Schlüssel (`x-api-key`) im Einstellungsbereich des Merchants (wie im Screenshot "Your API key").

- Senden Sie eine Anfrage an die API und geben Sie diesen Schlüssel im Header an. Beispiel mit cURL:

  ```bash
  curl -X POST \
    'https://{ihre_domain oder subdomain}/api/v1/external/wallet' \
    -H 'Content-Type: application/json' \
    -H 'x-api-key: {Ihr_API_Schlüssel}' \
    --data '{
      "amount": 20,
      "store_external_id": "id_des_benutzers_in_ihrem_shop"
  }'
  ```

- Nach erfolgreicher Antwort gibt das System JSON-Daten zurück, die einen Zahlungslink (`pay_url`) enthalten, zu dem der Benutzer weitergeleitet werden muss.