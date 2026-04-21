# Privatschlüssel exportieren

Ein Private Key gewährt direkten Zugriff auf die Mittel einer bestimmten Adresse. DV.net erlaubt den Export für eine einzelne Adresse oder mehrere gleichzeitig.

> ⚠️ **Der Private Key ist voller Wallet-Zugriff.** Niemals weitergeben, nicht per E-Mail oder Messenger senden. Datei nach Gebrauch vom Gerät löschen.

## Export für eine Adresse

1. **Transfers → Hot Wallets** öffnen
2. Bei Bedarf **Hide addresses with low balance** deaktivieren
3. Adresse per Suche finden
4. Kontrollkästchen links neben der Adresse setzen
5. **Download keys** oben rechts in der Tabelle klicken
6. Format **JSON** oder **CSV** wählen
7. Zwei-Faktor-Authentifizierung abschließen
8. Datei sicher speichern

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Export eines Schlüssels</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Export eines Schlüssels\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Massenexport

1. **Transfers → Hot Wallets** öffnen
2. Bei Bedarf **Hide addresses with low balance** deaktivieren
3. Gewünschte Adressen mit Kontrollkästchen markieren
   - **Select all on page** — alle auf der Seite
   - **Select all (N)** — alle über alle Seiten
4. **Download keys** oben in der Liste klicken
5. **JSON** oder **CSV** wählen
6. Zwei-Faktor-Authentifizierung abschließen
7. Datei sicher speichern

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Massenexport</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Massenexport\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Dateiformate

### JSON
Gut für Skripte. Die Datei enthält Netzwerke; jedes Netzwerk hat Einträge mit Public Key, Private Key und Adresse:
```json
{
  "entries": [
    {
      "name": "BLOCKCHAIN_ETHEREUM",
      "items": [
        {
          "public_key": "04...e68",
          "private_key": "0x...fb5",
          "address": "0x...2b26"
        }
      ]
    }
  ]
}
```

### CSV
Gut für Excel oder Google Sheets. Jede Zeile: Netzwerk, Public Key, Private Key, Adresse:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## Nach dem Export

- Auf verschlüsseltem Speicher oder offline ablegen
- Datei vom Arbeitsrechner löschen, wenn fertig
- Wallet-Import danach wieder entfernen
- Bei Kompromittierung diese Adresse nicht mehr für Zahlungseingänge nutzen
