# إخفاء لوحة إدارة خادم التاجر

تصف هذه الإرشادات كيفية إعداد **Nginx** لتقسيم الوصول إلى **لوحة الإدارة** ($/dv-admin/$)، و**نموذج الدفع** ($/pay/$)، و**الواجهة البرمجية** ($/api/v1/*$) لتطبيق **dv-merchant**. يعزّز ذلك الأمان عبر تقييد الوصول إلى المسارات الحساسة وتوفير نطاقات مختلفة للوظائف المختلفة.

## 1. نظرة عامة على مسارات dv-merchant

يقوم خادم تطبيق **dv-merchant** بتقديم الواجهة الأمامية والـ API لعدة مكوّنات باستخدام مجموعات المسارات التالية:

* **/pay/**: يحمّل JS والواجهة الأمامية لـ **نموذج الدفع**.
* **/dv-admin/**: يحمّل JS والواجهة الأمامية لـ **لوحة الإدارة**.
* **/api/v1/public**: أساليب **API العامة** التي يستخدمها **نموذج الدفع**.
* **/api/v1/external**: أساليب API الخاصة بـ **تكامل المتجر** (مثل إنشاء فاتورة).
* **/api/v1/dv-admin**: أساليب API الخاصة بـ **لوحة الإدارة**.

## 2. الإعدادات الأولية

### 2.1 تثبيت Nginx

ثبّت **Nginx** على خادمك. تعتمد التعليمات على نظام التشغيل لديك (على سبيل المثال،
`sudo apt update && sudo apt install nginx` لأنظمة Debian/Ubuntu).

### 2.2 تغيير منفذ dv-merchant

للعمل عبر Nginx كوكيل عكسي، قم بتحويل **dv-merchant** إلى منفذ محلي (مثل **8080**) غير متاح خارجيًا.

حرّر ملف الإعداد:
`nano /home/dv/merchant/configs/config.yaml`

في قسم `'http'`، عيّن المنفذ الجديد:

```yaml
http:
  port: "8080"
```

### 2.3 تحديث عنوان الاستدعاء (Callback)

يجب تحديث **Callback URL** من نظام المعالجة إلى خادم التاجر ضمن إعدادات النظام بحيث يشير إلى العنوان الخارجي المهيأ لنموذج الدفع (مثل `https://pay.some-domain.com`).

## 3. إعداد Nginx

سننشئ **ثلاثة ملفات إعداد منفصلة لـ Nginx** (مضيفات افتراضية)، كل واحد مسؤول عن نطاق/نطاق فرعي خاص به وله قواعد وصوله الخاصة.

مهم: يُنصح باستخدام **HTTPS/SSL** في جميع الإعدادات (مثلًا باستخدام **Certbot**)، لكن الأمثلة أدناه تستخدم HTTP (المنفذ 80) لتبسيط الشرح.

### 3.1 إعداد نموذج الدفع (`pay.some-domain.com`)

يجب أن يوفّر هذا المضيف وصولًا إلى نموذج الدفع وواجهته البرمجية العامة. يجب **حظر** أو **إعادة توجيه** جميع المسارات المتعلقة بالإدارة أو الواجهة البرمجية الخارجية.

أنشئ الملف `/etc/nginx/conf.d/pay.some-domain.com.conf`:

```nginx
server {
    listen 80;
    server_name pay.some-domain.com; # Use your domain
    client_max_body_size 128M;

    access_log /var/log/nginx/pay.some-domain.com.log main;
    error_log  /var/log/nginx/pay.some-domain.com.error.log warn;

    # 1. Access to the Payment Form and Public API
    location ~ ^/(pay|api/v1/public) {
        proxy_pass http://localhost:8080$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 2. Block and redirect administrative and external routes
    location /dv-admin {
        return 403; # Access denied
    }

    location ~ ^/api/v1/(dv-admin|external) {
        return 403; # Access denied
    }

    # 3. Block all other routes
    location / {
        return 404;
    }
}
```

### 3.2 إعداد واجهة برمجة تطبيقات المتجر الخارجي (`integration.some-domain.com`)

يجب أن يكون هذا المضيف متاحًا **فقط** من عناوين IP الخاصة بمتجرك للتعامل مع الـ API (مثل إنشاء فاتورة).

أنشئ الملف `/etc/nginx/conf.d/integration.some-domain.com.conf`:

```nginx
server {
    listen 80;
    server_name integration.some-domain.com; # Use your domain
    client_max_body_size 128M;

    # Restrict access by IP
    allow 216.58.208.196; # <-- !!! Replace with your store's IP address
    # allow x.x.x.x;    # Add other IPs if necessary
    deny all;


    access_log /var/log/nginx/integration.some-domain.com.log main;
    error_log  /var/log/nginx/integration.some-domain.com.error.log warn;

    # 1. Access only to the external API
    location /api/v1/external {
        proxy_pass http://localhost:8080$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 2. Block all other routes
    location / {
        return 403; # Access denied to everything except /api/v1/external
    }
}
```

### 3.3 إعداد لوحة الإدارة (`panel.some-domain.com`)

يجب أن يوفّر هذا المضيف الوصول إلى كل ما يتعلق بالإدارة وأن يكون متاحًا **فقط من عناوين IP الموثوقة**.

أنشئ الملف `/etc/nginx/conf.d/panel.some-domain.com.conf`:

```nginx
server {
    listen 80;
    server_name panel.some-domain.com; # Use your domain
    client_max_body_size 128M;

    # Restrict access by IP
    allow 216.58.208.196; # <-- !!! Replace with your trusted IP (office/home)
    allow 216.58.208.197; # <-- !!! Replace with another trusted IP
    deny all;


    access_log /var/log/nginx/panel.some-domain.com.log main;
    error_log  /var/log/nginx/panel.some-domain.com.error.log warn;

    # 1. Access to all dv-merchant routes
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. إتمام الإعداد

بعد إنشاء جميع ملفات الإعداد:

1. اختبر إعدادات Nginx:
    ```bash
    sudo nginx -t
    ```
   تأكد من عدم وجود أخطاء في الصياغة.
2. أعد تشغيل Nginx:
    ```bash
    sudo systemctl restart nginx
    ```
3. تحقّق من إعدادات DNS: تأكد من أن النطاقات الثلاثة (`pay.some-domain.com`, `integration.some-domain.com`, و
4. `panel.some-domain.com`) تشير إلى عنوان IP الخاص بخادمك.

أصبحت لوحة الإدارة (المسارات $/dv-admin/*$ و$/api/v1/dv-admin/*$) الآن **مخفية** ومتاحة فقط عبر نطاق
`panel.some-domain.com` ومن مجموعة محدودة من عناوين IP، بينما تتمتع واجهة الدفع والواجهة البرمجية الخارجية بوصول
مفصول ومقيّد بوضوح.