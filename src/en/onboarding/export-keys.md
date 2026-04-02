# Exporting private keys

A private key provides direct access to funds on a specific address. DV.net lets you export keys for a single address or for several at once.

> ⚠️ **A private key is full wallet access.** Never share it, never send it by email or chat. Delete the file from your device when you are done.

## Exporting a single address key

1. Go to **Transfers → Hot Wallets**
2. If needed, disable **Hide addresses with low balance**
3. Find the address using the search field
4. Select the checkbox next to the address (left)
5. Click **Download keys** in the upper-right of the table
6. Choose **JSON** or **CSV**
7. Complete two-factor authentication
8. Save the file somewhere secure

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Single key export</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Single key export\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Bulk key export

1. Go to **Transfers → Hot Wallets**
2. If needed, disable **Hide addresses with low balance**
3. Select the addresses with the checkboxes on each row
   - **Select all on page** — all addresses on the current page
   - **Select all (N)** — all addresses across pages
4. Click **Download keys** at the top of the list
5. Choose **JSON** or **CSV**
6. Complete two-factor authentication
7. Save the file somewhere secure

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Bulk key export</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Bulk key export\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## File formats

### JSON
Suited for scripts and tools. The file lists networks; each network has an array of items with public key, private key, and address:
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
Easy to open in Excel or Google Sheets. Each row is one address — network, public key, private key, address:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## After export

- Store the file on encrypted storage or an offline device
- Delete the file from everyday machines when finished
- If you imported the key into another wallet, remove that import when done
- If you suspect the key leaked, stop using that address for incoming payments
