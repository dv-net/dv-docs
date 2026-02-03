# طلبات الوكيل إلى البورصات (احتياطي)

## الوصف

يدعم DV Merchant طلبات الوكيل إلى واجهات برمجة تطبيقات البورصة للحصول على أسعار العملات. هذا مفيد عندما:

* يتم حظر الوصول المباشر إلى واجهات برمجة تطبيقات البورصة (بواسطة جدار حماية أو حظر جغرافي).

إذا كان الاتصال المباشر غير متاح ، يتحول التطبيق تلقائيًا إلى وكيل. إذا كان الاتصال المباشر غير متاح ، يستخدم التطبيق تلقائيًا الوكلاء الذين تم تكوينهم.

إذا كان الوصول المباشر إلى البورصات متاحًا ، **لا يتم استخدام** الوكلاء ، حتى لو تم تحديدهم في التكوين.

> **ملاحظة:** يمكن العثور على أمثلة التكوين في الملف `/home/dv/merchant/configs/config.template.yaml` أو في [مستودع GitHub](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml).

## بداية سريعة

### 1. افتح ملف التكوين

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. أضف المعلمة `proxies` مع خوادم الوكيل الخاصة بك

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. أعد تشغيل الخدمة

```bash
sudo systemctl restart dv-merchant
```

### 4. تحقق من الحالة

```bash
# تحقق من حالة الخدمة
sudo systemctl status dv-merchant

# عرض السجلات
sudo journalctl -u dv-merchant -n 50
```

### 5. في واجهة التطبيق
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## كيف يعمل

### 1. محاولة اتصال مباشر

يحاول التطبيق أولاً الاتصال بواجهة برمجة تطبيقات البورصة مباشرةً:

```
DV Merchant → api.exchange.com
```

### 2. استخدام وكيل عند الفشل

إذا فشل الاتصال المباشر ، يحاول التطبيق تلقائيًا وكيلًا من القائمة:

```
DV Merchant → الوكيل 1 → api.exchange.com ✅
```

### 3. التناوب عند الأخطاء

إذا كان الوكيل الأول غير متاح ، يتم استخدام التالي تلقائيًا:

```
DV Merchant → الوكيل 1 ❌ (خطأ)
            ↓
            → الوكيل 2 → api.exchange.com ✅
```

## التحقق من التشغيل

### عرض السجلات

```bash
# جميع سجلات خدمة سعر الصرف
sudo journalctl -u dv-merchant -f | grep EXRATE

# معلومات الوكيل فقط
sudo journalctl -u dv-merchant -f | grep proxy

# الأخطاء فقط
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## أسئلة وأجوبة

**س: هل يمكنني استخدام وكلاء مجانيين عامين؟**

ج: لا ينصح به. الوكلاء المجانيون غير موثوقين وبطيئون ويمكن أن يشكلوا خطرًا أمنيًا.

**س: كيف أعرف الوكيل المستخدم حاليًا؟**

ج: تحقق من السجلات: `sudo journalctl -u dv-merchant -f | grep proxy`

**س: هل أحتاج إلى تكوين وكلاء إذا لم يكن لدي أي عوائق؟**

ج: لا ، الوكلاء اختياريون. يعمل التطبيق بدونهم إذا كان هناك وصول مباشر إلى البورصات.

**س: هل يمكن استخدام الوكلاء لطلبات أخرى ، وليس فقط للبورصات؟**

ج: لا ، التنفيذ الحالي يستخدم الوكلاء فقط لطلبات سعر الصرف إلى البورصات.

**س: هل يؤثر استخدام وكيل على الأداء؟**

ج: نعم ، بشكل طفيف. عادة ما تكون الطلبات عبر وكيل أبطأ من الطلبات المباشرة.

**س: ماذا لو فشلت جميع الوكلاء؟**

ج: سيستمر التطبيق في العمل مع البيانات المخزنة مؤقتًا. يبلغ TTL لذاكرة التخزين المؤقت حوالي 10 دقائق.

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من السجلات: `sudo journalctl -u dv-merchant -n 100`
2. راجع قسم الأسئلة الشائعة أعلاه
3. اتصل بالدعم الفني: <https://dv.net/#support>
4. قم بإنشاء مشكلة على GitHub: <https://github.com/dv-net/dv-merchant/issues>