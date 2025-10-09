# 머천트 서버 관리 패널 숨기기

이 가이드는 **dv-merchant** 애플리케이션의 **관리 패널**($/dv-admin/$), **결제 폼**($/pay/$), 그리고 **API**($/api/v1/*$)에 대한 접근을 분리하도록 **Nginx**를 설정하는 방법을 설명합니다. 이를 통해 기밀 라우트에 대한 접근을 제한하고 기능별로 다른 도메인을 제공하여 보안을 강화합니다.

## 1. dv-merchant 라우트 개요

**dv-merchant** 서버 애플리케이션은 다음의 라우트 그룹을 사용하여 여러 구성 요소의 프론트엔드와 API를 함께 제공합니다:

* **/pay/**: **결제 폼**을 위한 JS와 프론트엔드를 로드합니다.
* **/dv-admin/**: **관리 패널**을 위한 JS와 프론트엔드를 로드합니다.
* **/api/v1/public**: **결제 폼**에서 사용하는 **공개** API 메서드입니다.
* **/api/v1/external**: **스토어 연동**(예: 인보이스 생성)을 위한 API 메서드입니다.
* **/api/v1/dv-admin**: **관리 패널**을 위한 API 메서드입니다.

## 2. 사전 준비

### 2.1. Nginx 설치

서버에 **Nginx**를 설치합니다. 운영 체제에 따라 명령이 다릅니다(예: Debian/Ubuntu에서는 `sudo apt update && sudo apt install nginx`).

### 2.2. dv-merchant 포트 변경

Nginx를 리버스 프록시로 사용하려면 외부에서 접근할 수 없는 로컬 포트(예: **8080**)로 **dv-merchant**를 전환해야 합니다.

설정 파일을 편집합니다:
`nano /home/dv/merchant/configs/config.yaml`

`'http'` 섹션에서 새 포트를 설정합니다:

```yaml
http:
  port: "8080"
```

### 2.3. 콜백 주소 업데이트

처리 시스템에서 머천트 서버로의 **콜백 URL**을 시스템 설정에서 업데이트하여, 결제 폼에 대해 구성한 외부 주소(예: `https://pay.some-domain.com`)를 가리키도록 해야 합니다.

## 3. Nginx 설정

각각 고유한 도메인/서브도메인과 접근 규칙을 가지는 **세 개의 개별 Nginx 설정 파일**(가상 호스트)을 만듭니다.

중요: 모든 구성에 대해 **HTTPS/SSL** 사용을 권장합니다(예: **Certbot** 사용). 아래 예시는 단순화를 위해 HTTP(포트 80)를 사용합니다.

### 3.1. 결제 폼용 구성(`pay.some-domain.com`)

이 호스트는 결제 폼과 공개 API에 대한 접근을 제공해야 합니다. 관리 또는 외부 API와 관련된 모든 라우트는 **차단**하거나 **리디렉션**해야 합니다.

파일 `/etc/nginx/conf.d/pay.some-domain.com.conf`를 생성합니다:

```nginx
server {
    listen 80;
    server_name pay.some-domain.com; # Use your domain
    client_max_body_size 128M;

    access_log /var/log/nginx/pay.some-domain.com.log main;
    error_log  /var/log/nginx/pay.some-domain.com.error.log warn;

    # 1. Access to the Payment Form and Public API
    location ~ ^/(pay|api/v1/public) {
        proxy_pass http://localhost:8080$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 2. Block and redirect administrative and external routes
    location /dv-admin {
        return 403; # Access denied
    }

    location ~ ^/api/v1/(dv-admin|external) {
        return 403; # Access denied
    }

    # 3. Block all other routes
    location / {
        return 404;
    }
}
```

### 3.2. 외부 스토어 API용 구성(`integration.some-domain.com`)

이 호스트는 API 상호작용(예: 인보이스 생성)을 위해 당신의 스토어 IP 주소에서만 접근 가능해야 합니다.

파일 `/etc/nginx/conf.d/integration.some-domain.com.conf`를 생성합니다:

```nginx
server {
    listen 80;
    server_name integration.some-domain.com; # Use your domain
    client_max_body_size 128M;

    # Restrict access by IP
    allow 216.58.208.196; # <-- !!! Replace with your store's IP address
    # allow x.x.x.x;    # Add other IPs if necessary
    deny all;


    access_log /var/log/nginx/integration.some-domain.com.log main;
    error_log  /var/log/nginx/integration.some-domain.com.error.log warn;

    # 1. Access only to the external API
    location /api/v1/external {
        proxy_pass http://localhost:8080$request_uri;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 2. Block all other routes
    location / {
        return 403; # Access denied to everything except /api/v1/external
    }
}
```

### 3.3. 관리 패널용 구성(`panel.some-domain.com`)

이 호스트는 관리와 관련된 모든 항목에 접근을 제공해야 하며, **신뢰할 수 있는 IP 주소에서만** 접근 가능해야 합니다.

파일 `/etc/nginx/conf.d/panel.some-domain.com.conf`를 생성합니다:

```nginx
server {
    listen 80;
    server_name panel.some-domain.com; # Use your domain
    client_max_body_size 128M;

    # Restrict access by IP
    allow 216.58.208.196; # <-- !!! Replace with your trusted IP (office/home)
    allow 216.58.208.197; # <-- !!! Replace with another trusted IP
    deny all;


    access_log /var/log/nginx/panel.some-domain.com.log main;
    error_log  /var/log/nginx/panel.some-domain.com.error.log warn;

    # 1. Access to all dv-merchant routes
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. 설정 마무리

모든 설정 파일을 만든 후:

1. Nginx 설정 테스트:
    ```bash
    sudo nginx -t
    ```
   구문 오류가 없는지 확인합니다.
2. Nginx 재시작:
    ```bash
    sudo systemctl restart nginx
    ```
3. DNS 확인: 세 도메인(`pay.some-domain.com`, `integration.some-domain.com`, 그리고
4. `panel.some-domain.com`)이 모두 서버의 IP 주소를 가리키는지 확인합니다.

관리 패널(라우트 $/dv-admin/*$ 및 $/api/v1/dv-admin/*$)은 이제 **숨겨져** 있으며 제한된 IP 주소 집합에서 `panel.some-domain.com` 도메인으로만 접근할 수 있습니다. 한편 결제 폼과 외부 API는 명확히 분리되어 제한된 접근 정책이 적용됩니다.