# पैकेज और इंस्टॉल किए गए सॉफ़्टवेयर का सत्यापन

## GPG के साथ हमारे पैकेजों की प्रामाणिकता की जाँच

हमारे सभी `.deb` और `.rpm` पैकेज तथा उनके checksums GPG कुंजियों का उपयोग करके क्रिप्टोग्राफ़िक रूप से हस्ताक्षरित होते हैं। इससे सुनिश्चित होता है कि आप जो पैकेज डाउनलोड करते हैं वे हमारे द्वारा बनाए गए हैं और किसी तृतीय पक्ष द्वारा बदले या भ्रष्ट नहीं किए गए हैं। आप हमारे सार्वजनिक कुंजी का उपयोग करके किसी भी पैकेज की प्रामाणिकता आसानी से सत्यापित कर सकते हैं।

सभी प्रोजेक्ट का source code, संबंधित compiled executables, साथ ही `.deb` और `.rpm` पैकेज github.com पर रिलीज़ में प्रकाशित किए जाते हैं। उनके संबंधित हस्ताक्षर भी वहीं `.sig` फ़ाइलों में उपलब्ध हैं।

उदाहरण: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

<a href="../../assets/images/security/github-signed-assets.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>GitHub पर हस्ताक्षरित संसाधन</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'GitHub पर हस्ताक्षरित संसाधन\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/github-signed-assets.png" alt="GitHub पर हस्ताक्षरित संसाधन" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

-----

### चरण 1: हमारी सार्वजनिक GPG कुंजी आयात करें

सबसे पहले, आपको हमारी सार्वजनिक कुंजी को अपने keychain (कीचेन) में आयात करना होगा। यह केवल एक बार करना होता है।
हमारी कुंजी यहाँ प्रकाशित है: [https://dv.net/gpg.pub](https://dv.net/gpg.pub)

सार्वजनिक कुंजी को अपने सर्वर पर सहेजें:

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

फिर, इसे अपने keychain में आयात करें:

```bash
gpg --import dv-net.asc
```

-----

### चरण 2: पैकेज के हस्ताक्षर का सत्यापन करें

कुंजी आयात करने के बाद, आप डाउनलोड किए गए किसी भी पैकेज के हस्ताक्षर सत्यापित कर सकते हैं।

#### `.deb` पैकेजों के लिए (Debian/Ubuntu)

किसी `.deb` पैकेज को सत्यापित करने के लिए `dpkg-sig` कमांड का उपयोग करें। यदि यह इंस्टॉल नहीं है, तो आप इसे `sudo apt-get install dpkg-sig` के साथ इंस्टॉल कर सकते हैं।

```bash
dpkg-sig --verify package_name.deb
```

यदि हस्ताक्षर मान्य है, तो आउटपुट में एक विश्वसनीय कुंजी से **GOODSIG** स्टेटस दिखाई देगा।

#### `.rpm` पैकेजों के लिए (Fedora/CentOS/RHEL)

किसी `.rpm` पैकेज को सत्यापित करने के लिए `rpm` कमांड का उपयोग करें।

```bash
rpm --checksig package_name.rpm
```

यदि हस्ताक्षर सही है, तो कमांड के आउटपुट में दिखेगा कि सभी जाँच (जिसमें `gpg` शामिल है) सफलतापूर्वक पास हो गई हैं (`OK`)।

इन सरल चरणों का पालन करके आप हमारे सॉफ़्टवेयर पैकेजों की अखंडता और प्रामाणिकता सुनिश्चित कर सकते हैं।