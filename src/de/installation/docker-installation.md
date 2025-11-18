# Installation und Ausführung von DV.net mit Docker

> Eine leistungsstarke Multi-Service-Anwendung für einen Krypto-Händler mit automatischer Konfiguration — einfach klonen und ausführen\!

Wir haben ein fertiges Skriptpaket für die schnelle Bereitstellung des **DV.net** Krypto-Händlers via Docker vorbereitet.
Alles Notwendige ist im Repository gesammelt:
[https://github.com/dv-net/dv-bundle](https://github.com/dv-net/dv-bundle)

## 🏃‍♂️ Schnellstart

Führen Sie die folgenden Befehle aus, um es zu starten:

```bash
git clone --recursive https://github.com/dv-net/dv-bundle.git
cd dv-bundle
cp .env.example .env  # Umgebungsvariablen bei Bedarf konfigurieren
docker compose up -d
```

**Fertig\!** Ihr Krypto-Händler ist erreichbar unter:
🔗 `http://localhost:80`


## 🐳 ⚙️ Docker Desktop-Konfiguration (Windows / macOS)

Für **Docker Desktop** auf Windows und macOS müssen Sie die folgende Option aktivieren:

`Enable host networking`
*(Zu finden unter Settings → Resources → Network)*

<a href="../../assets/images/installation/docker-instalation.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); fetch(this.href).then(r => r.blob()).then(blob => { const url = URL.createObjectURL(blob); window.open(url, '_blank'); }).catch(() => window.open(this.href, '_blank')); return false;">
  <img src="../../assets/images/installation/docker-instalation.png" alt="Docker Desktop" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## 🏗️ Projektarchitektur

```
📦 dv-bundle/
├── 📂 data/                  # Persistente Datenspeicherung
├── 🛠️ scripts/               # Automatisierungs- und Konfigurationsskripte
└── 🐳 services/              # Service-Container-Submodule
    ├── 📦 dv-merchant/       # Merchant-Dienst
    └── 📦 dv-processing/     # Zahlungsabwicklungsdienst
├── .env.example              # Vorlage für Umgebungsvariablen
├── docker-compose.yml        # Docker-Compose-Konfiguration
└── README.md                 # Dokumentation
```


## 🔧 Entwicklung und Aktualisierung

```bash
# Alle Submodule auf die neuesten Versionen aktualisieren
git submodule update --remote

# Services neu bauen und neu starten
docker compose up --build -d
```


## 🐛 Fehlerbehebung bei häufigen Problemen

**Wenn Submodule nicht geladen wurden:**

```bash
git submodule update --init --recursive
```

**Probleme mit Docker-Containern:**

```bash
docker compose down && docker compose up --build -d
```

**Bereinigung und kompletter Neustart:**

```bash
docker compose down -v && docker compose up --build -d
```

> 💡 **Tipp:** Nach der Konfiguration vergessen Sie nicht, den Betrieb der Dienste zu prüfen und die Parameter in der Datei `.env` an Ihre Bedürfnisse anzupassen.