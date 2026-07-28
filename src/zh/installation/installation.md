# [dv.net](http://dv.net) 商户安装与配置指南

## 安装

使用提供的脚本安装商户：

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

请注意，如果您的服务器上启用了防火墙，则需要将端口 **80** 和 **443** 添加到例外中。

### 检查防火墙是否存在及状态

#### Ubuntu / Debian

**UFW**（最常用）：

```bash
# 检查是否安装了 ufw
command -v ufw && ufw --version

# 防火墙状态
sudo ufw status verbose

# 检查服务是否处于活动状态
systemctl is-active ufw
```

**firewalld**（较少见，但可能存在）：

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables**（如果未使用 ufw 和 firewalld）：

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld**（CentOS 标准配置）：

```bash
# 检查是否安装了 firewalld
command -v firewall-cmd && firewall-cmd --version

# 状态
sudo systemctl status firewalld
sudo firewall-cmd --state

# 已开放端口列表
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW**（如果手动安装）：

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### 开放端口（如果防火墙已启用）

**UFW（Ubuntu / Debian）：**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld（CentOS / 部分 Debian/Ubuntu）：**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## 绑定域名

> 示例：网站 — `domain.com`，商户 — `pay.domain.com`。

两种方式：

1. **Cloudflare** — 最简单：开启代理后，HTTPS 会立即生效。
2. **Nginx + Let's Encrypt** — 如果不使用 Cloudflare。

---



### 方式 1. Cloudflare（推荐）

安装完成后，商户已在监听端口 **80**。Cloudflare 会自动为用户提供 HTTPS。

#### 步骤 1. 开放端口 80 和 443

参见 [安装 → 开放端口](#开放端口如果防火墙已启用) 章节。

#### 步骤 2. 添加 DNS 记录

Cloudflare → 您的域名 → **DNS** → 创建 A 记录：


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay`（或所需子域名） | `您的服务器IP` | **Proxied**（橙色云朵） |




#### 步骤 3. SSL 模式

Cloudflare → **SSL/TLS** → 选择 **Flexible** 模式。

#### 步骤 4. 验证

等待几分钟后打开：

```text
https://pay.domain.com
```

应能看到商户页面。之后在浏览器中继续配置。

---



### 方式 2. Nginx + Let's Encrypt

如果不使用 Cloudflare，需在服务器上自行签发 SSL 证书。

#### 步骤 1. 开放端口 80 和 443

