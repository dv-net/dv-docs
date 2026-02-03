# Proxy-Anfragen an Börsen (Fallback)

## Beschreibung

DV Merchant unterstützt Proxy-Anfragen an Börsen-APIs, um Währungskurse abzurufen. Dies ist nützlich, wenn:

* Der direkte Zugriff auf die Börsen-APIs blockiert ist (durch eine Firewall oder Geo-Blocking).

Wenn keine direkte Verbindung verfügbar ist, schaltet die Anwendung automatisch auf einen Proxy um. Wenn keine direkte Verbindung verfügbar ist, verwendet die Anwendung automatisch die konfigurierten Proxys.

Wenn ein direkter Zugriff auf die Börsen verfügbar ist, werden Proxys **nicht verwendet**, auch wenn sie in der Konfiguration angegeben sind.

> **Hinweis:** Konfigurationsbeispiele finden Sie in der Datei `/home/dv/merchant/configs/config.template.yaml` oder im [GitHub-Repository](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml).

## Schnellstart

### 1. Öffnen Sie die Konfigurationsdatei

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. Fügen Sie den Parameter `proxies` mit Ihren Proxy-Servern hinzu

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. Starten Sie den Dienst neu

```bash
sudo systemctl restart dv-merchant
```

### 4. Überprüfen Sie den Status

```bash
# Überprüfen Sie den Dienststatus
sudo systemctl status dv-merchant

# Sehen Sie sich die Protokolle an
sudo journalctl -u dv-merchant -n 50
```

### 5. In der Anwendungsoberfläche
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Wie es funktioniert

### 1. Versuch einer direkten Verbindung

Die Anwendung versucht zunächst, sich direkt mit der Börsen-API zu verbinden:

```
DV Merchant → api.exchange.com
```

### 2. Verwendung eines Proxys bei Fehlschlag

Wenn die direkte Verbindung fehlschlägt, versucht die Anwendung automatisch einen Proxy aus der Liste:

```
DV Merchant → Proxy 1 → api.exchange.com ✅
```

### 3. Rotation bei Fehlern

Wenn der erste Proxy nicht verfügbar ist, wird automatisch der nächste verwendet:

```
DV Merchant → Proxy 1 ❌ (Fehler)
            ↓
            → Proxy 2 → api.exchange.com ✅
```

## Überprüfung des Betriebs

### Anzeigen von Protokollen

```bash
# Alle Protokolle des Exchange Rate-Dienstes
sudo journalctl -u dv-merchant -f | grep EXRATE

# Nur Proxy-Informationen
sudo journalctl -u dv-merchant -f | grep proxy

# Nur Fehler
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## FAQ

**F: Kann ich öffentliche kostenlose Proxys verwenden?**

A: Nicht empfohlen. Kostenlose Proxys sind unzuverlässig, langsam und können ein Sicherheitsrisiko darstellen.

**F: Woher weiß ich, welcher Proxy gerade verwendet wird?**

A: Überprüfen Sie die Protokolle: `sudo journalctl -u dv-merchant -f | grep proxy`

**F: Muss ich Proxys konfigurieren, wenn ich keine Blockaden habe?**

A: Nein, Proxys sind optional. Die Anwendung funktioniert auch ohne sie, wenn ein direkter Zugriff auf die Börsen besteht.

**F: Können Proxys auch für andere Anfragen als nur an Börsen verwendet werden?**

A: Nein, die aktuelle Implementierung verwendet Proxys nur für Exchange Rate-Anfragen an Börsen.

**F: Beeinträchtigt die Verwendung eines Proxys die Leistung?**

A: Ja, geringfügig. Anfragen über einen Proxy sind in der Regel langsamer als direkte.

**F: Was ist, wenn alle Proxys ausfallen?**

A: Die Anwendung wird weiterhin mit zwischengespeicherten Daten arbeiten. Die Cache-TTL beträgt ca. 10 Minuten.

## Unterstützung

Wenn Sie auf Probleme stoßen:

1. Überprüfen Sie die Protokolle: `sudo journalctl -u dv-merchant -n 100`
2. Lesen Sie den FAQ-Abschnitt oben
3. Kontaktieren Sie den technischen Support: <https://dv.net/#support>
4. Erstellen Sie ein Problem auf GitHub: <https://github.com/dv-net/dv-merchant/issues>