# تثبيت وتشغيل DV.net باستخدام Docker

> تطبيق قوي متعدد الخدمات لتاجر العملات المشفّرة مع تهيئة تلقائية — ما عليك سوى الاستنساخ والتشغيل\!

لقد أعددنا مجموعة جاهزة من السكربتات لنشر تاجر العملات المشفّرة **DV.net** بسرعة عبر Docker.
كل ما يلزم مُجمّع في المستودع:
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)

## 🏃‍♂️ البدء السريع

نفّذ الأوامر التالية لتشغيله:

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Configure environment variables if necessary
docker compose up -d
```

**تمّ\!** سيكون تاجر العملات المشفّرة الخاص بك متاحًا على:
🔗 `http://localhost:80`


## 🐳 ⚙️ إعداد Docker Desktop (Windows / macOS)

لمستخدمي **Docker Desktop** على Windows وmacOS، يجب تمكين الخيار التالي:

`Enable host networking`
*(موجود في Settings → Resources → Network)*

![Docker Desktop](../../assets/images/installation/docker-instalation.png)

## 🏗️ هيكلية المشروع

```
📦 dv-bundle/
├── 📂 data/                  # Persistent data storage
├── 🛠️ scripts/               # Automation and configuration scripts
└── 🐳 services/              # Service container submodules
    ├── 📦 dv-merchant/       # Merchant service
    └── 📦 dv-processing/     # Payment processing service
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Documentation
```


## 🔧 التطوير والتحديث

```bash
# Update all submodules to the latest versions
git submodule update --remote

# Rebuild and restart services
docker compose up --build -d
```


## 🐛 استكشاف المشكلات الشائعة وإصلاحها

**إذا لم تُحمَّل الوحدات الفرعية:**

```bash
git submodule update --init --recursive
```

**مشكلات في حاويات Docker:**

```bash
docker compose down && docker compose up --build -d
```

**تنظيف وإعادة تشغيل كاملة:**

```bash
docker compose down -v && docker compose up --build -d
```

> 💡 **نصيحة:** بعد الإعداد، لا تنسَ التحقق من عمل الخدمات وضبط المعلمات في ملف `.env`
> بما يلائم احتياجاتك.