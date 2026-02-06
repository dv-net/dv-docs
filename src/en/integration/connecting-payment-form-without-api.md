# Connecting the Payment Form Without Using the API

You can connect the payment form without API integration by following these simple steps.

You can also see an example of integration [in this repository](https://github.com/dv-net/simple-payment-form)

### 1. Enable Your Store's Payment Link

Log in to your project account and navigate to **Projects**, **Edit**, **Advanced settings**.

Find the "Form without API" switch at the very bottom.

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

There you will find the **link to the payment form without API**, which contains your store's **UUID** (Unique Identifier).

### 2. Modify the Payment Link

Use the following format to generate the payment link:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### Where:

* `{your-domain-or-subdomain}` — your registered domain or subdomain.
* `{store-uuid}` — your store's UUID (specified in the store link).
* `{client-id}` — a unique client identifier that you assign when generating the link. It is needed to track the payment and link it to the correct client wallet.

> ⚠️ **Important:** `client-id` must be unique for each client session to ensure correct tracking and identification.

-----

Example:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

After generating the link, you can either redirect the client to it or embed it into a button on your website.