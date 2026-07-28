# [dv.net](http://dv.net) 머천트 설치 및 구성 가이드

## 설치

제공된 스크립트를 사용하여 머천트를 설치합니다.

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

서버에 방화벽(Firewall)이 설정되어 있는 경우, 포트 **80**과 **443**을 예외 목록에 추가해야 합니다.

### 방화벽 확인 및 상태 점검

#### Ubuntu / Debian

**UFW** (가장 많이 사용됨):

```bash
# ufw 설치 여부 확인
command -v ufw && ufw --version

# 방화벽 상태
sudo ufw status verbose

# 서비스 활성 상태 확인
systemctl is-active ufw
```

**firewalld** (드물지만 사용될 수 있음):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (ufw와 firewalld를 사용하지 않는 경우):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (CentOS 기본):

```bash
# firewalld 설치 여부 확인
command -v firewall-cmd && firewall-cmd --version

# 상태
sudo systemctl status firewalld
sudo firewall-cmd --state

# 열린 포트 목록
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (수동으로 설치한 경우):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### 포트 열기 (방화벽이 활성화된 경우)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / 일부 Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## 도메인 이름 연결

> 예시: 웹사이트 — `domain.com`, 머천트 — `pay.domain.com`.

두 가지 방법:

1. **Cloudflare** — 가장 간단: 프록시를 켜면 HTTPS가 바로 적용됩니다.
2. **Nginx + Let's Encrypt** — Cloudflare를 사용하지 않는 경우.

---



### 방법 1. Cloudflare (권장)

설치 후 머천트는 이미 포트 **80**에서 수신 대기합니다. Cloudflare가 사용자에게 HTTPS를 제공합니다.

#### 1단계. 포트 80과 443 열기

[설치 → 포트 열기](#포트-열기-방화벽이-활성화된-경우) 섹션을 참조하세요.

#### 2단계. DNS 레코드 추가

Cloudflare → 도메인 → **DNS** → A 레코드 생성:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (또는 필요한 서브도메인) | `서버_IP` | **Proxied** (주황색 구름) |




#### 3단계. SSL 모드

Cloudflare → **SSL/TLS** → **Flexible** 모드.

#### 4단계. 확인

몇 분 기다린 후 다음 주소를 엽니다:

```text
https://pay.domain.com
```

머천트 페이지가 열려야 합니다. 이후 브라우저에서 설정을 계속 진행하세요.

---



### 방법 2. Nginx + Let's Encrypt

Cloudflare를 사용하지 않는 경우 — 서버에서 직접 SSL 인증서를 발급합니다.

#### 1단계. 포트 80과 443 열기

[설치 → 포트 열기](#포트-열기-방화벽이-활성화된-경우) 섹션을 참조하세요.

#### 2단계. DNS

등록업체 패널에서 A 레코드를 생성합니다:

```text
pay.domain.com    A     서버_IP
```

DNS가 이미 서버를 가리키는지 확인합니다:

```bash
dig +short pay.domain.com
```



#### 3단계. Nginx 및 Certbot 설치

**Ubuntu / Debian:**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

**CentOS:**

```bash
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```



#### 4단계. 머천트를 포트 8080으로 전환

```bash
sudo nano /home/dv/merchant/configs/config.yaml
```

```yaml
http:
  port: "8080"
