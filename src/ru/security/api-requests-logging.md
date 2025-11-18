# Мониторинг запросов к API dv.net

## Обзор

Приложение взаимодействует с сервером `api.dv.net` для реализации дополнительных функций, включая:

- 📈 **Курсы валют**  различных бирж
- 🫰 **Статусы депозитов** токенов на биржах и обменные пары
- 📧 **Отправка email-уведомлений** без необходимости настройки собственного SMTP-сервера
- 📱 **Telegram-уведомления** для оперативного оповещения
- 📊 **Сбор статистики и телеметрии** для анализа работы системы
- 🔄 **Контроль версий** программного обеспечения

## Безопасность и конфиденциальность

**Важно**: Мы гарантируем полную безопасность ваших данных. При взаимодействии с нашим API **не передаются**:

- Сид-фразы (seed phrases)
- Приватные ключи
- Пароли и секретные данные
- Любая другая информация, которая может привести к потере контроля над кошельками или аккаунтом

Вы можете самостоятельно убедиться в безопасности реализации, изучив исходный код проекта: [https://github.com/dv-net](https://github.com/dv-net)

## Включение расширенного логирования

### Настройка конфигурации

Добавьте параметр `log_status: true` в секцию `admin` конфигурационного файла:

```yaml
# /home/dv/merchant/configs/config.yaml

admin:
  log_status: true
  # другие параметры административного раздела...
```

### Перезагрузка службы

После изменения конфигурации перезапустите службу для применения изменений:

```bash
sudo systemctl restart dv-merchant
```

## Просмотр логов

### Способ 1: Командная строка (journalctl)

Используйте системный журнал для просмотра логов API-запросов:

```bash
# Просмотр всех записей, связанных с API
journalctl -u dv-merchant | grep 'DV-API'

# Просмотр в реальном времени
journalctl -u dv-merchant -f | grep 'DV-API'

# Просмотр за последний час с временными метками
journalctl -u dv-merchant --since "1 hour ago" | grep 'DV-API'
```

### Способ 2: Веб-интерфейс приложения

Кроме этого последние 1000 записей логов можно посмотреть и отфильтровать непосредственно в web интерфейсе приложения:

<a href="../../assets/images/security/api-requests-logging.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Мониторинг запросов к API</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Мониторинг запросов к API\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/api-requests-logging.png" alt="Мониторинг запросов к API" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

## Расширенная настройка сбора логов

### Интеграция с Promtail + Loki + Grafana

```yaml
# /etc/promtail/config.yaml

scrape_configs:
  - job_name: dv-merchant
    static_configs:
      - targets:
          - localhost
        labels:
          job: dv-merchant
          __path__: /var/log/dv-merchant/*.log
```

### Конфигурация Logstash

```ruby
input {
  file {
    path => "/var/log/dv-merchant/api.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
}

filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:loglevel}.*DV-API.*" }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "dv-api-logs-%{+YYYY.MM.dd}"
  }
}
```

### Настройка Grafana Alloy

```yaml
logs:
  positions_directory: /var/lib/grafana-agent-positions

  configs:
    - name: dv-merchant-logs
      scrape_configs:
        - job_name: dv-merchant-api
          static_configs:
            - targets: [localhost]
              labels:
                job: dv-merchant
                __path__: /var/log/dv-merchant/*.log
```
