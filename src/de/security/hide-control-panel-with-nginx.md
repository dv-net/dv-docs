# Das Administrationspanel des Merchant-Servers verbergen

Dieser Leitfaden beschreibt die Einrichtung von **Nginx**, um den Zugriff auf das **Administrationspanel** ($/dv-admin/$), das **Zahlungsformular** ($/pay/$) und die **API** ($/api/v1/*$) der **dv-merchant**-Anwendung zu segmentieren. Dies erhöht die Sicherheit, indem der Zugriff auf vertrauliche Routen eingeschränkt und unterschiedliche Domains für verschiedene Funktionen bereitgestellt werden.

## 1\. Überblick über die dv-merchant-Routen

Die **dv-merchant**-Serveranwendung stellt sowohl das Frontend als auch die API für mehrere Komponenten bereit, mit folgenden Routengruppen:

* **/pay/**: Lädt das JS und das Frontend für das **Zahlungsformular**.
* **/dv-admin/**: Lädt das JS und das Frontend für das **Administrationspanel**.
* **/api/v1/public**: **Öffentliche** API-Methoden, die vom **Zahlungsformular** verwendet werden.
* **/api/v1/external**: API-Methoden für die **Shop-Integration** (z. B. Erstellen einer Rechnung).
* **/api/v1/dv-admin**: API-Methoden für das **Administrationspanel**.

## 2\. Vorbereitung

### 2.1. Nginx-Installation

Installieren Sie **Nginx** auf Ihrem Server. Die Anweisungen hängen von Ihrem Betriebssystem ab (z. B.
`sudo apt update && sudo apt install nginx` für Debian/Ubuntu).

### 2.2. Ändern des dv-merchant-Ports

Um über Nginx als Reverse-Proxy zu arbeiten, stellen Sie **dv-merchant** auf einen lokalen Port um (z. B. **8080**), der extern nicht erreichbar ist.

Bearbeiten Sie die Konfigurationsdatei:
`nano /home/dv/merchant/configs/config.yaml`

In der 'http'-Sektion den neuen Port setzen:

```yaml
http:
  port: "8080"
```

### 2.3. Aktualisieren der Callback-Adresse

Sie müssen in den Systemeinstellungen die **Callback-URL** des Verarbeitungssystems zum Merchant-Server aktualisieren, sodass sie auf die externe Adresse zeigt, die für das Zahlungsformular konfiguriert wurde (z. B. `https://pay.some-domain.com`).

## 3\. Nginx-Konfiguration

Wir erstellen **drei separate Nginx-Konfigurationsdateien** (virtuelle Hosts), die jeweils für ihre eigene Domain/Subdomain verantwortlich sind und eigene Zugriffsregeln haben.

Wichtig: **HTTPS/SSL** wird für alle Konfigurationen empfohlen (z. B. mit **Certbot**), die folgenden Beispiele verwenden jedoch der Einfachheit halber HTTP (Port 80).

### 3.1. Konfiguration für das Zahlungsformular (`pay.some-domain.com`)

Dieser Host muss Zugriff auf das Zahlungsformular und dessen öffentliche API bereitstellen. Alle Routen, die sich auf Administration oder externe API beziehen, müssen **blockiert** oder **umgeleitet** werden.

Erstellen Sie die Datei `/etc/nginx/conf.d/pay.some-domain.com.conf`:

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

### 3.2. Konfiguration für die externe Shop-API (`integration.some-domain.com`)

Dieser Host sollte **nur** von den IP-Adressen Ihres Shops für die API-Interaktion erreichbar sein (z. B. Erstellen einer Rechnung).

Erstellen Sie die Datei `/etc/nginx/conf.d/integration.some-domain.com.conf`:

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

### 3.3. Konfiguration für das Administrationspanel (`panel.some-domain.com`)

Dieser Host muss Zugriff auf alles rund um die Administration bieten und **nur von vertrauenswürdigen IP-Adressen** erreichbar sein.

Erstellen Sie die Datei `/etc/nginx/conf.d/panel.some-domain.com.conf`:

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

## 4\. Abschluss der Einrichtung

Nachdem Sie alle Konfigurationsdateien erstellt haben:

1.  **Nginx-Konfiguration testen:**
    ```bash
    sudo nginx -t
    ```
    Stellen Sie sicher, dass keine Syntaxfehler vorliegen.
2.  **Nginx neu starten:**
    ```bash
    sudo systemctl restart nginx
    ```
3.  **DNS prüfen:** Vergewissern Sie sich, dass alle drei Domains (`pay.some-domain.com`, `integration.some-domain.com`, und
4. `panel.some-domain.com`) auf die IP-Adresse Ihres Servers zeigen.

Das Administrationspanel (Routen $/dv-admin/*$ und $/api/v1/dv-admin/*$) ist nun **verborgen** und nur über die Domain `panel.some-domain.com` von einem eingeschränkten Satz an IP-Adressen aus zugänglich, während das Zahlungsformular und die externe API klar getrennten und eingeschränkten Zugriff haben.