# Anleitung zur Installation und Konfiguration des Merchants [dv.net](http://dv.net)

## Installation

Installieren Sie den Merchant mit dem bereitgestellten Skript:

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

Bitte beachten Sie: Wenn auf Ihrem Server eine Firewall aktiv ist, müssen Sie die Ports **80** und **443** zu den Ausnahmen hinzufügen.

### Prüfung, ob eine Firewall vorhanden ist und aktiv

#### Ubuntu / Debian

**UFW** (am häufigsten verwendet):

```bash
# Prüfen, ob ufw installiert ist
command -v ufw && ufw --version

# Firewall-Status
sudo ufw status verbose

# Prüfen, ob der Dienst aktiv ist
systemctl is-active ufw
```

**firewalld** (seltener, aber möglich):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (wenn weder ufw noch firewalld verwendet werden):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (Standard für CentOS):

```bash
# Prüfen, ob firewalld installiert ist
command -v firewall-cmd && firewall-cmd --version

# Status und Zustand
sudo systemctl status firewalld
sudo firewall-cmd --state

# Liste der geöffneten Ports
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (falls manuell installiert):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### Ports öffnen (wenn Firewall aktiv ist)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / gelegentlich Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## Domainnamen verknüpfen

> In den Beispielen: Website — `domain.com`, Merchant — `pay.domain.com`.

Zwei Varianten:

1. **Cloudflare** — am einfachsten: Proxy aktivieren, HTTPS steht sofort zur Verfügung.
2. **Nginx + Let's Encrypt** — wenn Cloudflare nicht verwendet wird.

---



### Variante 1. Cloudflare (empfohlen)

Der Merchant lauscht nach der Installation bereits auf Port **80**. Cloudflare stellt HTTPS für den Benutzer bereit.

#### Schritt 1. Ports 80 und 443 öffnen

Siehe Abschnitt [Installation → Ports öffnen](#ports-offnen-wenn-firewall-aktiv-ist).

#### Schritt 2. DNS-Eintrag hinzufügen

Cloudflare → Ihre Domain → **DNS** → A-Eintrag erstellen:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (oder gewünschte Subdomain) | `IHRE_SERVER_IP` | **Proxied** (orange Wolke) |




#### Schritt 3. SSL-Modus

Cloudflare → **SSL/TLS** → Modus **Flexible**.

#### Schritt 4. Prüfung

Warten Sie ein paar Minuten und öffnen Sie:

```text
https://pay.domain.com
```

Die Merchant-Seite sollte sich öffnen. Konfigurieren Sie anschließend im Browser weiter.

---



### Variante 2. Nginx + Let's Encrypt

Wenn Sie Cloudflare nicht verwenden — stellen Sie SSL selbst auf dem Server aus.

#### Schritt 1. Ports 80 und 443 öffnen

Siehe Abschnitt [Installation → Ports öffnen](#ports-offnen-wenn-firewall-aktiv-ist).

#### Schritt 2. DNS

Erstellen Sie im Panel Ihres Registrars einen A-Eintrag:

```text
pay.domain.com    A     IHRE_SERVER_IP
```

Prüfen Sie, dass DNS bereits auf den Server zeigt:

```bash
dig +short pay.domain.com
```



#### Schritt 3. Nginx und Certbot installieren

**Ubuntu / Debian:**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

**CentOS:**

```bash
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```



#### Schritt 4. Merchant auf Port 8080 umstellen

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

```yaml
http:
  port: "8080"
