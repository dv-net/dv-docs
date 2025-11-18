# Instalación y ejecución de DV.net con Docker

> Una potente aplicación multiservicio para un comerciante cripto con configuración automática — ¡solo clona y ejecuta!

Hemos preparado un conjunto de scripts listo para el despliegue rápido del comerciante cripto **DV.net** mediante Docker.
Todo lo necesario está reunido en el repositorio:
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)

## 🏃‍♂️ Inicio rápido

Ejecuta los siguientes comandos para ponerlo en marcha:

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Configure environment variables if necessary
docker compose up -d
```

¡Listo! Tu comerciante cripto estará disponible en:
🔗 `http://localhost:80`


## 🐳 ⚙️ Configuración de Docker Desktop (Windows / macOS)

Para los usuarios de **Docker Desktop** en Windows y macOS, debes habilitar la siguiente opción:

`Enable host networking`
*(Ubicada en Settings → Resources → Network)*

<a href="../../assets/images/installation/docker-instalation.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Docker Desktop</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Docker Desktop\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/docker-instalation.png" alt="Docker Desktop" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 🏗️ Arquitectura del proyecto

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


## 🔧 Desarrollo y actualización

```bash
# Update all submodules to the latest versions
git submodule update --remote

# Rebuild and restart services
docker compose up --build -d
```


## 🐛 Solución de problemas comunes

**Si los submódulos no se cargaron:**

```bash
git submodule update --init --recursive
```

**Problemas con los contenedores de Docker:**

```bash
docker compose down && docker compose up --build -d
```

**Limpieza y reinicio completo:**

```bash
docker compose down -v && docker compose up --build -d
```

> 💡 **Consejo:** Después de la configuración, no olvides comprobar el funcionamiento de los servicios y ajustar los parámetros en el archivo `.env` según tus necesidades.