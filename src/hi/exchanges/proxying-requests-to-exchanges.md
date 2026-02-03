# एक्सचेंजों के लिए प्रॉक्सी अनुरोध (फ़ॉलबैक)

## विवरण

DV Merchant मुद्रा दरों को प्राप्त करने के लिए एक्सचेंज एपीआई के लिए प्रॉक्सी अनुरोधों का समर्थन करता है। यह तब उपयोगी होता है जब:

* एक्सचेंज एपीआई तक सीधी पहुंच अवरुद्ध है (फ़ायरवॉल या भू-अवरोधन द्वारा)।

यदि कोई सीधा कनेक्शन अनुपलब्ध है, तो एप्लिकेशन स्वचालित रूप से एक प्रॉक्सी पर स्विच हो जाता है। यदि कोई सीधा कनेक्शन अनुपलब्ध है, तो एप्लिकेशन स्वचालित रूप से कॉन्फ़िगर किए गए प्रॉक्सी का उपयोग करता है।

यदि एक्सचेंजों तक सीधी पहुंच उपलब्ध है, तो प्रॉक्सी का उपयोग **नहीं** किया जाता है, भले ही वे कॉन्फ़िगरेशन में निर्दिष्ट हों।

> **ध्यान दें:** कॉन्फ़िगरेशन उदाहरण `/home/dv/merchant/configs/config.template.yaml` फ़ाइल में या [GitHub रिपॉजिटरी](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml) में मिल सकते हैं।

## त्वरित आरंभ

### 1. कॉन्फ़िगरेशन फ़ाइल खोलें

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. अपने प्रॉक्सी सर्वर के साथ `proxies` पैरामीटर जोड़ें

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. सेवा को पुनरारंभ करें

```bash
sudo systemctl restart dv-merchant
```

### 4. स्थिति जांचें

```bash
# सेवा की स्थिति जांचें
sudo systemctl status dv-merchant

# लॉग देखें
sudo journalctl -u dv-merchant -n 50
```

### 5. एप्लिकेशन इंटरफ़ेस में
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## यह कैसे काम करता है

### 1. सीधे कनेक्शन का प्रयास

एप्लिकेशन पहले सीधे एक्सचेंज एपीआई से कनेक्ट करने का प्रयास करता है:

```
DV Merchant → api.exchange.com
```

### 2. विफलता पर प्रॉक्सी का उपयोग करना

यदि सीधा कनेक्शन विफल हो जाता है, तो एप्लिकेशन स्वचालित रूप से सूची से एक प्रॉक्सी का प्रयास करता है:

```
DV Merchant → प्रॉक्सी 1 → api.exchange.com ✅
```

### 3. त्रुटियों पर रोटेशन

यदि पहला प्रॉक्सी अनुपलब्ध है, तो अगला स्वचालित रूप से उपयोग किया जाता है:

```
DV Merchant → प्रॉक्सी 1 ❌ (त्रुटि)
            ↓
            → प्रॉक्सी 2 → api.exchange.com ✅
```

## संचालन का सत्यापन

### लॉग देखना

```bash
# सभी विनिमय दर सेवा लॉग
sudo journalctl -u dv-merchant -f | grep EXRATE

# केवल प्रॉक्सी जानकारी
sudo journalctl -u dv-merchant -f | grep proxy

# केवल त्रुटियां
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## सामान्य प्रश्न

**प्रश्न: क्या मैं सार्वजनिक मुफ्त प्रॉक्सी का उपयोग कर सकता हूं?**

उत्तर: अनुशंसित नहीं है। मुफ्त प्रॉक्सी अविश्वसनीय, धीमी हैं, और सुरक्षा जोखिम पैदा कर सकती हैं।

**प्रश्न: मुझे कैसे पता चलेगा कि वर्तमान में कौन सा प्रॉक्सी उपयोग में है?**

उत्तर: लॉग जांचें: `sudo journalctl -u dv-merchant -f | grep proxy`

**प्रश्न: क्या मुझे प्रॉक्सी कॉन्फ़िगर करने की आवश्यकता है यदि मेरे पास कोई रुकावट नहीं है?**

उत्तर: नहीं, प्रॉक्सी वैकल्पिक हैं। यदि एक्सचेंजों तक सीधी पहुंच है तो एप्लिकेशन उनके बिना काम करता है।

**प्रश्न: क्या प्रॉक्सी का उपयोग अन्य अनुरोधों के लिए किया जा सकता है, न कि केवल एक्सचेंजों के लिए?**

उत्तर: नहीं, वर्तमान कार्यान्वयन केवल एक्सचेंजों के लिए विनिमय दर अनुरोधों के लिए प्रॉक्सी का उपयोग करता है।

**प्रश्न: क्या प्रॉक्सी का उपयोग प्रदर्शन को प्रभावित करता है?**

उत्तर: हाँ, थोड़ा। प्रॉक्सी के माध्यम से अनुरोध आमतौर पर सीधे अनुरोधों की तुलना में धीमे होते हैं।

**प्रश्न: क्या होगा यदि सभी प्रॉक्सी विफल हो जाएं?**

उत्तर: एप्लिकेशन कैश्ड डेटा के साथ काम करना जारी रखेगा। कैश टीटीएल ~ 10 मिनट है।

## सहयोग

यदि आपको कोई समस्या आती है:

1. लॉग जांचें: `sudo journalctl -u dv-merchant -n 100`
2. ऊपर दिए गए सामान्य प्रश्न अनुभाग की समीक्षा करें
3. तकनीकी सहायता से संपर्क करें: <https://dv.net/#support>
4. GitHub पर एक समस्या बनाएँ: <https://github.com/dv-net/dv-merchant/issues>