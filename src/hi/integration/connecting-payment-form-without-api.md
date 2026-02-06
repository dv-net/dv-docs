## API का उपयोग किए बिना भुगतान फ़ॉर्म कनेक्ट करना

इन सरल चरणों का पालन करके आप बिना API इंटीग्रेशन के भुगतान फ़ॉर्म को कनेक्ट कर सकते हैं।

आप इंटीग्रेशन का एक उदाहरण [इस रिपोज़िटरी में देख सकते हैं](https://github.com/dv-net/simple-payment-form)

### 1. अपने स्टोर का पेमेंट लिंक सक्षम करें

अपने प्रोजेक्ट अकाउंट में लॉग इन करें और **Projects**, **Edit**, **Advanced settings** पर जाएँ।

सबसे नीचे "Form without API" स्विच खोजें।

<a href="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>PayForm</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'PayForm\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/integration/connecting-payment-form-without-api/enable-pay-form-without-api.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

वहाँ आपको बिना API वाला भुगतान फ़ॉर्म का लिंक मिलेगा, जिसमें आपके स्टोर का UUID (अद्वितीय पहचानकर्ता) शामिल होता है।

### 2. पेमेंट लिंक को संशोधित करें

पेमेंट लिंक बनाने के लिए निम्न फ़ॉर्मेट का उपयोग करें:

`http(s)://{your-domain-or-subdomain}/pay/store/{store-uuid}/{client-id}`

#### जहाँ:

* `{your-domain-or-subdomain}` — आपका रजिस्टर्ड डोमेन या सबडोमेन।
* `{store-uuid}` — आपके स्टोर का UUID (स्टोर लिंक में दिया होता है)।
* `{client-id}` — एक यूनिक क्लाइंट आइडेंटिफ़ायर जिसे आप लिंक जनरेट करते समय असाइन करते हैं। यह भुगतान को ट्रैक करने और सही क्लाइंट वॉलेट से लिंक करने के लिए आवश्यक है।

> ⚠️ महत्वपूर्ण: `client-id` प्रत्येक क्लाइंट सत्र के लिए यूनिक होना चाहिए ताकि सही ट्रैकिंग और पहचान सुनिश्चित हो सके।

-----

उदाहरण:

`https://demo.dv.net/pay/store/0cbffe2b-d2a5-433d-94f5-77ce93a7c0eb/<your client ID>`

लिंक जनरेट करने के बाद, आप ग्राहक को उस पर रीडायरेक्ट कर सकते हैं या अपनी वेबसाइट पर किसी बटन में इसे एम्बेड कर सकते हैं।