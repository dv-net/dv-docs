# 도메인 이름 바인딩

## Cloudflare

서버의 IP 주소에 도메인 프록시를 추가하기만 하면 됩니다.

## Nginx

- Nginx를 설치하고 구성합니다.
- 기본 도메인에 대한 SSL 인증서를 받으세요(예: `certbot` 사용).
- 웹사이트가 `https://your_domain`에서 접근 가능한지 확인하세요.

## 판매자 설정 및 재시작

- 판매자 구성 파일을 엽니다.

```bash
  nano /home/dv/merchant/configs/config.yaml
````

- 다음 줄을 추가하거나 수정합니다.

```yaml
  http:
    port: "8080"
  ```

- 변경 사항을 저장하고 백엔드를 재시작합니다.

```bash
  sudo systemctl restart dv-merchant
  ```

## 하위 도메인에 대한 Nginx 설정

- 하위 도메인에 대한 Nginx 구성 파일을 만듭니다.

```bash
  nano /etc/nginx/conf.d/{your_domain or subdomain}.conf
  ```

- 다음 블록을 붙여넣습니다(`proxy_pass`에서 필요에 따라 포트를 조정합니다).

```nginx
  server {
      listen 80;
      server_name {your_domain};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{your_domain}.access.log;
      error_log   /var/log/nginx/{your_domain}.error.log;

      location / {
          proxy_pass http://localhost:8080;
      }

      location ~ /\.(ht|svn|git) {
          deny all;
      }

      #Cloudflare proxy mode

      set_real_ip_from 103.21.244.0/22;
      set_real_ip_from 103.22.200.0/22;
      set_real_ip_from 103.31.4.0/22;
      set_real_ip_from 104.16.0.0/12;
      set_real_ip_from 108.162.192.0/18;
      set_real_ip_from 131.0.72.0/22;
      set_real_ip_from 141.101.64.0/18;
      set_real_ip_from 162.158.0.0/15;
      set_real_ip_from 172.64.0.0/13;
      set_real_ip_from 173.245.48.0/20;
      set_real_ip_from 188.114.96.0/20;
      set_real_ip_from 190.93.240.0/20;
      set_real_ip_from 197.234.240.0/22;
      set_real_ip_from 198.41.128.0/17;
      set_real_ip_from 2400:cb00::/32;
      set_real_ip_from 2606:4700::/32;
      set_real_ip_from 2803:f800::/32;
      set_real_ip_from 2405:b500::/32;
      set_real_ip_from 2405:8100::/32;
      set_real_ip_from 2c0f:f248::/32;
      set_real_ip_from 2a06:98c0::/29;

      real_ip_header CF-Connecting-IP;
  }
  ```

- 변경 사항을 저장하고 Nginx를 재시작합니다.

```bash
  sudo nginx -s reload
 ```

## DNS 설정

- 호스팅(또는 도메인 등록 기관)의 DNS 설정에서 하위 도메인 `{your_domain or subdomain}`을 서버의 IP 주소에 연결합니다. 예를 들어, A 레코드를 사용합니다.

```
{your_domain or subdomain}    A     IP_your_server
```

## 하위 도메인에 대한 SSL 인증서 발급

- DNS 레코드가 업데이트되어 서버를 가리키면 인증서를 발급합니다.

```bash
  sudo certbot --nginx -d {your_domain or subdomain}
  ```

## 상태 확인 및 최종 설정

- 백엔드가 성공적으로 시작되었는지 확인합니다.

```bash
  systemctl status dv-merchant
  ```

- `http://{your_domain or subdomain}`(또는 인증서가 올바르게 발급된 경우 `https://{your_domain or subdomain}`)으로 이동하여 브라우저에서 판매자 설정을 계속합니다.
