# تصدير المفاتيح الخاصة

المفتاح الخاص يمنح وصولًا مباشرًا لأموال عنوان معيّن. يتيح DV.net التصدير لعنوان واحد أو لعدة عناوين.

> ⚠️ **المفتاح الخاص = وصول كامل للمحفظة.** لا تشاركه ولا ترسله بالبريد أو الدردشة. احذف الملف بعد الانتهاء.

## تصدير عنوان واحد

1. انتقل إلى **Transfers → Hot Wallets**
2. إن لزم عطّل **Hide addresses with low balance**
3. ابحث عن العنوان
4. حدّد المربع بجانب العنوان
5. انقر **Download keys** أعلى يمين الجدول
6. اختر **JSON** أو **CSV**
7. أكمل المصادقة الثنائية
8. احفظ الملف في مكان آمن

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>تصدير مفتاح واحد</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'تصدير مفتاح واحد\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## تصدير جماعي

1. **Transfers → Hot Wallets**
2. إن لزم عطّل **Hide addresses with low balance**
3. حدّد العناوين
   - **Select all on page** — الصفحة الحالية
   - **Select all (N)** — جميع الصفحات
4. **Download keys** أعلى القائمة
5. **JSON** أو **CSV**
6. المصادقة الثنائية
7. احفظ الملف

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>تصدير جماعي</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'تصدير جماعي\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## صيغ الملفات

### JSON
مناسب للبرمجة. يحتوي على شبكات؛ كل شبكة بعناصر فيها المفتاح العام والخاص والعنوان:
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
مناسب لـ Excel أو Sheets. كل صف: شبكة، مفتاح عام، خاص، عنوان:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## بعد التصدير

- تخزين مشفّر أو دون اتصال
- حذف الملف من الجهاز الاعتيادي عند الانتهاء
- إذا استوردت إلى محفظة أخرى أزل الاستيراد لاحقًا
- عند الاشتباه في تسريب توقف عن استلام المدفوعات على هذا العنوان