```

```bash
sudo systemctl restart dv-merchant
```



#### Schritt 5. Nginx-Konfiguration

```bash
sudo nano /etc/nginx/conf.d/pay.domain.com.conf
```

```nginx
server {
    listen 80;
    server_name pay.domain.com;

    client_max_body_size 128M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```



#### Schritt 6. Zertifikat ausstellen

```bash
sudo certbot --nginx -d pay.domain.com
```



#### Schritt 7. Prüfung

Öffnen Sie:

```text
https://pay.domain.com
```

und setzen Sie die Merchant-Konfiguration fort.

## Erstkonfiguration im Browser

Nach Installation und Domainverknüpfung öffnen Sie die Merchant-Adresse:

```text
https://pay.domain.com/
```

Das System leitet Sie automatisch in das Panel (`/dv-admin/`) weiter und zeigt den Installationsassistenten.

---



### Schritt 1. Systemprüfung

Bildschirm: **„Willkommen im DaVinci-Projekt“**.

Es sollten grüne Häkchen angezeigt werden:

- **PostgreSQL**
- **Redis**

Klicken Sie auf **„Weiter“**.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Systemprüfung</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Systemprüfung\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="Systemprüfung" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Schritt 2. Systemadministrator erstellen

Bildschirm: **„Systemadministrator erstellen“**.

Füllen Sie aus:


| Feld                  | Anforderung          |
| --------------------- | -------------------- |
| Email                 | Gültige E-Mail-Adresse |
| Password              | 8 bis 32 Zeichen     |
| Password confirmation | stimmt mit Passwort überein |


Klicken Sie auf **„Weiter“**.

> Dies ist der Root-Benutzer. Speichern Sie Login und Passwort an einem sicheren Ort.  
> Wird nur einmal bei der Erstinstallation erstellt.

Nach der Registrierung initialisiert das System automatisch das Processing (Verknüpfung Merchant ↔ Processing).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Systemadministrator erstellen</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Systemadministrator erstellen\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="Systemadministrator erstellen" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Schritt 3. Seed-Phrase generieren und bestätigen

Bildschirm: **„Generate seed phrase“ / Mnemonik generieren**.

1. Wählen Sie die Phrasenlänge: **12** oder **24** Wörter (Standard: 24).
2. Klicken Sie auf **„Generate mnemonics“**, wenn Sie neu generieren möchten.
3. Klicken Sie auf **„Show“**, um die Wörter anzuzeigen.
4. **Kopieren und speichern Sie die Phrase offline** (Papier / Passwortmanager / Offline-Speicher).
5. Klicken Sie auf **„Confirm“**.

> Die Seed-Phrase ist der Master-Schlüssel aller Merchant-Wallets. Wer sie besitzt, kontrolliert die Mittel.  
> Ohne sie ist die Wiederherstellung des Wallet-Zugangs nicht möglich.

Nach der Bestätigung öffnet sich **Quick start**.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Seed-Phrase generieren</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Seed-Phrase generieren\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="Seed-Phrase generieren" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Schritt 4. Schnellstart :



#### 4.1. Projekt-URL

Geben Sie die URL Ihrer Website/Ihres Projekts im Format `https://domain.com` ein und klicken Sie auf **„Save“.**

#### 4.2. Webhook und API

1. Geben Sie die Webhook-URL an (wohin DV.net Zahlungsbenachrichtigungen sendet).
2. Kopieren Sie den **API key** — er muss im Header `x-api-key` übergeben werden.
3. Kopieren Sie den Secret Key, der zur Authentifizierung von Webhooks verwendet wird.



#### 4.3. Processing-Wallets aufladen

Auf dem Bildschirm werden die Adressen der Processing-Wallets nach Netzwerken angezeigt.

Diese müssen später aufgeladen werden — von ihnen werden Netzwerkgebühren bei Überweisungen von Hot Wallets der Kunden bezahlt.

Klicken Sie auf **„Next“** / **„Finish“**, oder **„Skip and set up later“**, wenn Sie die Einrichtung später vornehmen.

Nach Abschluss öffnet sich das Merchant-Dashboard.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Schnellstart</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Schnellstart\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="Schnellstart" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## Projektkonfiguration — Schritt für Schritt:

Konfiguration eines bereits installierten Merchants auf einer Testdomain:

```text
https://pay.domain.com/
```

---



### Teil 1. Im Panel anmelden

1. Öffnen Sie den Browser (Chrome / Safari / Firefox).
2. Geben Sie in der Adresszeile ein:

```text
https://pay.domain.com/
```

1. Drücken Sie Enter.
2. Wenn die Anmeldeseite erscheint — geben Sie **E-Mail** und **Passwort** des Administrators ein (die Sie bei der Installation erstellt haben).
3. Klicken Sie auf die Anmeldeschaltfläche.

Sie sollten im DV.net-Verwaltungspanel landen.

---



### Teil 2. Shop (Projekt) erstellen

1. Suchen Sie im linken Menü den Punkt **„Projects“** / **„Projekte“**.
2. Klicken Sie darauf.
3. Klicken Sie oben rechts auf **„Create a store“** / **„Shop erstellen“**.
4. Füllen Sie die Felder aus:


| Feld                | Was eintragen                              | Beispiel               |
| ------------------- | ------------------------------------------ | ---------------------- |
| **Name** / Name     | Name Ihres Shops                           | `Testshop`     |
| **Site** / Website  | Link zu Ihrer Website (kann leer bleiben)  | `https://domain.com`   |


1. Klicken Sie auf **„Create a project“** / **„Projekt erstellen“**.
2. Warten Sie auf die Meldung, dass der Shop erstellt wurde.
3. Sie kehren zur Projektliste zurück — dort erscheint Ihr Shop.

> Wenn der Shop bereits im Quick start erstellt wurde — müssen Sie keinen neuen anlegen. Öffnen Sie einfach den vorhandenen über **Edit**.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Shop erstellen</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Shop erstellen\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="Shop erstellen" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 3. Shop-Einstellungen öffnen

1. Suchen Sie in der Liste **Projects** Ihren Shop.
2. Klicken Sie in der Zeile rechts auf **„Edit“** / **„Bearbeiten“**.
3. Es öffnet sich die Shop-Seite mit zwei Registerkarten oben:
  - **Main** — API-Schlüssel und Webhooks
  - **Advanced settings** — Währungen, Website, Zahlungsformular

Zuerst konfigurieren wir **Main**, danach **Advanced settings**.

---



### Teil 4. API key und Secret key abrufen

Auf der Registerkarte **Main**:

#### 4.1. API key

1. Suchen Sie den Block **„Your API key“** / **„Ihr API-Schlüssel“**.
2. Wenn noch kein Schlüssel vorhanden ist — klicken Sie auf Erstellen / **Generate**.
3. Klicken Sie auf das Kopiersymbol neben dem Schlüssel.
4. Speichern Sie den Schlüssel.

Dieser Schlüssel wird für den Header bei Anfragen benötigt:

```text
x-api-key: IHR_SCHLÜSSEL
```



#### 4.2. Secret key (zur Webhook-Prüfung)

1. Suchen Sie im selben Bereich **Secret key**.
2. Klicken Sie auf **„Generate new“** / **„Generieren“**, wenn kein Schlüssel vorhanden ist.
3. Klicken Sie auf **„Show“**, um ihn anzuzeigen.
4. Kopieren und speichern Sie ihn zusammen mit dem API key.

> Der Secret key wird benötigt, damit Ihre Website prüfen kann: „Diese Benachrichtigung stammt wirklich von DV.net, nicht von einem Betrüger“.

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key und Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key und Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key und Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 5. Webhooks konfigurieren

Ein Webhook ist ein „Anruf“ von DV.net an Ihre Website, wenn ein Kunde bezahlt hat.

1. Suchen Sie auf der Registerkarte **Main** den Block **„Webhooks“**.
2. Fügen Sie in das URL-Feld die Adresse Ihres Handlers ein, zum Beispiel:

```text
https://domain.com/api/dv-webhook
```

> Solange Sie noch keinen eigenen Handler haben — können Sie diesen Schritt vorübergehend überspringen und später zurückkehren. Ohne Webhook kann die Zahlung funktionieren, aber der Shop erfährt nicht automatisch, dass das Geld eingegangen ist.

1. Aktivieren Sie die benötigten Ereignisse, mindestens:
  - WebHook bei erfolgreicher Zahlung (**WebHook on successful payment**)
2. Klicken Sie auf **„Create“** oder **„Save“**.
3. Klicken Sie auf **„Test“** und prüfen Sie, ob Ihr Server antwortet.

Wiederholen Sie dies für weitere Ereignisse, falls nötig (unbestätigte Zahlung, Auszahlung vom Processing-Wallet).

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Webhooks konfigurieren</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Webhooks konfigurieren\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="Webhooks konfigurieren" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 6. Währungen aktivieren und grundlegende Shop-Einstellungen

1. Wechseln Sie zur Registerkarte **„Advanced settings“** / **„Erweiterte Einstellungen“**.
2. Im Block **General**:
  - prüfen Sie den **Namen** des Shops;
  - geben Sie **Project website** (Projektwebsite) an, falls noch nicht gesetzt.
3. Im Block **Accepted currencies** / **Akzeptierte Währungen**:
  - klicken Sie auf die gewünschten Coins (z. B. USDT Tron, BTC, ETH);
  - oder klicken Sie auf **„Select all“**, wenn Sie alle benötigen.
4. Im Block **Payment form settings**:
  - **Minimal payment** — Mindestbetrag (nicht weniger als `$0.1`);
  - optional **success_url** und **return_url** angeben (wohin der Kunde nach der Zahlung zurückgeleitet wird).
5. Klicken Sie unten auf **„Save“** / **„Speichern“**.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Erweiterte Shop-Einstellungen</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Erweiterte Shop-Einstellungen\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="Erweiterte Shop-Einstellungen" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 7. Zahlungslink (fertiges Formular)

In **Advanced settings** finden Sie eine Linkvorlage der Form:

```text
https://pay.domain.com/pay/store/SHOP_ID/<ihre_client_ID>
```

Dabei:

- `SHOP_ID` — wird vom System bereits eingesetzt;
- `<ihre_client_ID>` — ersetzen Sie durch die Kunden-ID in Ihrem System (z. B. `user_15`).

Beispiel:

```text
https://pay.domain.com/pay/store/IHR_STORE_UUID/user_15
```

Diesen Link können Sie im Browser öffnen — das DV.net-Zahlungsformular wird angezeigt.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Zahlungslink</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Zahlungslink\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="Zahlungslink" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 8. Testzahlung aus dem Panel erstellen:

1. Kehren Sie zu **Projects** zurück.
2. Klicken Sie in der Shop-Zeile auf **„Create payment“** / **„Zahlung erstellen“**.
3. Füllen Sie im Dialog aus:
  - **Amount** — Betrag in Dollar, z. B. `5`;
  - **Email** — kann leer bleiben;
  - **External ID** — Kunden-ID (oder automatische Generierung belassen);
  - **Currency** — Zahlungswährung (falls abgefragt).
4. Klicken Sie auf **„Create payment“**.
5. Kopieren Sie den angezeigten **Zahlungslink**.
6. Öffnen Sie ihn in einem neuen Tab — die Zahlungsseite sollte erscheinen.

So prüfen Sie, ob der Shop funktioniert.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Testzahlung erstellen</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Testzahlung erstellen\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="Testzahlung erstellen" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 9. Shop über API anbinden

Wenn die Schlüssel bereits vorhanden sind:

**API-Adresse:**

```text
https://pay.domain.com
```

**Rechnung / Wallet für Zahlung erstellen:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: IHR_API_KEY' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

In der Antwort finden Sie das Feld `**pay_url**` — dieses senden Sie an den Kunden.

---



### Teil 10. Processing-Wallets aufladen

1. Öffnen Sie im linken Menü **Dashboard** / **Dashboard**.
2. Suchen Sie den Block der Processing-Wallets (nach Netzwerken: Tron, Ethereum usw.).
3. Kopieren Sie die Adresse des gewünschten Netzwerks.
4. Senden Sie etwas Krypto desselben Netzwerks dorthin (für Gebühren).

Ohne Aufladung kann der Zahlungseingang funktionieren, Überweisungen/Auszahlungen von Hot Wallets scheitern jedoch an fehlendem Gas/Gebühren.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Processing-Wallets</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Processing-Wallets\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="Processing-Wallets" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Teil 11. Checkliste „Alles bereit“

Haken Sie ab:

- [ ] Angemeldet auf `https://pay.domain.com/`
- [ ] Shop (Projekt) erstellt
- [ ] **API key** kopiert
- [ ] **Secret key** kopiert
- [ ] Seed-Phrase des Administrators gespeichert (bereits bei der Installation)
- [ ] Benötigte Währungen aktiviert
- [ ] Webhook konfiguriert (oder bewusst zurückgestellt)
- [ ] Testzahlung erstellt und `pay_url` geöffnet
- [ ] Processing-Wallets bei Bedarf aufgeladen

Wenn alle Punkte erledigt sind — ist der Shop bereit für die Testintegration.

---



### Häufige Probleme (einfach erklärt)


| Problem                     | Was tun                                                                       |
| --------------------------- | ----------------------------------------------------------------------------- |
| Website öffnet sich nicht   | Prüfen Sie, dass die Domain `pay.domain.com` auf den Server zeigt, Ports 80/443 geöffnet sind |
| Keine Schaltfläche Shop erstellen | Sie sind nicht als Administrator angemeldet — abmelden und erneut anmelden |
| Kein API key                | Projekt öffnen → **Edit** → **Main** → Generate                               |
| Zahlungslink öffnet sich nicht | Prüfen Sie, dass Sie den Link vollständig kopiert haben; Shop-Währungen aktiviert |
| Webhook kommt nicht an      | URL muss aus dem Internet erreichbar sein (kein localhost); Test im Panel prüfen |
| Admin-Passwort vergessen    | Wiederherstellung per CLI auf dem Server: `dv-merchant users` (SSH-Zugang erforderlich) |


---



## Integrationsbeispiele

Szenarien:

1. Zahlung über **10 USD** für Kunde `user_123` erstellen
2. Link `pay_url` erhalten und an den Kunden weitergeben
3. Webhook empfangen, Signatur prüfen, mit `{"success": true}` antworten

Tragen Sie vor Beginn Ihre Werte ein:


| Was            | Wo finden              | Beispiel                   |
| -------------- | ---------------------- | -------------------------- |
| Merchant-Adresse | Ihre Zahlungsdomain  | `https://pay.domain.com`   |
| API key        | Projects → Edit → Main | `IHR_API_KEY`            |
| Secret key     | dortselbst             | `IHR_SECRET_KEY`         |
| Shop-ID        | Advanced settings      | `IHR_STORE_UUID`         |
| Ihre Website   | Shop-Website           | `https://domain.com`       |




### Zuerst Webhook im Panel konfigurieren (einmalig)

1. Öffnen Sie `https://pay.domain.com`
2. Gehen Sie zu: **Projects → Ihr Shop → Edit → Main**
3. Suchen Sie den Block **Webhooks**
4. URL einfügen: `https://domain.com/dv/webhook`
5. Bestätigte Zahlung aktivieren
6. Klicken Sie auf **Save**

---



### Zahlungsablauf

```text
1. Kunde klickt auf „Bezahlen“
2. Ihre Website erstellt die Zahlung in DV.net und gibt den Link an den Kunden weiter
3. Kunde öffnet pay_url und bezahlt
4. DV.net sendet einen Webhook an Ihre Website und informiert Sie über den Zahlungsstatus
5. Sie prüfen die Signatur und schreiben die Bestellung gut
6. Sie antworten mit {"success": true}
```

---



### 1) cURL



#### Schritt 1. Zahlung erstellen

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: IHR_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### Schritt 2. `pay_url` aus der Antwort entnehmen

Diesen Link senden Sie an den Kunden.

#### Zusätzlich:

Währungsliste abrufen:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: IHR_API_KEY'
```

Aktuellen Kurs abrufen:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: IHR_API_KEY'
```

---



### 2) Python



#### Schritt 1. Bibliothek installieren

```bash
pip install dv-net-client
```



#### Schritt 2. Zahlung erstellen

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="IHR_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # an den Kunden senden
```



#### Schritt 3. Webhook empfangen

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "IHR_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. Signatur prüfen
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. Wenn Zahlung bestätigt — gutschreiben
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. Nicht doppelt gutschreiben
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"Zahlung von {user_id}: {amount} USD")
            # hier Bestellung / Guthaben speichern

    # 4. Immer so antworten
    return jsonify({"success": True})
```

---



### 3) PHP



#### Schritt 1. Bibliothek installieren

```bash
composer require dv-net/dv-net-php-client
```



#### Schritt 2. Zahlung erstellen

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: 'IHR_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // an den Kunden senden
```



#### Schritt 3. Webhook empfangen (`/dv/webhook`)

```php
<?php
$secret = 'IHR_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. Signatur prüfen
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. Wenn Zahlung bestätigt — gutschreiben
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. In der DB prüfen, ob $uniq noch nicht verarbeitet wurde
    // Bestellung dem Benutzer $userId gutschreiben
}

