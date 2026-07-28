# دليل تثبيت وإعداد التاجر [dv.net](http://dv.net)

## التثبيت

قم بتثبيت التاجر باستخدام البرنامج النصي المقدم:

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

يرجى ملاحظة أنه إذا كان لديك جدار حماية (Firewall) على الخادم، فيجب إضافة المنافذ **80** و**443** إلى الاستثناءات.

### التحقق من وجود جدار الحماية وحالته

#### Ubuntu / Debian

**UFW** (الأكثر استخدامًا):

```bash
# التحقق من تثبيت ufw
command -v ufw && ufw --version

# حالة جدار الحماية
sudo ufw status verbose

# التحقق من أن الخدمة نشطة
systemctl is-active ufw
```

**firewalld** (أقل شيوعًا، لكنه ممكن):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (إذا لم يُستخدم ufw وfirewalld):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (الافتراضي في CentOS):

```bash
# التحقق من تثبيت firewalld
command -v firewall-cmd && firewall-cmd --version

# الحالة
sudo systemctl status firewalld
sudo firewall-cmd --state

# قائمة المنافذ المفتوحة
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (إذا تم تثبيته يدويًا):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### فتح المنافذ (إذا كان جدار الحماية نشطًا)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / أحيانًا Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## ربط أسماء النطاقات

> في الأمثلة: الموقع — `domain.com`، التاجر — `pay.domain.com`.

خياران:

1. **Cloudflare** — الأبسط: فعّل البروكسي، وسيظهر HTTPS فورًا.
2. **Nginx + Let's Encrypt** — إذا لم يكن Cloudflare متاحًا.

---



### الخيار 1. Cloudflare (موصى به)

بعد التثبيت، يستمع التاجر بالفعل على المنفذ **80**. Cloudflare يوفّر HTTPS للمستخدم تلقائيًا.

#### الخطوة 1. افتح المنافذ 80 و443

راجع قسم [التثبيت → فتح المنافذ](#فتح-المنافذ-إذا-كان-جدار-الحماية-نشطًا).

#### الخطوة 2. أضف سجل DNS

Cloudflare → نطاقك → **DNS** → أنشئ سجل A:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (أو النطاق الفرعي المطلوب) | `عنوان_IP_للخادم` | **Proxied** (السحابة البرتقالية) |




#### الخطوة 3. وضع SSL

Cloudflare → **SSL/TLS** → الوضع **Flexible**.

#### الخطوة 4. التحقق

انتظر بضع دقائق وافتح:

```text
https://pay.domain.com
```

يجب أن تظهر صفحة التاجر. بعد ذلك، أكمل الإعداد في المتصفح.

---



### الخيار 2. Nginx + Let's Encrypt

إذا لم تستخدم Cloudflare — أصدر شهادة SSL بنفسك على الخادم.

#### الخطوة 1. افتح المنافذ 80 و443

راجع قسم [التثبيت → فتح المنافذ](#فتح-المنافذ-إذا-كان-جدار-الحماية-نشطًا).

#### الخطوة 2. DNS

في لوحة مسجّل النطاق، أنشئ سجل A:

```text
pay.domain.com    A     عنوان_IP_للخادم
```

تحقق من أن DNS يشير بالفعل إلى الخادم:

```bash
dig +short pay.domain.com
```



#### الخطوة 3. ثبّت Nginx وCertbot

**Ubuntu / Debian:**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

**CentOS:**

```bash
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```



#### الخطوة 4. انقل التاجر إلى المنفذ 8080

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

```yaml
http:
  port: "8080"
