# Проксирование запросов к биржам (fallback)

## Описание

DV Merchant поддерживает проксирование запросов к API бирж для получения курсов валют. Это полезно когда:

* Прямой доступ к API бирж заблокирован (файрволлом, геоблокировкой)

При недоступности прямого подключения приложение автоматически переключается на прокси. При недоступности прямого подключения приложение автоматически использует настроенные прокси.

Если прямой доступ к биржам доступен, прокси **не используются**, даже если они указаны в конфигурации.

> **Примечание:** Примеры конфигурации можно посмотреть в файле `/home/dv/merchant/configs/config.template.yaml` или в [GitHub репозитории](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml).

---

## Быстрый старт

### 1\. Откройте конфигурационный файл

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2\. Добавьте параметр `proxies` с вашими прокси-серверами

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3\. Перезапустите сервис

```bash
sudo systemctl restart dv-merchant
```

### 4\. Проверьте работу

```bash
# Проверьте статус сервиса
sudo systemctl status dv-merchant

# Посмотрите логи
sudo journalctl -u dv-merchant -n 50
```

### 5\. В интерфейсе приложения 
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---

## Как это работает

### 1\. Попытка прямого подключения

Приложение сначала пытается подключиться к API биржи напрямую:

```
DV Merchant → api.exchange.com
```

### 2\. При неудаче - использование прокси

Если прямое подключение не удалось, приложение автоматически пробует прокси из списка:

```
DV Merchant → Прокси 1 → api.exchange.com ✅
```

### 3\. Ротация при ошибках

Если первый прокси недоступен, автоматически используется следующий:

```
DV Merchant → Прокси 1 ❌ (ошибка)
            ↓
            → Прокси 2 → api.exchange.com ✅
```

---

## Проверка работы

### Просмотр логов

```bash
# Все логи Exchange Rate сервиса
sudo journalctl -u dv-merchant -f | grep EXRATE

# Только информация о прокси
sudo journalctl -u dv-merchant -f | grep proxy

# Только ошибки
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## FAQ

**Q: Можно ли использовать публичные бесплатные прокси?**

A: Не рекомендуется. Бесплатные прокси ненадежны, медленны и могут представлять угрозу безопасности.

**Q: Как узнать какой прокси используется в данный момент?**

A: Смотрите логи: `sudo journalctl -u dv-merchant -f | grep proxy`

**Q: Нужно ли настраивать прокси если у меня нет блокировок?**

A: Нет, прокси опциональны. Приложение работает без них если есть прямой доступ к биржам.

**Q: Можно ли использовать прокси и для других запросов, не только к биржам?**

A: Нет, текущая реализация использует прокси только для Exchange Rate запросов к биржам.

**Q: Влияет ли использование прокси на производительность?**

A: Да, незначительно. Запросы через прокси обычно медленнее прямых.

**Q: Что если все прокси упадут?**

A: Приложение продолжит работать на закешированных данных. TTL кеша составляет \~10 минут.

---

## Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `sudo journalctl -u dv-merchant -n 100`
2. Изучите раздел FAQ выше
3. Обратитесь в техподдержку: <https://dv.net/#support>
4. Создайте issue на GitHub: <https://github.com/dv-net/dv-merchant/issues>