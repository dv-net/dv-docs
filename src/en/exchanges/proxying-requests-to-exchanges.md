# Proxying Requests to Exchanges (Fallback)

## Description

DV Merchant supports proxying requests to exchange APIs to get currency rates. This is useful when:

* Direct access to exchange APIs is blocked (by a firewall or geo-blocking).

If a direct connection is unavailable, the application automatically switches to a proxy. If a direct connection is unavailable, the application automatically uses the configured proxies.

If direct access to exchanges is available, proxies are **not used**, even if they are specified in the configuration.

> **Note:** Configuration examples can be found in the file `/home/dv/merchant/configs/config.template.yaml` or in the [GitHub repository](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml).

## Quick Start

### 1. Open the configuration file

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. Add the `proxies` parameter with your proxy servers

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. Restart the service

```bash
sudo systemctl restart dv-merchant
```

### 4. Check the status

```bash
# Check the service status
sudo systemctl status dv-merchant

# View the logs
sudo journalctl -u dv-merchant -n 50
```

### 5. In the application interface
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## How It Works

### 1. Attempting a direct connection

The application first tries to connect to the exchange API directly:

```
DV Merchant → api.exchange.com
```

### 2. Using a proxy on failure

If the direct connection fails, the application automatically tries a proxy from the list:

```
DV Merchant → Proxy 1 → api.exchange.com ✅
```

### 3. Rotation on errors

If the first proxy is unavailable, the next one is used automatically:

```
DV Merchant → Proxy 1 ❌ (error)
            ↓
            → Proxy 2 → api.exchange.com ✅
```

## Verifying Operation

### Viewing logs

```bash
# All Exchange Rate service logs
sudo journalctl -u dv-merchant -f | grep EXRATE

# Only proxy information
sudo journalctl -u dv-merchant -f | grep proxy

# Only errors
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## FAQ

**Q: Can I use public free proxies?**

A: Not recommended. Free proxies are unreliable, slow, and can pose a security risk.

**Q: How do I know which proxy is currently in use?**

A: Check the logs: `sudo journalctl -u dv-merchant -f | grep proxy`

**Q: Do I need to configure proxies if I don't have any blockages?**

A: No, proxies are optional. The application works without them if there is direct access to the exchanges.

**Q: Can proxies be used for other requests, not just to exchanges?**

A: No, the current implementation only uses proxies for Exchange Rate requests to exchanges.

**Q: Does using a proxy affect performance?**

A: Yes, slightly. Requests through a proxy are usually slower than direct ones.

**Q: What if all proxies fail?**

A: The application will continue to work with cached data. The cache TTL is ~10 minutes.

## Support

If you encounter any problems:

1. Check the logs: `sudo journalctl -u dv-merchant -n 100`
2. Review the FAQ section above
3. Contact technical support: <https://dv.net/#support>
4. Create an issue on GitHub: <https://github.com/dv-net/dv-merchant/issues>