// 4. Immer so antworten
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### Schritt 1. Bibliothek installieren

```bash
npm install @dv-net/js-client express
```



#### Schritt 2. Zahlung erstellen

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "IHR_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // an den Kunden senden
```



#### Schritt 3. Webhook empfangen

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "IHR_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. Signatur prüfen
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. Wenn Zahlung bestätigt — gutschreiben
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. Nicht doppelt gutschreiben
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`Zahlung von ${userId}: ${amount} USD`);
      // hier Bestellung / Guthaben speichern
    }
  }

  // 4. Immer so antworten
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### Schritt 1. Plugin installieren

1. Herunterladen: [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **Plugins → Add New → Upload**
3. **Activate**



#### Schritt 2. Einstellungen eintragen

1. **WooCommerce → Settings → Payments → DV.net**
2. Zahlung aktivieren
3. Angeben:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `IHR_API_KEY`
  - API Secret: `IHR_SECRET_KEY`
4. Speichern



#### Schritt 3. Webhook in [DV.net](http://DV.net) eintragen

Geben Sie die Callback-URL aus den Plugin-Einstellungen an.

#### Schritt 4. Prüfen

Erstellen Sie eine Testbestellung und bezahlen Sie.

---



### 6) OpenCart



#### Schritt 1. Modul installieren

1. Herunterladen: [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`)
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### Schritt 2. Einstellungen eintragen

1. Öffnen Sie Edit bei DV.net Gateway
2. Angeben:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `IHR_API_KEY`
  - API Secret: `IHR_SECRET_KEY`
3. Status: Enabled
4. Speichern



#### Schritt 3. Webhook in [DV.net](http://DV.net) eintragen

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### Schritt 4. Prüfen

Erstellen Sie eine Testbestellung.

---



### Kurz zu Webhooks

1. Antworten Sie immer mit:

```json
{"success": true}
```

1. Signatur:

```text
SHA256(Anfragekörper + Secret_key) = X-Sign-Header
```

1. Um nicht doppelt gutzuschreiben, merken Sie sich:

```text
tx_hash + bc_uniq_key
```

1. Ereignistypen:


| Typ                                | Was tun          |
| ---------------------------------- | ---------------- |
| `PaymentReceived`                  | Zahlung gutschreiben |
| `PaymentNotConfirmed`              | Abwarten         |
| `WithdrawalFromProcessingReceived` | Auszahlung abgeschlossen |


---



### Demo-Beispiele:


| Was              | Link                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce      | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js       | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Express-Demo-Code | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| Formular ohne API | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)   |

