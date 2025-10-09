# Creación de monederos para recarga

- Obtén la clave API (`x-api-key`) en la sección de configuración del comerciante (como se muestra en la captura de pantalla «Your API key»).

- Envía una solicitud a la API, especificando esta clave en el encabezado. Ejemplo con cURL:

  ```bash
  curl -X POST \
    'https://{tu_dominio o subdominio}/api/v1/external/wallet' \
    -H 'Content-Type: application/json' \
    -H 'x-api-key: {Tu_clave_API}' \
    --data '{
      "amount": 20,
      "store_external_id": "id_del_usuario_en_tu_tienda"
  }'
  ```

- Tras una respuesta exitosa, el sistema devolverá datos JSON que contienen un enlace de pago (`pay_url`) al que debes redirigir al usuario.