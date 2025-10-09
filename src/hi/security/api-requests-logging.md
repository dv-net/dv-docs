# API dv.net के लिए अनुरोधों की निगरानी

## सारांश

एप्लिकेशन `api.dv.net` सर्वर के साथ अतिरिक्त सुविधाएँ लागू करने हेतु इंटरैक्ट करता है, जिनमें शामिल हैं:

- 📧 अपने स्वयं के SMTP सर्वर को सेटअप किए बिना ईमेल सूचनाएँ भेजना
- 📱 रियल-टाइम अलर्ट के लिए Telegram सूचनाएँ
- 📊 सिस्टम प्रदर्शन विश्लेषण के लिए सांख्यिकी और टेलीमेट्री एकत्र करना
- 🔄 सॉफ़्टवेयर संस्करण नियंत्रण

## सुरक्षा और गोपनीयता

महत्वपूर्ण: हम आपके डेटा की पूर्ण सुरक्षा की गारंटी देते हैं। हमारे API के साथ इंटरैक्शन के दौरान निम्नलिखित कभी भी प्रसारित नहीं किए जाते:

- सीड वाक्यांश
- निजी कुंजियाँ
- पासवर्ड और गोपनीय डेटा
- ऐसी कोई भी अन्य जानकारी जो वॉलेट या खातों पर नियंत्रण खोने का कारण बन सकती है

आप परियोजना के स्रोत कोड की जाँच करके सुरक्षा कार्यान्वयन को स्वतंत्र रूप से सत्यापित कर सकते हैं:  
[https://github.com/dv-net](https://github.com/dv-net)

## उन्नत लॉगिंग सक्षम करना

### कॉन्फ़िगरेशन सेटअप

कॉन्फ़िगरेशन फ़ाइल के `admin` खंड में `log_status: true` पैरामीटर जोड़ें:

```yaml
# /home/dv/merchant/configs/config.yaml

admin:
  log_status: true
  # other admin section parameters...
```

### सेवा पुनरारंभ

कॉन्फ़िगरेशन संशोधित करने के बाद, परिवर्तनों को लागू करने के लिए सेवा को पुनरारंभ करें:

```bash
sudo systemctl restart dv-merchant
```

## लॉग देखना

### विधि 1: कमांड लाइन (journalctl)

API अनुरोध लॉग देखने के लिए सिस्टम जर्नल का उपयोग करें:

```bash
# View all API-related entries
journalctl -u dv-merchant | grep 'DV-API'

# Real-time monitoring
journalctl -u dv-merchant -f | grep 'DV-API'

# View entries from the last hour with timestamps
journalctl -u dv-merchant --since "1 hour ago" | grep 'DV-API'
```

### विधि 2: वेब एप्लिकेशन इंटरफ़ेस

इसके अतिरिक्त, अंतिम 1000 लॉग प्रविष्टियाँ वेब एप्लिकेशन इंटरफ़ेस में सीधे देखी और फ़िल्टर की जा सकती हैं:

![api-requests-logging.png](../../assets/images/security/api-requests-logging.png)

## उन्नत लॉग संग्रह सेटअप

### Promtail + Loki + Grafana के साथ एकीकरण

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

### Logstash कॉन्फ़िगरेशन

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

### Grafana Alloy कॉन्फ़िगरेशन

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