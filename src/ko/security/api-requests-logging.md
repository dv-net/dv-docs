# API dv.net에 대한 요청 모니터링

## 개요

애플리케이션은 다음과 같은 추가 기능을 구현하기 위해 `api.dv.net` 서버와 상호작용합니다:

- 📧 자체 SMTP 서버를 설정할 필요 없이 이메일 알림 전송
- 📱 실시간 알림을 위한 Telegram 알림
- 📊 시스템 성능 분석을 위한 통계 및 텔레메트리 수집
- 🔄 소프트웨어 버전 제어

## 보안 및 개인정보 보호

중요: 귀하의 데이터 보안을 전적으로 보장합니다. 당사 API와 상호작용할 때 다음 정보는 절대 전송되지 않습니다:

- 시드 문구
- 개인 키
- 비밀번호 및 비밀 데이터
- 지갑 또는 계정에 대한 통제권 상실로 이어질 수 있는 기타 모든 정보

프로젝트의 소스 코드를 검토하여 보안 구현을 직접 확인할 수 있습니다:  
[https://github.com/dv-net](https://github.com/dv-net)

## 고급 로깅 활성화

### 구성 설정

구성 파일의 `admin` 섹션에 `log_status: true` 매개변수를 추가하십시오:

```yaml
# /home/dv/merchant/configs/config.yaml

admin:
  log_status: true
  # other admin section parameters...
```

### 서비스 재시작

구성을 수정한 후 변경 사항을 적용하려면 서비스를 재시작하십시오:

```bash
sudo systemctl restart dv-merchant
```

## 로그 보기

### 방법 1: 명령줄(journalctl)

시스템 저널을 사용하여 API 요청 로그를 확인합니다:

```bash
# View all API-related entries
journalctl -u dv-merchant | grep 'DV-API'

# Real-time monitoring
journalctl -u dv-merchant -f | grep 'DV-API'

# View entries from the last hour with timestamps
journalctl -u dv-merchant --since "1 hour ago" | grep 'DV-API'
```

### 방법 2: 웹 애플리케이션 인터페이스

또한 최근 1000개의 로그 항목을 웹 애플리케이션 인터페이스에서 직접 조회하고 필터링할 수 있습니다:

![api-requests-logging.png](../../assets/images/security/api-requests-logging.png)

## 고급 로그 수집 설정

### Promtail + Loki + Grafana 통합

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

### Logstash 구성

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

### Grafana Alloy 구성

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