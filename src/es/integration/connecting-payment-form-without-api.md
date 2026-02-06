## Conectar el formulario de pago sin usar la API

Puedes conectar el formulario de pago sin integración de API siguiendo estos sencillos pasos.

También puedes ver un ejemplo de integración [en este repositorio](https://github.com/dv-net/simple-payment-form)

### 1. Habilita el enlace de pago de tu tienda

Inicia sesión en la cuenta de tu proyecto y ve a **Projects**, **Edit**, **Advanced settings**.

Encuentra el interruptor "Form without API" al final.

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

Allí encontrarás el **enlace al formulario de pago sin API**, que contiene el **UUID** (Identificador único) de tu tienda.

### 2. Modificar el enlace de pago

Usa el siguiente formato para generar el enlace de pago:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### Dónde:

* `{your-domain-or-subdomain}` — tu dominio o subdominio registrado.
* `{store-uuid}` — el UUID de tu tienda (indicado en el enlace de la tienda).
* `{client-id}` — un identificador único del cliente que asignas al generar el enlace. Se necesita para rastrear el pago y vincularlo al monedero correcto del cliente.

> ⚠️ **Importante:** `client-id` debe ser único para cada sesión del cliente para garantizar el seguimiento e identificación correctos.

-----

Ejemplo:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

Después de generar el enlace, puedes redirigir al cliente a él o integrarlo en un botón en tu sitio web.