# 域名绑定

## Cloudflare

只需将域名代理添加到您的服务器 IP 地址即可

## Nginx

- 安装并配置 Nginx。
- 为您的主域名获取 SSL 证书（例如，使用 `certbot`）。
- 确保您的网站可以通过 `https://您的域名` 访问。

## 配置和重启商户

- 打开商户配置文件：

  ```bash
  nano /home/dv/merchant/configs/config.yaml
  ```

- 添加（或修改）以下行：

  ```yaml
  http:
    port: "8080"
  ```

- 保存更改并重启后端：

  ```bash
  sudo systemctl restart dv-merchant
  ```

## 配置 Nginx 子域名

- 为子域名创建 Nginx 配置文件：

  ```bash
  nano /etc/nginx/conf.d/{您的域名或子域名}.conf
  ```

- 将以下代码块粘贴到其中（如果需要，调整 `proxy_pass` 中的端口）：

  ```nginx
  server {
      listen 80;
      server_name {您的域名};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{您的域名}.access.log;
      error_log   /var/log/nginx/{您的域名}.error.log;

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

- 保存更改并重新加载 Nginx：

  ```bash
  sudo nginx -s reload
  ```

## 配置 DNS

- 在您的主机（或域名注册商）的 DNS 设置中，将子域名 `{您的域名或子域名}` 绑定到您的服务器 IP 地址。例如，使用 A 记录：

  ```
  {您的域名或子域名}    A     您的服务器IP
  ```

## 为子域名颁发 SSL 证书

- 当 DNS 记录更新并指向服务器时，颁发证书：

  ```bash
  sudo certbot --nginx -d {您的域名或子域名}
  ```

## 检查状态和最终配置

- 确保后端已成功启动：

  ```bash
  systemctl status dv-merchant
  ```

- 访问 `http://{您的域名或子域名}`（或 `https://{您的域名或子域名}`，如果证书已正确颁发），并在浏览器中继续配置商户。