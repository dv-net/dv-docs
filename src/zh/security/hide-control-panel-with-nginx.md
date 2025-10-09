# 隐藏商户服务器管理面板

本指南介绍如何配置 Nginx，将 dv-merchant 应用的 管理面板（$/dv-admin/$）、支付表单（$/pay/$）和 API（$/api/v1/*$）分区访问。通过限制对敏感路由的访问，并为不同功能提供不同的域名，可增强安全性。

## 1\. dv-merchant 路由概览

dv-merchant 服务器应用同时为多个组件提供前端和 API，使用以下路由分组：

* **/pay/**：加载支付表单的 JS 和前端。
* **/dv-admin/**：加载管理面板的 JS 和前端。
* **/api/v1/public**：支付表单使用的公共 API 方法。
* **/api/v1/external**：用于商店集成的 API 方法（例如创建发票）。
* **/api/v1/dv-admin**：管理面板使用的 API 方法。

## 2\. 准备工作

### 2.1. 安装 Nginx

在你的服务器上安装 Nginx。具体命令取决于操作系统（例如 Debian/Ubuntu 使用 `sudo apt update && sudo apt install nginx`）。

### 2.2. 更改 dv-merchant 端口

为了通过 Nginx 作为反向代理运行，请将 dv-merchant 切换到一个仅本地访问的端口（例如 8080），使其不对外直接开放。

编辑配置文件：
`nano /home/dv/merchant/configs/config.yaml`

在 'http' 部分设置新端口：

```yaml
http:
  port: "8080"
```

### 2.3. 更新回调地址

你必须在系统设置中将处理系统到商户服务器的回调 URL 更新为指向为支付表单配置的外部地址（例如 `https://pay.some-domain.com`）。

## 3\. Nginx 配置

我们将创建三个独立的 Nginx 配置文件（虚拟主机），每个负责自己的域名/子域名，并具有各自的访问规则。

重要提示：强烈建议所有配置使用 HTTPS/SSL（例如使用 Certbot）。为便于示例，下面使用的是 HTTP（80 端口）。

### 3.1. 支付表单（`pay.some-domain.com`）的配置

此主机应提供对支付表单及其公共 API 的访问。所有与管理或外部 API 相关的路由都必须被阻止或重定向。

创建文件 `/etc/nginx/conf.d/pay.some-domain.com.conf`：

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

### 3.2. 外部商店 API（`integration.some-domain.com`）的配置

此主机应仅允许来自你的商店 IP 地址的访问，用于 API 交互（例如创建发票）。

创建文件 `/etc/nginx/conf.d/integration.some-domain.com.conf`：

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

### 3.3. 管理面板（`panel.some-domain.com`）的配置

此主机应提供与管理相关的所有访问，并且仅允许来自可信 IP 地址的访问。

创建文件 `/etc/nginx/conf.d/panel.some-domain.com.conf`：

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

## 4\. 完成设置

创建所有配置文件后：

1. 测试 Nginx 配置：
    ```bash
    sudo nginx -t
    ```
   确保没有语法错误。
2. 重启 Nginx：
    ```bash
    sudo systemctl restart nginx
    ```
3. 检查 DNS：确保三个域名（`pay.some-domain.com`、`integration.some-domain.com`，以及
4. `panel.some-domain.com`）都指向你服务器的 IP 地址。

现在，管理面板（路由 $/dv-admin/*$ 和 $/api/v1/dv-admin/*$）已被隐藏，只能通过 `panel.some-domain.com` 且来自受限的 IP 地址集合访问；同时，支付表单与外部 API 的访问被清晰分离并受到限制。