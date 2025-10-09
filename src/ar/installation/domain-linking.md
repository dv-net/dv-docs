# ربط أسماء النطاقات

## Cloudflare

ما عليك سوى إضافة توجيه نطاق إلى عنوان IP الخاص بخادمك

## Nginx

- قم بتثبيت Nginx وتكوينه.
- احصل على شهادة SSL لنطاقك الرئيسي (على سبيل المثال، باستخدام `certbot`).
- تأكد من أن موقعك متاح على `https://نطاقك`.

## تهيئة وإعادة تشغيل التاجر

- افتح ملف تكوين التاجر:

  ```bash
  nano /home/dv/merchant/configs/config.yaml
  ```

- أضف (أو عدّل) الأسطر التالية:

  ```yaml
  http:
    port: "8080"
  ```

- احفظ التغييرات وأعد تشغيل الواجهة الخلفية:

  ```bash
  sudo systemctl restart dv-merchant
  ```

## تهيئة Nginx لنطاق فرعي

- أنشئ ملف تكوين Nginx للنطاق الفرعي:

  ```bash
  nano /etc/nginx/conf.d/{نطاقك أو نطاقك الفرعي}.conf
  ```

- الصق الكتلة التالية فيه (عدّل المنفذ في `proxy_pass` إذا لزم الأمر):

  ```nginx
  server {
      listen 80;
      server_name {نطاقك};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{نطاقك}.access.log;
      error_log   /var/log/nginx/{نطاقك}.error.log;

      location / {
          proxy_pass http://localhost:8080;
      }

      location ~ /\.(ht|svn|git) {
          deny all;
      }

      #Cloudflare proxy mode

      set_real_ip_from 103.21.244.0/22;
      set_real_ip_from 103.22.200.0/22;
      set_real_ip_from 103.31.4.0/22;
      set_real_ip_from 104.16.0.0/12;
      set_real_ip_from 108.162.192.0/18;
      set_real_ip_from 131.0.72.0/22;
      set_real_ip_from 141.101.64.0/18;
      set_real_ip_from 162.158.0.0/15;
      set_real_ip_from 172.64.0.0/13;
      set_real_ip_from 173.245.48.0/20;
      set_real_ip_from 188.114.96.0/20;
      set_real_ip_from 190.93.240.0/20;
      set_real_ip_from 197.234.240.0/22;
      set_real_ip_from 198.41.128.0/17;
      set_real_ip_from 2400:cb00::/32;
      set_real_ip_from 2606:4700::/32;
      set_real_ip_from 2803:f800::/32;
      set_real_ip_from 2405:b500::/32;
      set_real_ip_from 2405:8100::/32;
      set_real_ip_from 2c0f:f248::/32;
      set_real_ip_from 2a06:98c0::/29;

      real_ip_header CF-Connecting-IP;
  }
  ```

- احفظ التغييرات وأعد تحميل Nginx:

  ```bash
  sudo nginx -s reload
  ```

## تهيئة DNS

- في إعدادات DNS الخاصة باستضافتك (أو مسجل النطاق)، اربط النطاق الفرعي `{نطاقك أو نطاقك الفرعي}` بعنوان IP الخاص بخادمك. على سبيل المثال، باستخدام سجل A:

  ```
  {نطاقك أو نطاقك الفرعي}    A     عنوان_IP_الخاص_بخادمك
  ```

##  إصدار شهادة SSL للنطاق الفرعي

- عندما يتم تحديث سجل DNS ويشير إلى الخادم، قم بإصدار الشهادة:

  ```bash
  sudo certbot --nginx -d {نطاقك أو نطاقك الفرعي}
  ```

##  التحقق من الحالة والإعداد النهائي

- تأكد من تشغيل الواجهة الخلفية بنجاح:

  ```bash
  systemctl status dv-merchant
  ```

- انتقل إلى `http://{نطاقك أو نطاقك الفرعي}` (أو `https://{نطاقك أو نطاقك الفرعي}` إذا تم إصدار الشهادة بشكل صحيح) وتابع تهيئة التاجر في المتصفح.