# 代理对交易所的请求（备用）

## 描述

DV Merchant 支持代理对交易所 API 的请求以获取货币汇率。这在以下情况下很有用：

* 对交易所 API 的直接访问被阻止（通过防火墙或地理封锁）。

如果直接连接不可用，应用程序会自动切换到代理。如果直接连接不可用，应用程序会自动使用配置的代理。

如果可以直接访问交易所，则**不使用**代理，即使在配置中指定了代理。

> **注意：** 可以在文件 `/home/dv/merchant/configs/config.template.yaml` 或 [GitHub 存储库](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml)中找到配置示例。

---

## 快速入门

### 1. 打开配置文件

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. 使用您的代理服务器添加 `proxies` 参数

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. 重新启动服务

```bash
sudo systemctl restart dv-merchant
```

### 4. 检查状态

```bash
# 检查服务状态
sudo systemctl status dv-merchant

# 查看日志
sudo journalctl -u dv-merchant -n 50
```

### 5. 在应用程序界面中
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---

## 工作原理

### 1. 尝试直接连接

应用程序首先尝试直接连接到交易所 API：

```
DV Merchant → api.exchange.com
```

### 2. 失败时使用代理

如果直接连接失败，应用程序会自动尝试列表中的代理：

```
DV Merchant → 代理 1 → api.exchange.com ✅
```

### 3. 错误时轮换

如果第一个代理不可用，则自动使用下一个代理：

```
DV Merchant → 代理 1 ❌ (错误)
            ↓
            → 代理 2 → api.exchange.com ✅
```

---

## 验证操作

### 查看日志

```bash
# 所有汇率服务日志
sudo journalctl -u dv-merchant -f | grep EXRATE

# 仅代理信息
sudo journalctl -u dv-merchant -f | grep proxy

# 仅错误
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## 常问问题

**问：我可以使用公共免费代理吗？**

答：不建议。免费代理不可靠、速度慢，并且可能构成安全风险。

**问：我如何知道当前正在使用哪个代理？**

答：检查日志：`sudo journalctl -u dv-merchant -f | grep proxy`

**问：如果没有阻塞，我需要配置代理吗？**

答：不，代理是可选的。如果可以直接访问交易所，应用程序可以在没有代理的情况下工作。

**问：代理可以用于其他请求，而不仅仅是交易所吗？**

答：不，当前的实现仅将代理用于对交易所的汇率请求。

**问：使用代理会影响性能吗？**

答：是的，略有影响。通过代理的请求通常比直接请求慢。

**问：如果所有代理都失败了怎么办？**

答：应用程序将继续使用缓存数据工作。缓存 TTL 约为 10 分钟。

---

## 支持

如果您遇到任何问题：

1. 检查日志：`sudo journalctl -u dv-merchant -n 100`
2. 查看上面的常见问题解答部分
3. 联系技术支持：<https://dv.net/#support>
4. 在 GitHub 上创建问题：<https://github.com/dv-net/dv-merchant/issues>