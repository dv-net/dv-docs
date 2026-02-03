# Solicitudes de proxy a bolsas (alternativa)

## Descripción

DV Merchant admite solicitudes de proxy a las API de las bolsas para obtener las tasas de cambio. Esto es útil cuando:

* El acceso directo a las API de las bolsas está bloqueado (por un cortafuegos o geobloqueo).

Si no hay una conexión directa disponible, la aplicación cambia automáticamente a un proxy. Si no hay una conexión directa disponible, la aplicación utiliza automáticamente los proxies configurados.

Si el acceso directo a las bolsas está disponible, **no se utilizan** los proxies, incluso si se especifican en la configuración.

> **Nota:** Puede encontrar ejemplos de configuración en el archivo `/home/dv/merchant/configs/config.template.yaml` o en el [repositorio de GitHub](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml).

## Inicio rápido

### 1. Abra el archivo de configuración

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. Agregue el parámetro `proxies` con sus servidores proxy

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. Reinicie el servicio

```bash
sudo systemctl restart dv-merchant
```

### 4. Compruebe el estado

```bash
# Compruebe el estado del servicio
sudo systemctl status dv-merchant

# Vea los registros
sudo journalctl -u dv-merchant -n 50
```

### 5. En la interfaz de la aplicación
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Cómo funciona

### 1. Intento de conexión directa

La aplicación primero intenta conectarse directamente a la API de la bolsa:

```
DV Merchant → api.exchange.com
```

### 2. Uso de un proxy en caso de fallo

Si la conexión directa falla, la aplicación prueba automáticamente un proxy de la lista:

```
DV Merchant → Proxy 1 → api.exchange.com ✅
```

### 3. Rotación en caso de errores

Si el primer proxy no está disponible, se utiliza automáticamente el siguiente:

```
DV Merchant → Proxy 1 ❌ (error)
            ↓
            → Proxy 2 → api.exchange.com ✅
```

## Verificación del funcionamiento

### Visualización de registros

```bash
# Todos los registros del servicio Exchange Rate
sudo journalctl -u dv-merchant -f | grep EXRATE

# Solo información del proxy
sudo journalctl -u dv-merchant -f | grep proxy

# Solo errores
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## Preguntas frecuentes

**P: ¿Puedo usar proxies públicos gratuitos?**

R: No se recomienda. Los proxies gratuitos no son fiables, son lentos y pueden suponer un riesgo para la seguridad.

**P: ¿Cómo sé qué proxy se está utilizando actualmente?**

R: Compruebe los registros: `sudo journalctl -u dv-merchant -f | grep proxy`

**P: ¿Necesito configurar proxies si no tengo ningún bloqueo?**

R: No, los proxies son opcionales. La aplicación funciona sin ellos si hay acceso directo a las bolsas.

**P: ¿Se pueden utilizar los proxies para otras solicitudes que no sean a las bolsas?**

R: No, la implementación actual solo utiliza proxies para las solicitudes de Exchange Rate a las bolsas.

**P: ¿El uso de un proxy afecta al rendimiento?**

R: Sí, ligeramente. Las solicitudes a través de un proxy suelen ser más lentas que las directas.

**P: ¿Qué pasa si todos los proxies fallan?**

R: La aplicación seguirá funcionando con los datos almacenados en caché. El TTL de la caché es de ~10 minutos.

## Soporte

Si tiene algún problema:

1. Compruebe los registros: `sudo journalctl -u dv-merchant -n 100`
2. Revise la sección de preguntas frecuentes anterior
3. Póngase en contacto con el soporte técnico: <https://dv.net/#support>
4. Cree un problema en GitHub: <https://github.com/dv-net/dv-merchant/issues>