```

```bash
sudo systemctl restart dv-merchant
```



#### 5단계. Nginx 설정

```bash
sudo nano /etc/nginx/conf.d/pay.domain.com.conf
```

```nginx
server {
    listen 80;
    server_name pay.domain.com;

    client_max_body_size 128M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```



#### 6단계. 인증서 발급

```bash
sudo certbot --nginx -d pay.domain.com
```



#### 7단계. 확인

다음 주소를 엽니다:

```text
https://pay.domain.com
```

이후 머천트 설정을 계속 진행합니다.

## 브라우저에서 초기 설정

설치 및 도메인 연결 후 머천트 주소를 엽니다:

```text
https://pay.domain.com/
```

시스템이 자동으로 관리 패널(`/dv-admin/`)로 리디렉션하고 설치 마법사를 표시합니다.

---



### 1단계. 시스템 확인

화면: **「Welcome to the DaVinci project」**.

다음 항목에 녹색 체크 표시가 있어야 합니다:

- **PostgreSQL**
- **Redis**

**Next**를 클릭합니다.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>시스템 확인</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'시스템 확인\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="시스템 확인" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 2단계. 시스템 관리자 생성

화면: **「Create system administrator」**.

다음 필드를 입력합니다:


| 필드                  | 요구 사항           |
| --------------------- | ------------------- |
| Email                 | 유효한 이메일       |
| Password              | 8~32자              |
| Password confirmation | 비밀번호와 일치     |


**Next**를 클릭합니다.

> root 사용자입니다. 로그인 정보와 비밀번호를 안전한 곳에 보관하세요.  
> 최초 설치 시 한 번만 생성됩니다.

등록 후 시스템이 자동으로 프로세싱을 초기화합니다(merchant ↔ processing 연결).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>시스템 관리자 생성</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'시스템 관리자 생성\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="시스템 관리자 생성" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 3단계. 시드 구문 생성 및 확인

화면: **「Generate seed phrase」** / 니모닉 생성.

1. 구문 길이 선택: **12** 또는 **24** 단어 (기본값 24).
2. 다시 생성하려면 **Generate mnemonics**를 클릭합니다.
3. 단어를 보려면 **Show**를 클릭합니다.
4. **구문을 복사하여 오프라인에 저장**하세요 (종이 / 비밀번호 관리자 / 오프라인 저장소).
5. **Confirm**을 클릭합니다.

> 시드 구문은 머천트의 모든 지갑에 대한 마스터 키입니다. 이를 보유한 사람이 자금을 통제합니다.  
> 없으면 지갑 접근을 복구할 수 없습니다.

확인 후 **Quick start**가 열립니다.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>시드 구문 생성</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'시드 구문 생성\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="시드 구문 생성" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 4단계. 빠른 시작:



#### 4.1. 프로젝트 URL

`https://domain.com` 형식으로 사이트/프로젝트 URL을 입력하고 **Save**를 클릭합니다.

#### 4.2. Webhook 및 API

1. 웹훅 URL을 입력합니다 (DV.net이 결제 알림을 보낼 주소).
2. **API key**를 복사합니다 — `x-api-key` 헤더에 포함해야 합니다.
3. 웹훅 진위 확인에 사용되는 시크릿 키를 복사합니다.



#### 4.3. 프로세싱 지갑 충전

화면에 네트워크별 프로세싱 지갑 주소가 표시됩니다.

나중에 충전해야 합니다 — 고객 핫 지갑에서 이체할 때 네트워크 수수료가 이 지갑에서 지불됩니다.

**Next** / **Finish**를 클릭하거나, 나중에 설정하려면 **Skip and set up later**를 클릭합니다.

완료 후 머천트 대시보드가 열립니다.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>빠른 시작</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'빠른 시작\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="빠른 시작" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## 프로젝트 설정 — 단계별 안내:

테스트 도메인에서 이미 설치된 머천트를 설정합니다:

```text
https://pay.domain.com/
```

---



### 1부. 패널 로그인

1. 브라우저(Chrome / Safari / Firefox)를 엽니다.
2. 주소창에 다음을 입력합니다:

```text
https://pay.domain.com/
```

1. Enter를 누릅니다.
2. 로그인 화면이 열리면 설치 시 생성한 관리자 **email**과 **password**를 입력합니다.
3. 로그인 버튼을 클릭합니다.

DV.net 관리 패널에 진입해야 합니다.

---



### 2부. 스토어(프로젝트) 생성

1. 왼쪽 메뉴에서 **Projects** / **프로젝트** 항목을 찾습니다.
2. 클릭합니다.
3. 오른쪽 상단에서 **Create a store** / **스토어 생성** 버튼을 클릭합니다.
4. 필드를 입력합니다:


| 필드                | 입력 내용                                  | 예시                 |
| ------------------- | ------------------------------------------ | -------------------- |
| **Name** / 이름     | 스토어 이름                                | `테스트 스토어`      |
| **Site** / 사이트   | 사이트 링크 (비워 둘 수 있음)              | `https://domain.com` |


1. **Create a project** / **프로젝트 생성**을 클릭합니다.
2. 스토어가 생성되었다는 메시지가 나올 때까지 기다립니다.
3. 프로젝트 목록으로 돌아가면 스토어가 표시됩니다.

> Quick start 단계에서 스토어를 이미 만들었다면 새로 만들 필요가 없습니다. **Edit**로 기존 스토어를 열면 됩니다.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>스토어 생성</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'스토어 생성\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="스토어 생성" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 3부. 스토어 설정 열기

1. **Projects** 목록에서 스토어를 찾습니다.
2. 해당 행 오른쪽에서 **Edit** / **편집**을 클릭합니다.
3. 상단에 두 개의 탭이 있는 스토어 페이지가 열립니다:
  - **Main** — API 키 및 웹훅
  - **Advanced settings** — 통화, 사이트, 결제 양식

먼저 **Main**을 설정한 후 **Advanced settings**를 설정합니다.

---



### 4부. API key 및 Secret key 받기

**Main** 탭에서:

#### 4.1. API key

1. **Your API key** / **API 키** 블록을 찾습니다.
2. 키가 없으면 생성 / **Generate** 버튼을 클릭합니다.
3. 키 옆 복사 아이콘을 클릭합니다.
4. 키를 저장합니다.

이 키는 요청 헤더에 포함해야 합니다:

```text
x-api-key: 귀하의_키
```



#### 4.2. Secret key (웹훅 확인용)

1. 같은 섹션에서 **Secret key**를 찾습니다.
2. 키가 없으면 **Generate new** / **생성**을 클릭합니다.
3. **Show**를 클릭하여 확인합니다.
4. API key와 함께 복사하여 저장합니다.

> Secret key는 사이트에서 「이 알림이 DV.net에서 온 것인지, 사기인지」를 확인하는 데 사용됩니다.

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key 및 Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key 및 Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key 및 Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 5부. 웹훅 설정

웹훅은 고객이 결제했을 때 DV.net이 사이트로 보내는 「알림」입니다.

1. **Main** 탭에서 **Webhooks** 블록을 찾습니다.
2. URL 필드에 핸들러 주소를 입력합니다. 예:

```text
https://domain.com/api/dv-webhook
```

> 아직 핸들러가 없으면 이 단계를 일시적으로 건너뛰고 나중에 돌아올 수 있습니다. 웹훅 없이도 결제는 동작할 수 있지만, 스토어가 입금 사실을 자동으로 알 수 없습니다.

1. 필요한 이벤트를 활성화합니다. 최소한:
  - 결제 성공 웹훅 (**WebHook on successful payment**)
2. **Create** 또는 **Save**를 클릭합니다.
3. **Test**를 클릭하여 서버가 응답하는지 확인합니다.

필요하면 다른 이벤트(미확인 결제, 프로세싱 지갑 출금)도 반복 설정합니다.

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>웹훅 설정</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'웹훅 설정\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="웹훅 설정" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 6부. 통화 및 스토어 기본 설정

1. **Advanced settings** / **고급 설정** 탭으로 이동합니다.
2. **General** 블록에서:
  - 스토어 **이름**을 확인합니다;
  - 아직 입력하지 않았다면 **Project website**(프로젝트 사이트)를 지정합니다.
3. **Accepted currencies** / **허용 통화** 블록에서:
  - 필요한 코인을 클릭합니다 (예: USDT Tron, BTC, ETH);
  - 모두 필요하면 **Select all**을 클릭합니다.
4. **Payment form settings** 블록에서:
  - **Minimal payment** — 최소 금액 (`$0.1` 이상);
  - 원하면 **success_url**과 **return_url**을 지정합니다 (결제 후 고객을 돌려보낼 주소).
5. 하단에서 **Save** / **저장**을 클릭합니다.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>스토어 고급 설정</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'스토어 고급 설정\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="스토어 고급 설정" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 7부. 결제 링크 (완성된 양식)

**Advanced settings**에 다음 형식의 링크 템플릿이 있습니다:

```text
https://pay.domain.com/pay/store/스토어_ID/<귀하의_client_ID>
```

여기서:

- `스토어_ID` — 시스템이 이미 채워 둡니다;
- `<귀하의_client_ID>` — 시스템의 고객 ID로 바꿉니다 (예: `user_15`).

예시:

```text
https://pay.domain.com/pay/store/귀하의_STORE_UUID/user_15
```

브라우저에서 이 링크를 열면 DV.net 결제 양식이 표시됩니다.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>결제 링크</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'결제 링크\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="결제 링크" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 8부. 패널에서 테스트 결제 생성:

1. **Projects**로 돌아갑니다.
2. 스토어 행에서 **Create payment** / **결제 생성**을 클릭합니다.
3. 창에서 다음을 입력합니다:
  - **Amount** — 달러 금액, 예: `5`;
  - **Email** — 비워 둘 수 있음;
  - **External ID** — 고객 ID (또는 자동 생성 유지);
  - **Currency** — 결제 통화 (요청 시).
4. **Create payment**를 클릭합니다.
5. 표시된 **결제 링크**를 복사합니다.
6. 새 탭에서 열면 결제 페이지가 표시되어야 합니다.

이렇게 스토어가 정상 동작하는지 확인합니다.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>테스트 결제 생성</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'테스트 결제 생성\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="테스트 결제 생성" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 9부. API로 스토어 연결

키가 준비되면:

**API 주소:**

```text
https://pay.domain.com
```

**청구서 / 결제 지갑 생성:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: 귀하의_API_KEY' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

응답에 `**pay_url**` 필드가 포함됩니다 — 고객에게 전달합니다.

---



### 10부. 프로세싱 지갑 충전

1. 왼쪽 메뉴에서 **Dashboard** / **대시보드**를 엽니다.
2. 프로세싱 지갑 블록을 찾습니다 (네트워크별: Tron, Ethereum 등).
3. 필요한 네트워크의 주소를 복사합니다.
4. 같은 네트워크의 암호화폐를 소량 전송합니다 (수수료용).

이를 하지 않으면 결제 수신은 동작할 수 있지만, 핫 지갑에서의 이체/출금은 가스/수수료 부족으로 실패할 수 있습니다.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>프로세싱 지갑</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'프로세싱 지갑\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="프로세싱 지갑" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 11부. 「모든 준비 완료」 체크리스트

다음 항목을 확인하세요:

- [ ] `https://pay.domain.com/`에 로그인함
- [ ] 스토어(프로젝트) 생성함
- [ ] **API key** 복사함
- [ ] **Secret key** 복사함
- [ ] 관리자 시드 구문 저장함 (설치 단계에서)
- [ ] 필요한 통화 활성화함
- [ ] 웹훅 설정함 (또는 의도적으로 연기함)
- [ ] 테스트 결제를 생성하고 `pay_url`을 열어봄
- [ ] 필요 시 프로세싱 지갑 충전함

모든 항목을 완료했다면 스토어가 테스트 연동 준비가 된 것입니다.

---



### 자주 발생하는 문제 (쉬운 설명)


| 문제                     | 조치                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| 사이트가 열리지 않음     | `pay.domain.com`이 서버를 가리키는지, 포트 80/443이 열려 있는지 확인     |
| 스토어 생성 버튼 없음    | 관리자로 로그인하지 않음 — 로그아웃 후 다시 로그인                       |
| API key 없음             | 프로젝트 → **Edit** → **Main** → Generate                                |
| 결제 링크가 열리지 않음  | 링크 전체를 복사했는지 확인; 스토어 통화가 활성화되어 있는지 확인        |
| 웹훅이 오지 않음         | URL이 인터넷에서 접근 가능해야 함 (localhost 불가); 패널에서 Test 확인   |
| 관리자 비밀번호 분실     | 서버 CLI로 복구: `dv-merchant users` (SSH 접근 필요)                     |


---



## 연동 예시

시나리오:

1. 고객 `user_123`에 대해 **10 USD** 결제 생성
2. `pay_url` 링크를 받아 고객에게 전달
3. 웹훅 수신, 서명 확인, `{"success": true}` 응답

시작 전에 자신의 값으로 바꿉니다:


| 항목           | 확인 위치              | 예시                     |
| -------------- | ---------------------- | ------------------------ |
| 머천트 주소    | 결제 도메인            | `https://pay.domain.com` |
| API key        | Projects → Edit → Main | `귀하의_API_KEY`            |
| Secret key     | 동일 위치              | `귀하의_SECRET_KEY`         |
| 스토어 ID      | Advanced settings      | `귀하의_STORE_UUID`         |
| 사이트         | 스토어 사이트          | `https://domain.com`     |




### 먼저 패널에서 웹훅 설정 (한 번)

1. `https://pay.domain.com` 열기
2. 이동: **Projects → 스토어 → Edit → Main**
3. **Webhooks** 블록 찾기
4. URL 입력: `https://domain.com/dv/webhook`
5. 확인된 결제 활성화
6. **Save** 클릭

---



### 결제 흐름

```text
1. 고객이 「결제」 클릭
2. 사이트가 DV.net에서 결제를 생성하고 고객에게 링크 전달
3. 고객이 pay_url을 열고 결제
4. DV.net이 결제 상태를 알리는 웹훅을 사이트로 전송
5. 서명을 확인하고 주문을 반영
6. {"success": true} 응답
```

---



### 1) cURL



#### 1단계. 결제 생성

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: 귀하의_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### 2단계. 응답에서 `pay_url` 가져오기

이 링크를 고객에게 보냅니다.

#### 추가:

통화 목록 조회:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: 귀하의_API_KEY'
```

현재 환율 조회:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: 귀하의_API_KEY'
```

---



### 2) Python



#### 1단계. 라이브러리 설치

```bash
pip install dv-net-client
```



#### 2단계. 결제 생성

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="귀하의_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # 고객에게 전송
```



#### 3단계. 웹훅 수신

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "귀하의_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. 서명 확인
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. 결제가 확인되면 — 주문 반영
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. 중복 반영하지 않기
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"{user_id}의 결제: {amount} USD")
            # 여기서 주문/잔액 저장

    # 4. 항상 이렇게 응답
    return jsonify({"success": True})
```

---



### 3) PHP



#### 1단계. 라이브러리 설치

```bash
composer require dv-net/dv-net-php-client
```



#### 2단계. 결제 생성

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: '귀하의_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // 고객에게 전송
```



#### 3단계. 웹훅 수신 (`/dv/webhook`)

```php
<?php
$secret = '귀하의_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. 서명 확인
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. 결제가 확인되면 — 주문 반영
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. DB에서 $uniq가 아직 처리되지 않았는지 확인
    // 사용자 $userId에게 주문 반영
}