```

```bash
sudo systemctl restart dv-merchant
```



#### الخطوة 5. إعداد Nginx

```bash
sudo nano /etc/nginx/conf.d/pay.domain.com.conf
```

```nginx
server {
    listen 80;
    server_name pay.domain.com;

    client_max_body_size 128M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```



#### الخطوة 6. أصدر الشهادة

```bash
sudo certbot --nginx -d pay.domain.com
```



#### الخطوة 7. التحقق

افتح:

```text
https://pay.domain.com
```

وأكمل إعداد التاجر.

## الإعداد الأولي في المتصفح

بعد التثبيت وربط النطاق، افتح عنوان التاجر:

```text
https://pay.domain.com/
```

سيعيد النظام توجيهك تلقائيًا إلى لوحة التحكم (`/dv-admin/`) ويعرض معالج الإعداد.

---



### الخطوة 1. فحص النظام

الشاشة: **«Welcome to the DaVinci project»**.

يجب أن تظهر علامات صح خضراء:

- **PostgreSQL**
- **Redis**

اضغط **«Next»**.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>فحص النظام</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'فحص النظام\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="فحص النظام" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الخطوة 2. إنشاء مسؤول النظام

الشاشة: **«Create system administrator»**.

املأ الحقول:


| الحقل                 | المتطلب              |
| --------------------- | -------------------- |
| Email                 | بريد إلكتروني صالح   |
| Password              | من 8 إلى 32 حرفًا    |
| Password confirmation | يطابق كلمة المرور    |


اضغط **«Next»**.

> هذا مستخدم root. احفظ اسم المستخدم وكلمة المرور في مكان آمن.  
> يُنشأ مرة واحدة فقط عند التثبيت الأول.

بعد التسجيل، يبدأ النظام تلقائيًا في تهيئة processing (ربط merchant ↔ processing).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>إنشاء مسؤول النظام</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'إنشاء مسؤول النظام\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="إنشاء مسؤول النظام" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الخطوة 3. إنشاء عبارة seed وتأكيدها

الشاشة: **«Generate seed phrase»**.

1. اختر طول العبارة: **12** أو **24** كلمة (الافتراضي 24).
2. اضغط **«Generate mnemonics»** إذا احتجت إلى إعادة الإنشاء.
3. اضغط **«Show»** لعرض الكلمات.
4. **انسخ العبارة واحفظها دون اتصال** (ورق / مدير كلمات مرور / تخزين دون اتصال).
5. اضغط **«Confirm»**.

> عبارة seed هي المفتاح الرئيسي لجميع محافظ التاجر. من يملكها — يملك الأموال.  
> بدونها، لا يمكن استعادة الوصول إلى المحافظ.

بعد التأكيد، ستفتح شاشة **Quick start**.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>إنشاء عبارة seed</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'إنشاء عبارة seed\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="إنشاء عبارة seed" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الخطوة 4. البدء السريع:



#### 4.1. URL المشروع

حدّد URL موقعك/مشروعك بالصيغة `https://domain.com` واضغط **«Save».**

#### 4.2. Webhook وAPI

1. حدّد URL الـ webhook (إلى أين سيرسل DV.net إشعارات الدفع).
2. انسخ **API key** — يجب تمريره في ترويسة `x-api-key`.
3. انسخ المفتاح السري المستخدم للتحقق من صحة webhooks.



#### 4.3. تمويل محافظ processing

على الشاشة ستظهر عناوين محافظ processing حسب الشبكات.

يجب تمويلها لاحقًا — منها تُدفع رسوم الشبكة عند التحويلات من المحافظ الساخنة للعملاء.

اضغط **«Next»** / **«Finish»**، أو **«Skip and set up later»** إذا أردت الإعداد لاحقًا.

بعد الانتهاء، ستفتح لوحة تحكم التاجر.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>البدء السريع</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'البدء السريع\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="البدء السريع" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## إعداد المشروع — خطوة بخطوة:

إعداد التاجر المثبّت مسبقًا على نطاق تجريبي:

```text
https://pay.domain.com/
```

---



### الجزء 1. تسجيل الدخول إلى لوحة التحكم

1. افتح المتصفح (Chrome / Safari / Firefox).
2. في شريط العنوان، أدخل:

```text
https://pay.domain.com/
```

1. اضغط Enter.
2. إذا ظهرت شاشة تسجيل الدخول — أدخل **email** و**كلمة المرور** للمسؤول (التي أنشأتها عند التثبيت).
3. اضغط زر تسجيل الدخول.

يجب أن تصل إلى لوحة تحكم DV.net.

---



### الجزء 2. إنشاء متجر (مشروع)

1. في القائمة اليسرى، ابحث عن **Projects**.
2. اضغط عليه.
3. في أعلى اليمين، اضغط **Create a store**.
4. املأ الحقول:


| الحقل    | ماذا تكتب                                  | مثال                 |
| -------- | ------------------------------------------ | -------------------- |
| **Name** | اسم متجرك                                  | `Test store`         |
| **Site** | رابط موقعك (يمكن تركه فارغًا)              | `https://domain.com` |


1. اضغط **Create a project**.
2. انتظر رسالة أن المتجر أُنشئ.
3. ستعود إلى قائمة المشاريع — وسيظهر متجرك فيها.

> إذا أُنشئ المتجر بالفعل في مرحلة Quick start — لا يلزم إنشاء متجر جديد. افتح الموجود عبر **Edit**.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>إنشاء متجر</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'إنشاء متجر\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="إنشاء متجر" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 3. فتح إعدادات المتجر

1. في قائمة **Projects**، ابحث عن متجرك.
2. في نفس الصف على اليمين، اضغط **Edit**.
3. ستفتح صفحة المتجر بعلامتي تبويب في الأعلى:
  - **Main** — مفاتيح API وwebhooks
  - **Advanced settings** — العملات، الموقع، نموذج الدفع

ابدأ بإعداد **Main**، ثم **Advanced settings**.

---



### الجزء 4. الحصول على API key وSecret key

في علامة تبويب **Main**:

#### 4.1. API key

1. ابحث عن قسم **Your API key**.
2. إذا لم يكن هناك مفتاح — اضغط زر الإنشاء / **Generate**.
3. اضغط أيقونة النسخ بجانب المفتاح.
4. احفظ المفتاح.

ستحتاج هذا المفتاح في ترويسة الطلبات:

```text
x-api-key: مفتاحك
```



#### 4.2. Secret key (للتحقق من webhooks)

1. في نفس القسم، ابحث عن **Secret key**.
2. اضغط **Generate new** إذا لم يكن هناك مفتاح.
3. اضغط **«Show»** لعرضه.
4. انسخه واحفظه بجانب API key.

> Secret key ضروري ليتحقق موقعك من أن «هذا الإشعار من DV.net فعلًا، وليس من محتال».

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key و Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key و Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key و Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 5. إعداد webhooks

Webhook هو «اتصال» من DV.net إلى موقعك عندما يدفع العميل.

1. في علامة تبويب **Main**، ابحث عن قسم **«Webhooks»**.
2. في حقل URL، الصق عنوان المعالج، مثلًا:

```text
https://domain.com/api/dv-webhook
```

> إذا لم يكن لديك معالج بعد — يمكنك تخطي هذه الخطوة مؤقتًا والعودة لاحقًا. بدون webhook قد يعمل الدفع، لكن المتجر لن يعرف تلقائيًا أن الأموال وصلت.

1. فعّل الأحداث المطلوبة، على الأقل:
  - WebHook عند الدفع الناجح (**WebHook on successful payment**)
2. اضغط **«Create»** أو **«Save»**.
3. اضغط **«Test»** وتحقق من أن خادمك يستجيب.

كرّر للأحداث الأخرى إذا لزم (دفعة غير مؤكدة، سحب من محفظة processing).

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>إعداد webhooks</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'إعداد webhooks\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="إعداد webhooks" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 6. تفعيل العملات والإعدادات الأساسية للمتجر

1. انتقل إلى علامة تبويب **Advanced settings**.
2. في قسم **General**:
  - تحقق من **اسم** المتجر؛
  - حدّد **Project website** (موقع المشروع) إذا لم يُحدَّد بعد.
3. في قسم **Accepted currencies**:
  - اضغط على العملات المطلوبة (مثل USDT Tron، BTC، ETH)؛
  - أو اضغط **Select all** إذا أردت جميعها.
4. في قسم **Payment form settings**:
  - **Minimal payment** — الحد الأدنى للمبلغ (لا يقل عن `$0.1`)؛
  - عند الحاجة، حدّد **success_url** و**return_url** (إلى أين يُعاد العميل بعد الدفع).
5. في الأسفل، اضغط **Save**.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>الإعدادات المتقدمة للمتجر</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'الإعدادات المتقدمة للمتجر\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="الإعدادات المتقدمة للمتجر" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 7. رابط الدفع (نموذج جاهز)

في **Advanced settings** ستجد قالب رابط بالصيغة:

```text
https://pay.domain.com/pay/store/معرف_المتجر/<معرف_العميل>
```

حيث:

- `معرف_المتجر` — مُعبّأ مسبقًا من النظام؛
- `<معرف_العميل>` — استبدله بمعرّف العميل في نظامك (مثل `user_15`).

مثال:

```text
https://pay.domain.com/pay/store/معرف_المتجر_UUID/user_15
```

يمكنك فتح هذا الرابط في المتصفح — ستظهر نموذج الدفع DV.net.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>رابط الدفع</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'رابط الدفع\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="رابط الدفع" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 8. إنشاء دفعة تجريبية من لوحة التحكم:

1. عد إلى **Projects**.
2. في صف المتجر، اضغط **Create payment**.
3. في النافذة، املأ:
  - **Amount** — المبلغ بالدولار، مثل `5`؛
  - **Email** — يمكن تركه فارغًا؛
  - **External ID** — معرّف العميل (أو اترك التوليد التلقائي)؛
  - **Currency** — عملة الدفع (إذا طُلبت).
4. اضغط **«Create payment»**.
5. انسخ **رابط الدفع** الذي يظهر.
6. افتحه في تبويب جديد — يجب أن تظهر صفحة الدفع.

بهذا تتحقق من أن المتجر يعمل.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>إنشاء دفعة تجريبية</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'إنشاء دفعة تجريبية\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="إنشاء دفعة تجريبية" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 9. ربط المتجر عبر API

عندما تكون المفاتيح جاهزة:

**عنوان API:**

```text
https://pay.domain.com
```

**إنشاء فاتورة / محفظة للدفع:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: مفتاح_API_الخاص_بك' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

في الاستجابة ستجد حقل `**pay_url**` — أرسله إلى العميل.

---



### الجزء 10. تمويل محافظ processing

1. في القائمة اليسرى، افتح **Dashboard**.
2. ابحث عن قسم محافظ processing (حسب الشبكات: Tron، Ethereum، إلخ).
3. انسخ عنوان الشبكة المطلوبة.
4. أرسل إليه قدرًا يسيرًا من العملة المشفّرة من نفس الشبكة (للرسوم).

بدون ذلك قد يعمل قبول المدفوعات، لكن التحويلات/السحب من المحافظ الساخنة قد يتوقف بسبب نقص الغاز/الرسوم.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>محافظ processing</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'محافظ processing\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="محافظ processing" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### الجزء 11. قائمة التحقق «كل شيء جاهز»

ضع علامة على:

- [ ] سجّلت الدخول إلى `https://pay.domain.com/`
- [ ] أنشأت متجرًا (مشروعًا)
- [ ] نسخت **API key**
- [ ] نسخت **Secret key**
- [ ] حفظت عبارة seed للمسؤول (في مرحلة التثبيت)
- [ ] فعّلت العملات المطلوبة
- [ ] أعددت webhook (أو أجّلت ذلك عن قصد)
- [ ] أنشأت دفعة تجريبية وفتحت `pay_url`
- [ ] عند الحاجة، موّلت محافظ processing

إذا أكملت جميع البنود — المتجر جاهز للتكامل التجريبي.

---



### المشكلات الشائعة (بكلمات بسيطة)


| المشكلة                      | ما يجب فعله                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| الموقع لا يفتح               | تحقق من أن النطاق `pay.domain.com` يشير إلى الخادم وأن المنافذ 80/443 مفتوحة   |
| لا يوجد زر إنشاء متجر        | لم تسجّل الدخول كمسؤول — سجّل الخروج ثم الدخول مجددًا                           |
| لا يوجد API key              | افتح المشروع → **Edit** → **Main** → Generate                                   |
| رابط الدفع لا يفتح           | تحقق من نسخ الرابط كاملًا؛ وتأكد من تفعيل عملات المتجر                          |
| webhook لا يصل               | يجب أن يكون URL متاحًا من الإنترنت (ليس localhost)؛ استخدم Test في لوحة التحكم  |
| نسيت كلمة مرور المسؤول       | الاستعادة عبر CLI على الخادم: `dv-merchant users` (يلزم وصول SSH)               |


---



## أمثلة التكامل

السيناريوهات:

1. إنشاء دفعة بقيمة **10 USD** للعميل `user_123`
2. الحصول على رابط `pay_url` وإرساله إلى العميل
3. استقبال webhook، التحقق من التوقيع، والرد بـ `{"success": true}`

قبل البدء، استبدل القيم بقيمك:


| ماذا           | أين تجده               | مثال                     |
| -------------- | ---------------------- | ------------------------ |
| عنوان التاجر   | نطاق الدفع الخاص بك    | `https://pay.domain.com` |
| API key        | Projects → Edit → Main | `مفتاح_API_الخاص_بك`            |
| Secret key     | في نفس المكان          | `المفتاح_السري_الخاص_بك`         |
| معرّف المتجر   | Advanced settings      | `معرف_المتجر_UUID`         |
| موقعك          | موقع المتجر            | `https://domain.com`     |




### أولًا: إعداد webhook في لوحة التحكم (مرة واحدة)

1. افتح `https://pay.domain.com`
2. انتقل إلى: **Projects → متجرك → Edit → Main**
3. ابحث عن قسم **Webhooks**
4. الصق URL: `https://domain.com/dv/webhook`
5. فعّل الدفع المؤكّد
6. اضغط **Save**

---



### مخطط الدفع

```text
1. العميل يضغط «ادفع»
2. موقعك ينشئ دفعة في DV.net ويرسل الرابط إلى العميل
3. العميل يفتح pay_url ويدفع
4. DV.net يرسل webhook إلى موقعك لإبلاغك بحالة الدفع
5. تتحقق من التوقيع وتُسجّل الطلب
6. ترد بـ {"success": true}
```

---



### 1) cURL



#### الخطوة 1. إنشاء دفعة

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: مفتاح_API_الخاص_بك' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### الخطوة 2. أخذ `pay_url` من الاستجابة

أرسل هذا الرابط إلى العميل.

#### إضافيًا:

الحصول على قائمة العملات:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: مفتاح_API_الخاص_بك'
```

الحصول على سعر الصرف الحالي:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: مفتاح_API_الخاص_بك'
```

---



### 2) Python



#### الخطوة 1. تثبيت المكتبة

```bash
pip install dv-net-client
```



#### الخطوة 2. إنشاء دفعة

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="مفتاح_API_الخاص_بك",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # أرسل إلى العميل
```



#### الخطوة 3. استقبال webhook

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "المفتاح_السري_الخاص_بك"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. التحقق من التوقيع
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. إذا تم تأكيد الدفع — قيد الطلب
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. لا تقيد مرتين
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"دفع من {user_id}: {amount} USD")
            # احفظ الطلب / الرصيد هنا

    # 4. أجب دائمًا هكذا
    return jsonify({"success": True})
```

---



### 3) PHP



#### الخطوة 1. تثبيت المكتبة

```bash
composer require dv-net/dv-net-php-client
```



#### الخطوة 2. إنشاء دفعة

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: 'مفتاح_API_الخاص_بك'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // أرسل إلى العميل
```



#### الخطوة 3. استقبال webhook (`/dv/webhook`)

```php
<?php
$secret = 'المفتاح_السري_الخاص_بك';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. التحقق من التوقيع
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. إذا تم تأكيد الدفع — قيد الطلب
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. تحقق في قاعدة البيانات أن $uniq لم يُعالج من قبل
    // قيد الطلب للمستخدم $userId
}

