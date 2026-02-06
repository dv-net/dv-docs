## توصيل نموذج الدفع بدون استخدام واجهة برمجة التطبيقات (API)

يمكنك توصيل نموذج الدفع دون تكامل مع واجهة برمجة التطبيقات من خلال اتباع هذه الخطوات البسيطة.

يمكنك أيضًا الاطلاع على مثال للتكامل [في هذا المستودع](https://github.com/dv-net/simple-payment-form)

### 1. تفعيل رابط الدفع لمتجرك

سجّل الدخول إلى حساب مشروعك وانتقل إلى **Projects**، **Edit**، **Advanced settings**.

ابحث عن مفتاح "Form without API" في الأسفل تمامًا.

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

ستجد هناك **رابط نموذج الدفع بدون واجهة برمجة تطبيقات (API)**، والذي يحتوي على **UUID** (المعرّف الفريد) الخاص بمتجرك.

### 2. تعديل رابط الدفع

استخدم البنية التالية لإنشاء رابط الدفع:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### حيث:

* `{your-domain-or-subdomain}` — نطاقك أو النطاق الفرعي المسجّل.
* `{store-uuid}` — UUID الخاص بمتجرك (المذكور في رابط المتجر).
* `{client-id}` — معرّف عميل فريد تقوم بتعيينه عند إنشاء الرابط. يلزم لتتبع عملية الدفع وربطها بمحفظة العميل الصحيحة.

> ⚠️ **هام:** يجب أن يكون `client-id` فريدًا لكل جلسة عميل لضمان التتبع والتعرّف بشكل صحيح.

-----

مثال:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

بعد إنشاء الرابط، يمكنك إما إعادة توجيه العميل إليه أو تضمينه في زر على موقعك.