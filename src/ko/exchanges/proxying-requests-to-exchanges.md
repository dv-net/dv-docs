# 거래소로 요청 프록시 (대체)

## 설명

DV Merchant는 환율을 가져오기 위해 거래소 API로 요청을 프록시하는 것을 지원합니다. 이는 다음과 같은 경우에 유용합니다.

* 거래소 API에 대한 직접 액세스가 차단된 경우 (방화벽 또는 지역 차단으로 인해).

직접 연결을 사용할 수 없는 경우 응용 프로그램은 자동으로 프록시로 전환됩니다. 직접 연결을 사용할 수 없는 경우 응용 프로그램은 구성된 프록시를 자동으로 사용합니다.

거래소에 직접 액세스할 수 있는 경우 구성에 지정되어 있더라도 프록시는 **사용되지 않습니다**.

> **참고:** 구성 예는 `/home/dv/merchant/configs/config.template.yaml` 파일 또는 [GitHub 저장소](https://github.com/dv-net/dv-merchant/blob/main/configs/config.template.yaml)에서 찾을 수 있습니다.

---

## 빠른 시작

### 1. 구성 파일 열기

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

### 2. 프록시 서버와 함께 `proxies` 매개 변수 추가

```yaml
exrate:
  fetch_interval: 1m0s
  timeout: 10s
  proxies:
    - http://username:password@proxy1.example.com:8080
    - http://username:password@proxy2.example.com:8080
    - socks5://username:password@proxy3.example.com:1080
```

### 3. 서비스 다시 시작

```bash
sudo systemctl restart dv-merchant
```

### 4. 상태 확인

```bash
# 서비스 상태 확인
sudo systemctl status dv-merchant

# 로그 보기
sudo journalctl -u dv-merchant -n 50
```

### 5. 응용 프로그램 인터페이스에서
<a href="../../assets/images/exchanges/exrate/exrate-logs.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Exrate Logs</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Exrate Logs\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/exchanges/exrate/exrate-logs.png" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---

## 작동 방식

### 1. 직접 연결 시도

응용 프로그램은 먼저 거래소 API에 직접 연결을 시도합니다.

```
DV Merchant → api.exchange.com
```

### 2. 실패 시 프록시 사용

직접 연결이 실패하면 응용 프로그램은 목록에서 프록시를 자동으로 시도합니다.

```
DV Merchant → 프록시 1 → api.exchange.com ✅
```

### 3. 오류 시 순환

첫 번째 프록시를 사용할 수 없는 경우 다음 프록시가 자동으로 사용됩니다.

```
DV Merchant → 프록시 1 ❌ (오류)
            ↓
            → 프록시 2 → api.exchange.com ✅
```

---

## 작동 확인

### 로그 보기

```bash
# 모든 환율 서비스 로그
sudo journalctl -u dv-merchant -f | grep EXRATE

# 프록시 정보만
sudo journalctl -u dv-merchant -f | grep proxy

# 오류만
sudo journalctl -u dv-merchant -f | grep '"level":"error"'
```

## 자주 묻는 질문

**Q: 공용 무료 프록시를 사용할 수 있습니까?**

A: 권장하지 않습니다. 무료 프록시는 신뢰할 수 없고 느리며 보안 위험을 초래할 수 있습니다.

**Q: 현재 어떤 프록시가 사용 중인지 어떻게 알 수 있습니까?**

A: 로그를 확인하십시오: `sudo journalctl -u dv-merchant -f | grep proxy`

**Q: 차단이 없는 경우 프록시를 구성해야 합니까?**

A: 아니요, 프록시는 선택 사항입니다. 거래소에 직접 액세스할 수 있는 경우 응용 프로그램은 프록시 없이 작동합니다.

**Q: 프록시를 거래소뿐만 아니라 다른 요청에도 사용할 수 있습니까?**

A: 아니요, 현재 구현은 거래소에 대한 환율 요청에만 프록시를 사용합니다.

**Q: 프록시를 사용하면 성능에 영향을 줍니까?**

A: 예, 약간입니다. 프록시를 통한 요청은 일반적으로 직접 요청보다 느립니다.

**Q: 모든 프록시가 실패하면 어떻게 됩니까?**

A: 응용 프로그램은 캐시된 데이터로 계속 작동합니다. 캐시 TTL은 약 10분입니다.

---

## 지원

문제가 발생하면 다음을 수행하십시오.

1. 로그 확인: `sudo journalctl -u dv-merchant -n 100`
2. 위의 FAQ 섹션 검토
3. 기술 지원에 문의: <https://dv.net/#support>
4. GitHub에서 문제 만들기: <https://github.com/dv-net/dv-merchant/issues>