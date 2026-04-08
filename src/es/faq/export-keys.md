# Exportar claves privadas

La clave privada permite acceder directamente a los fondos de una dirección. DV.net permite exportarla para una dirección o para varias.

> ⚠️ **La clave privada es acceso completo al monedero.** No la comparta ni la envíe por correo o chat. Elimine el archivo al terminar.

## Exportar una dirección

1. Vaya a **Transfers → Hot Wallets**
2. Si hace falta, desactive **Hide addresses with low balance**
3. Busque la dirección
4. Marque la casilla a la izquierda de la dirección
5. Pulse **Download keys** arriba a la derecha de la tabla
6. Elija **JSON** o **CSV**
7. Complete la autenticación de dos factores
8. Guarde el archivo de forma segura

<a href="../../assets/images/onboarding/export-keys/keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exportar una clave</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exportar una clave\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Exportación masiva

1. **Transfers → Hot Wallets**
2. Si hace falta, desactive **Hide addresses with low balance**
3. Marque las direcciones
   - **Select all on page** — todas en la página
   - **Select all (N)** — todas en todas las páginas
4. **Download keys** en la parte superior
5. **JSON** o **CSV**
6. Autenticación de dos factores
7. Guarde el archivo

<a href="../../assets/images/onboarding/export-keys/mass-keys.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exportación masiva</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exportación masiva\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/onboarding/export-keys/mass-keys.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Formatos

### JSON
Para scripts. Contiene redes; cada red tiene elementos con clave pública, clave privada y dirección:
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
Para Excel u hojas de cálculo. Cada fila: red, clave pública, clave privada, dirección:
```
blockchain,public_key,private_key,address
BLOCKCHAIN_ETHEREUM,04...e68,0x...fb5,0x...2b26
```

## Después de exportar

- Guarde en almacenamiento cifrado u offline
- Borre el archivo del equipo habitual cuando termine
- Si importó en otro monedero, elimine la importación al acabar
- Si sospecha filtración, deje de usar esa dirección para cobros
