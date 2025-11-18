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

<a href="../../assets/images/installation/docker-instalation.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); fetch(this.href).then(r => r.blob()).then(blob => { const url = URL.createObjectURL(blob); window.open(url, '_blank'); }).catch(() => window.open(this.href, '_blank')); return false;">
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