# Installing and Running DV.net with Docker

> A powerful, multi-service application for a crypto merchant with automatic configuration — just clone and run\!

We have prepared a ready-made set of scripts for the rapid deployment of the **DV.net** crypto merchant via Docker. 
Everything necessary is gathered in the repository:
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)

## 🏃‍♂️ Quick Start

Execute the following commands to run it:

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Configure environment variables if necessary
docker compose up -d
```

**Done\!** Your crypto merchant will be available at:
🔗 `http://localhost:80`


## 🐳 ⚙️ Docker Desktop Configuration (Windows / macOS)

For **Docker Desktop** users on Windows and macOS, you need to enable the following option:

`Enable host networking`
*(Located in Settings → Resources → Network)*

<a href="../../assets/images/installation/docker-instalation.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Docker Desktop</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Docker Desktop\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/docker-instalation.png" alt="Docker Desktop" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 🏗️ Project Architecture

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


## 🔧 Development and Updating

```bash
# Update all submodules to the latest versions
git submodule update --remote

# Rebuild and restart services
docker compose up --build -d
```


## 🐛 Troubleshooting Common Issues

**If submodules did not load:**

```bash
git submodule update --init --recursive
```

**Issues with Docker containers:**

```bash
docker compose down && docker compose up --build -d
```

**Cleanup and full restart:**

```bash
docker compose down -v && docker compose up --build -d
```

> 💡 **Tip:** After configuration, don't forget to check the services' operation and adjust the parameters in the `.env` 
> file to suit your needs.