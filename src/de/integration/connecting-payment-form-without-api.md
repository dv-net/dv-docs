## Anbindung des Zahlungsformulars ohne Verwendung der API

Sie können das Zahlungsformular ohne API-Integration anbinden, indem Sie diese einfachen Schritte befolgen.

Ein Beispiel für die Integration finden Sie auch [in diesem Repository](https://github.com/dv-net/simple-payment-form)

### 1. Zahlungslink Ihres Shops aktivieren

Melden Sie sich in Ihrem Projektkonto an und navigieren Sie zu **Projects**, **Edit**, **Advanced settings**.

Suchen Sie ganz unten den Schalter "Form without API".

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

Dort finden Sie den **Link zum Zahlungsformular ohne API**, der die **UUID** (eindeutige Kennung) Ihres Shops enthält.

### 2. Zahlungslink anpassen

Verwenden Sie folgendes Format, um den Zahlungslink zu erzeugen:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### Dabei:

* `{your-domain-or-subdomain}` — Ihre registrierte Domain oder Subdomain.
* `{store-uuid}` — die UUID Ihres Shops (im Shop-Link angegeben).
* `{client-id}` — eine eindeutige Kundenkennung, die Sie bei der Generierung des Links vergeben. Sie wird benötigt, um die Zahlung zu verfolgen und sie der richtigen Kunden-Wallet zuzuordnen.

> ⚠️ **Wichtig:** `client-id` muss für jede Kundensitzung eindeutig sein, um eine korrekte Nachverfolgung und Identifizierung sicherzustellen.

-----

Beispiel:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

Nachdem Sie den Link generiert haben, können Sie den Kunden entweder dorthin weiterleiten oder ihn in eine Schaltfläche auf Ihrer Website einbinden.