// 4. 항상 이렇게 응답
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### 1단계. 라이브러리 설치

```bash
npm install @dv-net/js-client express
```



#### 2단계. 결제 생성

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "귀하의_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // 고객에게 전송
```



#### 3단계. 웹훅 수신

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "귀하의_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. 서명 확인
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. 결제가 확인되면 — 주문 반영
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. 중복 반영하지 않기
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`${userId}의 결제: ${amount} USD`);
      // 여기서 주문/잔액 저장
    }
  }

  // 4. 항상 이렇게 응답
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### 1단계. 플러그인 설치

1. [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce) 다운로드
2. WordPress → **Plugins → Add New → Upload**
3. **Activate**



#### 2단계. 설정 입력

1. **WooCommerce → Settings → Payments → DV.net**
2. 결제 수단 활성화
3. 다음 입력:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `귀하의_API_KEY`
  - API Secret: `귀하의_SECRET_KEY`
4. 저장



#### 3단계. [DV.net](http://DV.net)에 웹훅 설정

플러그인 설정의 callback URL을 입력합니다.

#### 4단계. 확인

테스트 주문을 생성하고 결제합니다.

---



### 6) OpenCart



#### 1단계. 모듈 설치

1. [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`) 다운로드
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### 2단계. 설정 입력

1. DV.net Gateway의 Edit 열기
2. 다음 입력:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `귀하의_API_KEY`
  - API Secret: `귀하의_SECRET_KEY`
3. Status: Enabled
4. 저장



#### 3단계. [DV.net](http://DV.net)에 웹훅 설정

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### 4단계. 확인

테스트 주문을 생성합니다.

---



### 웹훅 요약

1. 항상 다음으로 응답:

```json
{"success": true}
```

1. 서명:

```text
SHA256(요청_본문 + Secret_key) = X-Sign 헤더
```

1. 중복 반영을 방지하려면 다음을 기록:

```text
tx_hash + bc_uniq_key
```

1. 이벤트 유형:


| 유형                               | 조치           |
| ---------------------------------- | -------------- |
| `PaymentReceived`                  | 결제 반영      |
| `PaymentNotConfirmed`              | 대기           |
| `WithdrawalFromProcessingReceived` | 출금 완료      |


---



### 데모 예시:


| 항목              | 링크                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce       | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js        | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Express 데모 코드 | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| API 없는 양식     | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |

