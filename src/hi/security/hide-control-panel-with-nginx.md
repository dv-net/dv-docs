# मर्चेंट सर्वर के प्रशासन पैनल (Administration Panel) को छिपाना

यह गाइड **Nginx** को सेटअप करने का तरीका बताती है ताकि **dv-merchant** एप्लिकेशन के **प्रशासन पैनल** ($/dv-admin/$),
**भुगतान फॉर्म** ($/pay/$), और **API** ($/api/v1/*$) तक पहुँच को अलग-अलग किया जा सके। इससे गोपनीय रूट्स तक पहुँच
सीमित कर सुरक्षा बढ़ती है और अलग-अलग कार्यों के लिए अलग डोमेन उपलब्ध कराए जाते हैं।

## 1\. dv-merchant रूट्स का अवलोकन

**dv-merchant** सर्वर एप्लिकेशन कई कंपोनेंट्स के लिए फ्रंटएंड और API दोनों सर्व करता है, और निम्न रूट समूहों का उपयोग करता है:

* **/pay/**: **भुगतान फॉर्म** के लिए JS और फ्रंटएंड लोड करता है।
* **/dv-admin/**: **प्रशासन पैनल** के लिए JS और फ्रंटएंड लोड करता है।
* **/api/v1/public**: **भुगतान फॉर्म** द्वारा उपयोग किए जाने वाले **पब्लिक** API मेथड्स।
* **/api/v1/external**: **स्टोर इंटीग्रेशन** (जैसे, इनवॉइस बनाना) के लिए API मेथड्स।
* **/api/v1/dv-admin**: **प्रशासन पैनल** के लिए API मेथड्स।

## 2\. प्रारंभिक सेटअप

### 2.1. Nginx स्थापना

अपने सर्वर पर **Nginx** इंस्टॉल करें। निर्देश आपके ऑपरेटिंग सिस्टम पर निर्भर करते हैं (उदाहरण के लिए,
Debian/Ubuntu के लिए `sudo apt update && sudo apt install nginx`)।

### 2.2. dv-merchant पोर्ट बदलना

Nginx को रिवर्स प्रॉक्सी के रूप में चलाने के लिए, **dv-merchant** को किसी लोकल पोर्ट (जैसे, **8080**) पर शिफ्ट करें जो बाहर से एक्सेस न हो।

कन्फ़िगरेशन फ़ाइल संपादित करें:
`nano /home/dv/merchant/configs/config.yaml`

'http' सेक्शन में नया पोर्ट सेट करें:

```yaml
http:
  port: "8080"
```

### 2.3. Callback पता अपडेट करना

सिस्टम सेटिंग्स में प्रोसेसिंग सिस्टम से मर्चेंट सर्वर के लिए **Callback URL** को अपडेट करें ताकि वह
भुगतान फॉर्म के लिए कॉन्फ़िगर किए गए बाहरी पते की ओर इशारा करे (उदाहरण: `https://pay.some-domain.com`)।

## 3\. Nginx कॉन्फ़िगरेशन

हम **तीन अलग-अलग Nginx कॉन्फ़िगरेशन फ़ाइलें** (वर्चुअल होस्ट) बनाएंगे, प्रत्येक अपने-अपने डोमेन/सबडोमेन के लिए ज़िम्मेदार होगी
और अपने-अपने एक्सेस नियम होंगे।

महत्वपूर्ण: सभी कॉन्फ़िगरेशनों के लिए **HTTPS/SSL** की सिफारिश की जाती है (जैसे **Certbot** का उपयोग), लेकिन नीचे दिए गए उदाहरण
सरलता के लिए HTTP (पोर्ट 80) का उपयोग करते हैं।

### 3.1. भुगतान फॉर्म के लिए कॉन्फ़िगरेशन (`pay.some-domain.com`)

यह होस्ट भुगतान फॉर्म और उसकी पब्लिक API तक पहुँच प्रदान करेगा। प्रशासन या बाहरी API से संबंधित सभी रूट्स को
**ब्लॉक** या **रीडायरेक्ट** किया जाना चाहिए।

फ़ाइल बनाएँ `/etc/nginx/conf.d/pay.some-domain.com.conf`:

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

### 3.2. बाहरी स्टोर API के लिए कॉन्फ़िगरेशन (`integration.some-domain.com`)

यह होस्ट केवल आपके स्टोर के IP पतों से API इंटरेक्शन (जैसे, इनवॉइस बनाना) के लिए ही एक्सेसिबल होना चाहिए।

फ़ाइल बनाएँ `/etc/nginx/conf.d/integration.some-domain.com.conf`:

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

### 3.3. प्रशासन पैनल के लिए कॉन्फ़िगरेशन (`panel.some-domain.com`)

यह होस्ट प्रशासन से संबंधित हर चीज़ तक पहुँच प्रदान करेगा और **केवल विश्वसनीय IP पतों** से ही एक्सेसिबल होना चाहिए।

फ़ाइल बनाएँ `/etc/nginx/conf.d/panel.some-domain.com.conf`:

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

## 4\. सेटअप को अंतिम रूप देना

सारी कॉन्फ़िगरेशन फ़ाइलें बनाने के बाद:

1.  **Nginx कॉन्फ़िगरेशन टेस्ट करें:**
    ```bash
    sudo nginx -t
    ```
    सुनिश्चित करें कि कोई सिन्टैक्स एरर नहीं है।
2.  **Nginx रीस्टार्ट करें:**
    ```bash
    sudo systemctl restart nginx
    ```
3.  **DNS चेक करें:** सुनिश्चित करें कि ये तीनों डोमेन (`pay.some-domain.com`, `integration.some-domain.com`, और
4. `panel.some-domain.com`) आपके सर्वर के IP पते की ओर पॉइंट कर रहे हों।

अब प्रशासन पैनल (रूट्स $/dv-admin/*$ और $/api/v1/dv-admin/*$) **छिपा** दिया गया है और केवल
सीमित IP पतों के सेट से `panel.some-domain.com` डोमेन के माध्यम से ही एक्सेस किया जा सकता है, जबकि भुगतान फॉर्म
और बाहरी API को स्पष्ट रूप से अलग और प्रतिबंधित एक्सेस प्राप्त है।