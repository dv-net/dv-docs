# 监控对 API dv.net 的请求

## 概览

应用程序与 `api.dv.net` 服务器交互以实现附加功能，包括：

- 📧 无需自行搭建 SMTP 服务器的**电子邮件通知**
- 📱 实时提醒的 **Telegram 通知**
- 📊 **收集统计数据与遥测信息**，用于系统性能分析
- 🔄 **软件版本控制**

## 安全与隐私

重要：我们保证您的数据完全安全。在与我们的 API 交互时，以下信息**绝不会被传输**：

- 助记词
- 私钥
- 密码和机密数据
- 任何可能导致对钱包或账户失去控制的其他信息

您可以通过审查项目的源代码独立验证安全实现：  
[https://github.com/dv-net](https://github.com/dv-net)

## 启用高级日志记录

### 配置设置

在配置文件的 `admin` 部分添加参数 `log_status: true`：

```yaml
# /home/dv/merchant/configs/config.yaml

admin:
  log_status: true
  # other admin section parameters...
```

### 重启服务

修改配置后，重启服务以应用更改：

```bash
sudo systemctl restart dv-merchant
```

## 查看日志

### 方法一：命令行（journalctl）

使用系统日志查看 API 请求日志：

```bash
# View all API-related entries
journalctl -u dv-merchant | grep 'DV-API'

# Real-time monitoring
journalctl -u dv-merchant -f | grep 'DV-API'

# View entries from the last hour with timestamps
journalctl -u dv-merchant --since "1 hour ago" | grep 'DV-API'
```

### 方法二：Web 应用界面

此外，可在 Web 应用界面直接查看并筛选最近的 1000 条日志记录：

![api-requests-logging.png](../../assets/images/security/api-requests-logging.png)

## 高级日志采集设置

### 与 Promtail + Loki + Grafana 的集成

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

### Logstash 配置

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

### Grafana Alloy 配置

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