// 4. أجب دائمًا هكذا
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### الخطوة 1. تثبيت المكتبة

```bash
npm install @dv-net/js-client express
```



#### الخطوة 2. إنشاء دفعة

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "مفتاح_API_الخاص_بك",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // أرسل إلى العميل
```



#### الخطوة 3. استقبال webhook

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "المفتاح_السري_الخاص_بك";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. التحقق من التوقيع
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. إذا تم تأكيد الدفع — قيد الطلب
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. لا تقيد مرتين
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`دفع من ${userId}: ${amount} USD`);
      // احفظ الطلب / الرصيد هنا
    }
  }

  // 4. أجب دائمًا هكذا
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### الخطوة 1. تثبيت الإضافة

1. حمّل [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **Plugins → Add New → Upload**
3. **Activate**



#### الخطوة 2. إدخال الإعدادات

1. **WooCommerce → Settings → Payments → DV.net**
2. فعّل الدفع
3. حدّد:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `مفتاح_API_الخاص_بك`
  - API Secret: `المفتاح_السري_الخاص_بك`
4. احفظ



#### الخطوة 3. إعداد webhook في [DV.net](http://DV.net)

حدّد callback URL من إعدادات الإضافة.

#### الخطوة 4. التحقق

أنشئ طلبًا تجريبيًا وادفع.

---



### 6) OpenCart



#### الخطوة 1. تثبيت الوحدة

1. حمّل [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`)
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### الخطوة 2. إدخال الإعدادات

1. افتح Edit لـ DV.net Gateway
2. حدّد:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `مفتاح_API_الخاص_بك`
  - API Secret: `المفتاح_السري_الخاص_بك`
3. Status: Enabled
4. احفظ



#### الخطوة 3. إعداد webhook في [DV.net](http://DV.net)

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### الخطوة 4. التحقق

أنشئ طلبًا تجريبيًا.

---



### ملخص عن webhooks

1. أجب دائمًا:

```json
{"success": true}
```

1. التوقيع:

```text
SHA256(جسم_الطلب + Secret_key) = رأس X-Sign
```

1. لتجنب الإيداع مرتين، احفظ:

```text
tx_hash + bc_uniq_key
```

1. أنواع الأحداث:


| النوع                              | ماذا تفعل        |
| ---------------------------------- | ---------------- |
| `PaymentReceived`                  | سجّل الدفعة      |
| `PaymentNotConfirmed`              | انتظر            |
| `WithdrawalFromProcessingReceived` | اكتمل السحب      |


---



### أمثلة تجريبية:


| ماذا              | الرابط                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce       | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js        | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| كود Express التجريبي | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| نموذج بدون API    | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |


