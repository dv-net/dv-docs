# निजी कुंजी निर्यात

निजी कुंजी किसी पते पर धन की प्रत्यक्ष पहुँच देती है। DV.net एक या कई पतों के लिए निर्यात करने देता है।

> ⚠️ **निजी कुंजी = पूरा वॉलेट नियंत्रण।** कभी साझा न करें, ईमेल/चैट से न भेजें। उपयोग के बाद फ़ाइल हटा दें।

## एक पते के लिए

1. **Transfers → Hot Wallets** खोलें
2. जरूरत हो तो **Hide addresses with low balance** बंद करें
3. खोज से पता ढूँढें
4. बाएँ चेकबॉक्स से पता चुनें
5. तालिका के ऊपर दाएँ **Download keys** दबाएँ
6. **JSON** या **CSV** चुनें
7. टू-फैक्टर प्रमाणीकरण पूरा करें
8. फ़ाइल सुरक्षित स्थान पर सहेजें

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>एक कुंजी निर्यात</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'एक कुंजी निर्यात\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## बड़े पैमाने पर निर्यात

1. **Transfers → Hot Wallets**
2. जरूरत हो तो **Hide addresses with low balance** बंद करें
3. पते चेकबॉक्स से चुनें
   - **Select all on page** — वर्तमान पृष्ठ
   - **Select all (N)** — सभी पृष्ठ
4. सूची के ऊपर **Download keys**
5. **JSON** या **CSV**
6. टू-फैक्टर प्रमाणीकरण
7. सुरक्षित रूप से सहेजें

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>समूह निर्यात</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'समूह निर्यात\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## फ़ाइल प्रारूप

### JSON
स्क्रिप्ट के लिए उपयुक्त। नेटवर्क सूची; प्रत्येक में सार्वजनिक कुंजी, निजी कुंजी, पता:
```json
{
  "entries": [
    {
      "name": "BLOCKCHAIN_ETHEREUM",
      "items": [
        {
          "public_key": "04...e68",
          "private_key": "0x...fb5",
          "address": "0x...2b26"
        }
      ]
    }
  ]
}
```

### CSV
Excel या Google Sheets के लिए। प्रत्येक पंक्ति: ब्लॉकचेन, public_key, private_key, address:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## निर्यात के बाद

- एन्क्रिप्टेड या ऑफ़लाइन संग्रहण
- काम पूरा होने पर सामान्य डिवाइस से हटाएँ
- दूसरे वॉलेट में आयात किया हो तो बाद में हटा दें
- संदेह हो तो भुगतान ग्रहण के लिए पता उपयोग न करें
