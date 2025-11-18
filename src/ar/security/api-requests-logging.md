# مراقبة الطلبات إلى api.dv.net

## نظرة عامة

يتفاعل التطبيق مع خادم `api.dv.net` لتنفيذ ميزات إضافية، بما في ذلك:

- 📧 إرسال إشعارات البريد الإلكتروني دون الحاجة إلى إعداد خادم SMTP خاص بك
- 📱 إشعارات Telegram للتنبيهات الفورية
- 📊 جمع الإحصاءات والقياسات عن بُعد لتحليل أداء النظام
- 🔄 إدارة إصدارات البرمجيات

## الأمان والخصوصية

مهم: نضمن الأمان التام لبياناتك. عند التفاعل مع واجهة برمجة التطبيقات الخاصة بنا، لا يتم مطلقًا إرسال ما يلي:

- عبارات الاستعادة
- المفاتيح الخاصة
- كلمات المرور والبيانات السرية
- وأي معلومات أخرى قد تؤدي إلى فقدان السيطرة على المحافظ أو الحسابات

يمكنك التحقق بنفسك من تنفيذ إجراءات الأمان من خلال فحص الشفرة المصدرية للمشروع:  
[https://github.com/dv-net](https://github.com/dv-net)

## تمكين التسجيل المتقدم

### إعداد التكوين

أضف المعامل `log_status: true` إلى قسم `admin` في ملف التكوين:

```yaml
# /home/dv/merchant/configs/config.yaml

admin:
  log_status: true
  # other admin section parameters...
```

### إعادة تشغيل الخدمة

بعد تعديل التكوين، أعد تشغيل الخدمة لتطبيق التغييرات:

```bash
sudo systemctl restart dv-merchant
```

## عرض السجلات

### الطريقة 1: سطر الأوامر (journalctl)

استخدم سجل النظام لعرض سجلات طلبات API:

```bash
# View all API-related entries
journalctl -u dv-merchant | grep 'DV-API'

# Real-time monitoring
journalctl -u dv-merchant -f | grep 'DV-API'

# View entries from the last hour with timestamps
journalctl -u dv-merchant --since "1 hour ago" | grep 'DV-API'
```

### الطريقة 2: واجهة تطبيق الويب

بالإضافة إلى ذلك، يمكن عرض آخر 1000 إدخال من السجلات وتصفيتها مباشرةً في واجهة تطبيق الويب:

<a href="../../assets/images/security/api-requests-logging.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>مراقبة الطلبات إلى API</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'مراقبة الطلبات إلى API\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/api-requests-logging.png" alt="مراقبة الطلبات إلى API" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## إعداد متقدم لتجميع السجلات

### التكامل مع Promtail + Loki + Grafana

```yaml
# /etc/promtail/config.yaml

scrape_configs:
  - job_name: dv-merchant
    static_configs:
      - targets:
          - localhost
        labels:
          job: dv-merchant
          __path__: /var/log/dv-merchant/*.log
```

### إعداد Logstash

```ruby
input {
  file {
    path => "/var/log/dv-merchant/api.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
}

filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:loglevel}.*DV-API.*" }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "dv-api-logs-%{+YYYY.MM.dd}"
  }
}
```

### إعداد Grafana Alloy

```yaml
logs:
  positions_directory: /var/lib/grafana-agent-positions

  configs:
    - name: dv-merchant-logs
      scrape_configs:
        - job_name: dv-merchant-api
          static_configs:
            - targets: [localhost]
              labels:
                job: dv-merchant
                __path__: /var/log/dv-merchant/*.log
```