参见 [安装 → 开放端口](#开放端口如果防火墙已启用) 章节。

#### 步骤 2. DNS

在注册商面板中创建 A 记录：

```text
pay.domain.com    A     您的服务器IP
```

确认 DNS 已指向服务器：

```bash
dig +short pay.domain.com
```



#### 步骤 3. 安装 Nginx 和 Certbot

**Ubuntu / Debian：**

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

**CentOS：**

```bash
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```



#### 步骤 4. 将商户切换到端口 8080

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



#### 步骤 5. Nginx 配置

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



#### 步骤 6. 签发证书

```bash
sudo certbot --nginx -d pay.domain.com
```



#### 步骤 7. 验证

打开：

```text
https://pay.domain.com
```

然后继续配置商户。

## 浏览器中的初始配置

安装并绑定域名后，打开商户地址：

```text
https://pay.domain.com/
```

系统会自动跳转到管理面板（`/dv-admin/`）并显示安装向导。

---



### 步骤 1. 系统检查

界面：**「Welcome to DaVinci project」**（欢迎使用 DaVinci 项目）。

应显示绿色勾选：

- **PostgreSQL**
- **Redis**

点击 **「Next」**（下一步）。

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>系统检查</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'系统检查\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="系统检查" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 步骤 2. 创建系统管理员

界面：**「Create system administrator」**（创建系统管理员）。

填写：


| 字段                  | 要求          |
| --------------------- | ------------------- |
| Email                 | 有效的 email 地址      |
| Password              | 8 至 32 个字符 |
| Password confirmation | 与密码一致 |


点击 **「Next」**（下一步）。

> 这是 root 用户。请将登录名和密码保存在安全的地方。  
> 仅在首次安装时创建一次。

注册完成后，系统会自动初始化 processing（merchant ↔ processing 绑定）。

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>创建系统管理员</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'创建系统管理员\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="创建系统管理员" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 步骤 3. 生成并确认 seed 短语

界面：**「Generate seed phrase」** / 助记词生成。

1. 选择短语长度：**12** 或 **24** 个单词（默认 24）。
2. 如需重新生成，点击 **「Generate mnemonics」**。
3. 点击 **「Show」** 查看单词。
4. **复制并将短语离线保存**（纸质备份 / 密码管理器 / 离线存储）。
5. 点击 **「Confirm」**。

> Seed 短语是商户所有钱包的主密钥。谁拥有它，谁就拥有资金。  
> 没有它，无法恢复对钱包的访问。

确认后将打开 **Quick start**（快速入门）。

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>生成 seed 短语</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'生成 seed 短语\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="生成 seed 短语" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 步骤 4. 快速入门：



#### 4.1. 项目 URL

以 `https://domain.com` 格式填写您的网站/项目 URL，然后点击 **「Save」**。

#### 4.2. Webhook 和 API

1. 填写 Webhook URL（DV.net 将向该地址发送支付通知）。
2. 复制 **API key** — 需在请求头 `x-api-key` 中传递。
3. 复制用于验证 Webhook 真实性的密钥。



#### 4.3. 充值 processing 钱包

界面上会显示各网络的 processing 钱包地址。

需稍后充值 — 从客户热钱包转账时，网络手续费将从这些钱包支付。

点击 **「Next」** / **「Finish」**，或选择 **「Skip and set up later」** 稍后配置。

完成后将打开商户仪表盘。

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>快速入门</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'快速入门\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="快速入门" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## 项目配置 — 分步指南：

在测试域名上配置已安装的商户：

```text
https://pay.domain.com/
```

---



### 第一部分. 登录管理面板

1. 打开浏览器（Chrome / Safari / Firefox）。
2. 在地址栏输入：

```text
https://pay.domain.com/
```

1. 按 Enter。
2. 如果出现登录页 — 输入安装时创建的管理员 **email** 和 **密码**。
3. 点击登录按钮。

您应进入 DV.net 管理面板。

---



### 第二部分. 创建商店（项目）

1. 在左侧菜单找到 **「Projects」** / **「项目」**。
2. 点击进入。
3. 点击右上角 **「Create a store」** / **「创建商店」**。
4. 填写字段：


| 字段                | 填写内容                                 | 示例               |
| ------------------- | ------------------------------------------ | -------------------- |
| **Name** / 名称 | 您的商店名称                 | `测试商店`   |
| **Site** / 网站     | 您的网站链接（可留空） | `https://domain.com` |


1. 点击 **「Create a project」** / **「创建项目」**。
2. 等待商店创建成功的提示。
3. 返回项目列表 — 您的商店将出现在其中。

> 如果在 Quick start 阶段已创建商店，则无需再创建。直接通过 **Edit** 打开现有商店即可。

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>创建商店</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'创建商店\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="创建商店" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第三部分. 打开商店设置

1. 在 **Projects** 列表中找到您的商店。
2. 点击该行右侧的 **「Edit」** / **「编辑」**。
3. 将打开商店页面，顶部有两个标签页：
  - **Main** — API 密钥和 Webhook
  - **Advanced settings** — 币种、网站、支付表单

先配置 **Main**，再配置 **Advanced settings**。

---



### 第四部分. 获取 API key 和 Secret key

在 **Main** 标签页：

#### 4.1. API key

1. 找到 **「Your API key」** / **「您的 API 密钥」** 区块。
2. 如果还没有密钥 — 点击创建 / **Generate**。
3. 点击密钥旁的复制图标。
4. 保存密钥。

此密钥需在请求头中使用：

```text
x-api-key: 您的密钥
```



#### 4.2. Secret key（用于验证 Webhook）

1. 在同一区域找到 **Secret key**。
2. 如果没有密钥 — 点击 **「Generate new」** / **「生成」**。
3. 点击 **「Show」** 查看。
4. 复制并与 API key 一起保存。

> Secret key 用于让您的网站验证：「这条通知确实来自 DV.net，而非诈骗者」。

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key 与 Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key 与 Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key 与 Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第五部分. 配置 Webhook

Webhook 是客户付款后 DV.net 对您网站的「回调通知」。

1. 在 **Main** 标签页找到 **「Webhooks」** 区块。
2. 在 URL 字段中粘贴您的处理程序地址，例如：

```text
https://domain.com/api/dv-webhook
```

> 如果还没有自己的处理程序，可暂时跳过此步骤，稍后再配置。没有 Webhook 支付仍可能正常，但商店无法自动得知款项已到账。

1. 启用所需事件，至少包括：
  - 支付成功 WebHook（**WebHook on successful payment**）
2. 点击 **「Create」** 或 **「Save」**。
3. 点击 **「Test」**，确认您的服务器有响应。

如需其他事件（未确认支付、processing 钱包提现），可重复上述步骤。

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>配置 Webhook</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'配置 Webhook\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="配置 Webhook" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第六部分. 启用币种及商店基本设置

1. 切换到 **「Advanced settings」** / **「高级设置」** 标签页。
2. 在 **General** 区块：
  - 检查商店**名称**；
  - 如未填写，请指定 **Project website**（项目网站）。
3. 在 **Accepted currencies** / **接受的币种** 区块：
  - 点击所需币种（例如 USDT Tron、BTC、ETH）；
  - 或点击 **「Select all」** 选择全部。
4. 在 **Payment form settings** 区块：
  - **Minimal payment** — 最低金额（不低于 `$0.1`）；
  - 可选填写 **success_url** 和 **return_url**（支付完成后跳转地址）。
5. 在底部点击 **「Save」** / **「保存」**。

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>商店高级设置</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'商店高级设置\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="商店高级设置" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第七部分. 支付链接（现成表单）

在 **Advanced settings** 中会有如下链接模板：

```text
https://pay.domain.com/pay/store/商店ID/<您的客户ID>
```

其中：

- `商店ID` — 由系统自动填入；
- `<您的客户ID>` — 替换为您系统中的客户 ID（例如 `user_15`）。

示例：

```text
https://pay.domain.com/pay/store/您的商店UUID/user_15
```

可在浏览器中打开此链接 — 将显示 DV.net 支付表单。

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>支付链接</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'支付链接\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="支付链接" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第八部分. 在面板中创建测试支付：

1. 返回 **Projects**。
2. 在商店行点击 **「Create payment」** / **「创建支付」**。
3. 在弹窗中填写：
  - **Amount** — 美元金额，例如 `5`；
  - **Email** — 可留空；
  - **External ID** — 客户 ID（或使用自动生成）；
  - **Currency** — 支付币种（如有提示）。
4. 点击 **「Create payment」**。
5. 复制生成的**支付链接**。
6. 在新标签页打开 — 应显示支付页面。

由此可验证商店是否正常运行。

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>创建测试支付</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'创建测试支付\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="创建测试支付" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第九部分. 通过 API 连接商店

密钥就绪后：

**API 地址：**

```text
https://pay.domain.com
```

**创建账单 / 支付钱包：**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: 您的_API_KEY' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

响应中的 `**pay_url**` 字段即为发送给客户的链接。

---



### 第十部分. 充值 processing 钱包

1. 在左侧菜单打开 **Dashboard** / **仪表盘**。
2. 找到 processing 钱包区块（按网络：Tron、Ethereum 等）。
3. 复制所需网络的地址。
4. 向该地址转入少量同网络加密货币（用于支付手续费）。

否则，收款可能正常，但从热钱包转账/提现可能因 gas/手续费不足而失败。

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Processing 钱包</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Processing 钱包\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="Processing 钱包" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### 第十一部分. 「一切就绪」检查清单

请逐项确认：

- [ ] 已登录 `https://pay.domain.com/`
- [ ] 已创建商店（项目）
- [ ] 已复制 **API key**
- [ ] 已复制 **Secret key**
- [ ] 已保存管理员 seed 短语（安装阶段）
- [ ] 已启用所需币种
- [ ] 已配置 Webhook（或有意延后）
- [ ] 已创建测试支付并打开 `pay_url`
- [ ] 已按需充值 processing 钱包

全部完成后，商店即可进行测试集成。

---



### 常见问题（简明说明）


| 问题                     | 解决方法                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| 网站无法打开          | 确认域名 `pay.domain.com` 指向服务器，端口 80/443 已开放 |
| 没有创建商店按钮   | 未以管理员身份登录 — 退出后重新登录                       |
| 没有 API key                  | 打开项目 → **Edit** → **Main** → Generate                                |
| 支付链接无法打开 | 确认完整复制链接；商店币种已启用                 |
| Webhook 未收到           | URL 须可从公网访问（不能是 localhost）；在面板中测试 Test   |
| 忘记管理员密码         | 通过服务器 CLI 恢复：`dv-merchant users`（需 SSH 访问）  |


---



## 集成示例

场景：

1. 为客户 `user_123` 创建 **10 USD** 支付
2. 获取 `pay_url` 并交给客户
3. 接收 Webhook，验证签名，返回 `{"success": true}`

开始前请替换为您的实际值：


| 项目            | 查看位置          | 示例                   |
| -------------- | ---------------------- | ------------------------ |
| 商户地址 | 您的支付域名       | `https://pay.domain.com` |
| API key        | Projects → Edit → Main | `您的_API_KEY`            |
| Secret key     | 同上                 | `您的_SECRET_KEY`         |
| 商店 ID    | Advanced settings      | `您的商店UUID`         |
| 您的网站       | 商店网站          | `https://domain.com`     |




### 先在面板中配置 Webhook（一次性）

1. 打开 `https://pay.domain.com`
2. 进入：**Projects → 您的商店 → Edit → Main**
3. 找到 **Webhooks** 区块
4. 粘贴 URL：`https://domain.com/dv/webhook`
5. 启用已确认支付
6. 点击 **Save**

---



### 支付流程

```text
1. 客户点击「支付」
2. 您的网站在 DV.net 创建付款并将链接发送给客户
3. 客户打开 pay_url 并完成支付
4. DV.net 向您的网站发送 webhook，通知付款状态
5. 您验证签名并入账订单
6. 响应 {"success": true}
```

---



### 1) cURL



#### 步骤 1. 创建支付

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: 您的_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### 步骤 2. 从响应中获取 `pay_url`

将此链接发送给客户。

#### 补充：

获取币种列表：

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: 您的_API_KEY'
```

获取当前汇率：

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: 您的_API_KEY'
```

---



### 2) Python



#### 步骤 1. 安装库

```bash
pip install dv-net-client
```



#### 步骤 2. 创建支付

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="您的_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # 发送给客户
```



#### 步骤 3. 接收 Webhook

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "您的_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. 验证签名
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. 如果付款已确认 — 入账
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. 不要重复入账
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"来自 {user_id} 的付款: {amount} USD")
            # 在此保存订单/余额

    # 4. 始终这样响应
    return jsonify({"success": True})
```

---



### 3) PHP



#### 步骤 1. 安装库

```bash
composer require dv-net/dv-net-php-client
```



#### 步骤 2. 创建支付

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: '您的_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // 发送给客户
```



#### 步骤 3. 接收 Webhook（`/dv/webhook`）

```php
<?php
$secret = '您的_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. 验证签名
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. 如果付款已确认 — 入账
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. 在数据库中检查 $uniq 是否已处理
    // 将订单记入用户 $userId
}

