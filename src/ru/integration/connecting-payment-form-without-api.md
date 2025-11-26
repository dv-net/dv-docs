# Подключение платежной формы без использования API

Вы можете подключить платежную форму без интеграции с API, следуя этим простым шагам.

Также вы можете посмотреть пример интеграции [в этом репозитории](https://github.com/dv-net/simple-payment-form)

## 1. Включите платежную ссылку вашего магазина

Войдите в аккаунт вашего проекта и перейдите в **Projects**, **Edit**, **Advanced settings**.

Найдите переключатель "Форма без API" в самом низу


<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>



Там вы найдете **ссылку на платежную форму без API**, внутри которой указан **UUID** (уникальный идентификатор) вашего магазина.

## 2. Измените платежную ссылку

Используйте следующий формат для генерации платежной ссылки:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

### Где:

- `{your-domain-or-subdomain}` — ваш зарегистрированный домен или поддомен.
- `{store-uuid}` — UUID вашего магазина (указан в ссылке магазина).
- `{client-id}` — уникальный идентификатор клиента, который вы назначаете при генерации ссылки. Он нужен для отслеживания платежа и привязки его к нужному кошельку клиента.

> ⚠️ **Важно:** `client-id` должен быть уникальным для каждой сессии клиента, чтобы обеспечить корректное отслеживание и идентификацию.

---

Пример: 

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>` 

После генерации ссылки вы можете либо перенаправить на нее клиента, либо встроить ее в кнопку на вашем сайте.