// 4. 始终这样响应
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### 步骤 1. 安装库

```bash
npm install @dv-net/js-client express
```



#### 步骤 2. 创建支付

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "您的_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // 发送给客户
```



#### 步骤 3. 接收 Webhook

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "您的_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. 验证签名
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. 如果付款已确认 — 入账
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. 不要重复入账
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`来自 ${userId} 的付款: ${amount} USD`);
      // 在此保存订单/余额
    }
  }

  // 4. 始终这样响应
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### 步骤 1. 安装插件

1. 下载 [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **插件 → 添加 → 上传**
3. **激活**



#### 步骤 2. 填写设置

1. **WooCommerce → 设置 → 支付 → DV.net**
2. 启用支付
3. 填写：
  - Merchant URL: `https://pay.domain.com`
  - API Key: `您的_API_KEY`
  - API Secret: `您的_SECRET_KEY`
4. 保存



#### 步骤 3. 在 [DV.net](http://DV.net) 中配置 Webhook

填写插件设置中的 callback URL。

#### 步骤 4. 验证

创建测试订单并完成支付。

---



### 6) OpenCart



#### 步骤 1. 安装模块

1. 下载 [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart)（`dv-opencart.ocmod.zip`）
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### 步骤 2. 填写设置

1. 打开 DV.net Gateway 的 Edit
2. 填写：
  - Merchant URL: `https://pay.domain.com`
  - API Key: `您的_API_KEY`
  - API Secret: `您的_SECRET_KEY`
3. Status: Enabled
4. 保存



#### 步骤 3. 在 [DV.net](http://DV.net) 中配置 Webhook

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### 步骤 4. 验证

创建测试订单。

---



### Webhook 简要说明

1. 始终返回：

```json
{"success": true}
```

1. 签名：

```text
SHA256(请求体 + Secret_key) = X-Sign 标头
```

1. 避免重复入账，请记录：

```text
tx_hash + bc_uniq_key
```

1. 事件类型：


| 类型                                | 处理方式       |
| ---------------------------------- | ---------------- |
| `PaymentReceived`                  | 入账支付 |
| `PaymentNotConfirmed`              | 等待确认        |
| `WithdrawalFromProcessingReceived` | 提现完成   |


---



### 演示示例：


| 内容              | 链接                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce      | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js       | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Express 演示代码 | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| 无 API 表单    | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |


