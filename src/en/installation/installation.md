# Merchant installation and configuration guide for [dv.net](http://dv.net)

## Installation

Install the merchant using the provided script:

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

Note that if your server has a firewall enabled, you must allow ports **80** and **443**.

### Checking for and inspecting the firewall

#### Ubuntu / Debian

**UFW** (most commonly used):

```bash
# Check if ufw is installed
command -v ufw && ufw --version

# Firewall status
sudo ufw status verbose

# Check if the service is active
systemctl is-active ufw
```

**firewalld** (less common, but possible):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (if ufw and firewalld are not used):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (default for CentOS):

```bash
# Check if firewalld is installed
command -v firewall-cmd && firewall-cmd --version

# Status and state
sudo systemctl status firewalld
sudo firewall-cmd --state

# List of open ports
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (if installed manually):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### Opening ports (if firewall is active)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / sometimes Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## Domain name binding

> In the examples below: website — `domain.com`, merchant — `pay.domain.com`.

Two options:

1. **Cloudflare** — the simplest: enable the proxy and HTTPS is available immediately.
2. **Nginx + Let's Encrypt** — if you are not using Cloudflare.

---



### Option 1. Cloudflare (recommended)

After installation, the merchant already listens on port **80**. Cloudflare provides HTTPS for end users automatically.

#### Step 1. Open ports 80 and 443

See [Installation → Opening ports](#opening-ports-if-firewall-is-active).

#### Step 2. Add a DNS record

Cloudflare → your domain → **DNS** → create an A record:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (or the subdomain you need) | `YOUR_SERVER_IP` | **Proxied** (orange cloud) |




#### Step 3. SSL mode

Cloudflare → **SSL/TLS** → **Flexible** mode.

#### Step 4. Verification

Wait a couple of minutes and open:

```text
https://pay.domain.com
```

The merchant page should load. Continue setup in the browser.

---



### Option 2. Nginx + Let's Encrypt

If you are not using Cloudflare — issue SSL on the server yourself.

#### Step 1. Open ports 80 and 443

See [Installation → Opening ports](#opening-ports-if-firewall-is-active).

#### Step 2. DNS

In your registrar's control panel, create an A record:

```text
pay.domain.com    A     YOUR_SERVER_IP
```

Verify that DNS already points to your server:

```bash
dig +short pay.domain.com
```



#### Step 3. Install Nginx and Certbot

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



#### Step 4. Move the merchant to port 8080

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



#### Step 5. Nginx config

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



#### Step 6. Issue the certificate

```bash
sudo certbot --nginx -d pay.domain.com
```



#### Step 7. Verification

Open:

```text
https://pay.domain.com
```

and continue merchant setup.

## Initial browser setup

After installation and domain binding, open the merchant URL:

```text
https://pay.domain.com/
```

The system will redirect you to the admin panel (`/dv-admin/`) and show the setup wizard.

---



### Step 1. System check

Screen: **"Welcome to the DaVinci project"**.

You should see green checkmarks for:

- **PostgreSQL**
- **Redis**

Click **Next**.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>System check</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'System check\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="System check" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Step 2. Create system administrator

Screen: **"Create system administrator"**.

Fill in:


| Field                 | Requirement          |
| --------------------- | -------------------- |
| Email                 | Valid email address  |
| Password              | 8 to 32 characters |
| Password confirmation | Must match password  |


Click **Next**.

> This is the root user. Save the login and password in a secure place.  
> It is created only once during the initial installation.

After registration, the system automatically initializes processing (merchant ↔ processing link).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Create system administrator</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Create system administrator\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="Create system administrator" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Step 3. Generate and confirm seed phrase

Screen: **"Generate seed phrase"**.

1. Choose phrase length: **12** or **24** words (24 by default).
2. Click **"Generate mnemonics"** if you need to regenerate.
3. Click **"Show"** to view the words.
4. **Copy and save the phrase offline** (paper / password manager / offline storage).
5. Click **"Confirm"**.

> The seed phrase is the master key to all merchant wallets. Whoever holds it controls the funds.  
> Without it, wallet access cannot be recovered.

After confirmation, **Quick start** will open.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Seed phrase generation</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Seed phrase generation\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="Seed phrase generation" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Step 4. Quick start:



#### 4.1. Project URL

Enter your website/project URL in the format `https://domain.com` and click **Save**.

#### 4.2. Webhook and API

1. Enter the webhook URL (where DV.net will send payment notifications).
2. Copy the **API key** — it must be sent in the `x-api-key` header.
3. Copy the secret key used to verify webhook authenticity.



#### 4.3. Fund processing wallets

The screen will show processing wallet addresses by network.

Fund them later — network fees for transfers from customer hot wallets are paid from these wallets.

Click **Next** / **Finish**, or **Skip and set up later** if you will configure this later.

After completion, the merchant dashboard will open.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Quick start</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Quick start\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="Quick start" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## Project setup — step by step:

Configure an already installed merchant on a test domain:

```text
https://pay.domain.com/
```

---



### Part 1. Log in to the panel

1. Open a browser (Chrome / Safari / Firefox).
2. In the address bar, enter:

```text
https://pay.domain.com/
```

1. Press Enter.
2. If a login screen appears — enter the administrator **email** and **password** (created during installation).
3. Click the login button.

You should land in the DV.net control panel.

---



### Part 2. Create a store (project)

1. In the left menu, find **Projects**.
2. Click it.
3. In the top right, click **Create a store**.
4. Fill in the fields:


| Field  | What to enter                              | Example              |
| ------ | ------------------------------------------ | -------------------- |
| **Name** | Your store name                          | `Test store`         |
| **Site** | Link to your website (can be left empty) | `https://domain.com` |


1. Click **Create a project**.
2. Wait for the confirmation that the store was created.
3. You will return to the project list — your store will appear there.

> If a store was already created during Quick start — you do not need to create another one. Just open the existing store via **Edit**.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Create store</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Create store\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="Create store" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 3. Open store settings

1. In the **Projects** list, find your store.
2. In the row on the right, click **Edit**.
3. The store page opens with two tabs at the top:
  - **Main** — API keys and webhooks
  - **Advanced settings** — currencies, website, payment form

Configure **Main** first, then **Advanced settings**.

---



### Part 4. Get API key and Secret key

On the **Main** tab:

#### 4.1. API key

1. Find the **Your API key** block.
2. If there is no key yet — click the create / **Generate** button.
3. Click the copy icon next to the key.
4. Save the key.

You will need this key in the request header:

```text
x-api-key: YOUR_KEY
```



#### 4.2. Secret key (for webhook verification)

1. In the same section, find **Secret key**.
2. Click **Generate new** if there is no key yet.
3. Click **Show** to view it.
4. Copy and save it alongside the API key.

> The secret key lets your site verify: "this notification is definitely from DV.net, not an attacker".

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key and Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key and Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key and Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 5. Configure webhooks

A webhook is a "call" from DV.net to your site when a customer has paid.

1. On the **Main** tab, find the **Webhooks** block.
2. In the URL field, paste your handler address, for example:

```text
https://domain.com/api/dv-webhook
```

> If you do not have a handler yet — you can skip this step temporarily and come back later. Payments may work without a webhook, but your store will not automatically know when money has arrived.

1. Enable the events you need, at minimum:
  - **WebHook on successful payment**
2. Click **Create** or **Save**.
3. Click **Test** and verify that your server responds.

Repeat for other events if needed (unconfirmed payment, withdrawal from processing wallet).

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Webhook configuration</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Webhook configuration\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="Webhook configuration" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 6. Enable currencies and basic store settings

1. Go to the **Advanced settings** tab.
2. In the **General** block:
  - check the store **name**;
  - set **Project website** if not already specified.
3. In the **Accepted currencies** block:
  - click the coins you need (for example USDT Tron, BTC, ETH);
  - or click **Select all** if you need all of them.
4. In the **Payment form settings** block:
  - **Minimal payment** — minimum amount (not less than `$0.1`);
  - optionally set **success_url** and **return_url** (where to send the customer after payment).
5. At the bottom, click **Save**.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Advanced store settings</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Advanced store settings\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="Advanced store settings" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 7. Payment link (ready-made form)

In **Advanced settings** you will find a link template like:

```text
https://pay.domain.com/pay/store/STORE_ID/<your_client_ID>
```

Where:

- `STORE_ID` — already filled in by the system;
- `<your_client_ID>` — replace with the customer ID in your system (for example `user_15`).

Example:

```text
https://pay.domain.com/pay/store/YOUR_STORE_UUID/user_15
```

You can open this link in a browser — the DV.net payment form will load.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Payment link</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Payment link\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="Payment link" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 8. Create a test payment from the panel:

1. Go back to **Projects**.
2. In the store row, click **Create payment**.
3. In the dialog, fill in:
  - **Amount** — amount in dollars, for example `5`;
  - **Email** — can be left empty;
  - **External ID** — customer ID (or leave auto-generated);
  - **Currency** — payment currency (if prompted).
4. Click **Create payment**.
5. Copy the **payment link** that appears.
6. Open it in a new tab — the payment page should load.

This verifies that the store is working.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Create test payment</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Create test payment\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="Create test payment" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 9. Connect the store via API

Once you have the keys:

**API address:**

```text
https://pay.domain.com
```

**Create an invoice / payment wallet:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

The response includes the `**pay_url**` field — send it to the customer.

---



### Part 10. Fund processing wallets

1. In the left menu, open **Dashboard**.
2. Find the processing wallets block (by network: Tron, Ethereum, etc.).
3. Copy the address for the network you need.
4. Send a small amount of crypto on that network (for fees).

Without this, accepting payments may work, but transfers/withdrawals from hot wallets may fail due to insufficient gas/fees.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Processing wallets</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Processing wallets\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="Processing wallets" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Part 11. "All set" checklist

Check off each item:

- [ ] Logged in at `https://pay.domain.com/`
- [ ] Created a store (project)
- [ ] Copied **API key**
- [ ] Copied **Secret key**
- [ ] Saved the administrator seed phrase (during installation)
- [ ] Enabled the currencies you need
- [ ] Configured webhook (or deliberately postponed)
- [ ] Created a test payment and opened `pay_url`
- [ ] Funded processing wallets if needed

If all items are done — the store is ready for test integration.

---



### Common issues (in plain language)


| Problem                     | What to do                                                                      |
| --------------------------- | ------------------------------------------------------------------------------- |
| Site won't load             | Verify that `pay.domain.com` points to your server and ports 80/443 are open   |
| No button to create a store | You are not logged in as administrator — log out and log in again              |
| No API key                  | Open project → **Edit** → **Main** → Generate                                   |
| Payment link won't open     | Verify you copied the full link; store currencies are enabled                   |
| Webhook not arriving        | URL must be reachable from the internet (not localhost); use Test in the panel |
| Forgot admin password       | Recovery via CLI on the server: `dv-merchant users` (SSH access required)     |


---



## Integration examples

Scenarios:

1. Create a **10 USD** payment for customer `user_123`
2. Get the `pay_url` link and send it to the customer
3. Receive the webhook, verify the signature, respond with `{"success": true}`

Before you start, substitute your own values:


| What            | Where to find it       | Example                  |
| --------------- | ---------------------- | ------------------------ |
| Merchant URL    | your payment domain    | `https://pay.domain.com` |
| API key         | Projects → Edit → Main | `YOUR_API_KEY`            |
| Secret key      | same place             | `YOUR_SECRET_KEY`         |
| Store ID        | Advanced settings      | `YOUR_STORE_UUID`         |
| Your website    | store website          | `https://domain.com`     |




### First, configure the webhook in the panel (one time)

1. Open `https://pay.domain.com`
2. Go to: **Projects → your store → Edit → Main**
3. Find the **Webhooks** block
4. Paste URL: `https://domain.com/dv/webhook`
5. Enable confirmed payment
6. Click **Save**

---



### Payment flow

```text
1. Customer clicks "Pay"
2. Your site creates a payment in DV.net and sends the link to the customer
3. Customer opens pay_url and pays
4. DV.net sends a webhook to your site notifying you of the payment status
5. You verify the signature and credit the order
6. Respond with {"success": true}
```

---



### 1) cURL



#### Step 1. Create a payment

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### Step 2. Take `pay_url` from the response

Send this link to the customer.

#### Additionally:

Get the list of currencies:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: YOUR_API_KEY'
```

Get the current rate:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: YOUR_API_KEY'
```

---



### 2) Python



#### Step 1. Install the library

```bash
pip install dv-net-client
```



#### Step 2. Create a payment

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="YOUR_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # send to the customer
```



#### Step 3. Receive webhook

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "YOUR_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. Verify the signature
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. If payment is confirmed — credit the order
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. Do not credit twice
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"Payment from {user_id}: {amount} USD")
            # save the order / balance here

    # 4. Always respond like this
    return jsonify({"success": True})
```

---



### 3) PHP



#### Step 1. Install the library

```bash
composer require dv-net/dv-net-php-client
```



#### Step 2. Create a payment

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: 'YOUR_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // send to the customer
```



#### Step 3. Receive webhook (`/dv/webhook`)

```php
<?php
$secret = 'YOUR_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. Verify the signature
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. If payment is confirmed — credit the order
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. Check in the DB that $uniq was not processed before
    // Credit the order to user $userId
}

// 4. Always respond like this
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### Step 1. Install the library

```bash
npm install @dv-net/js-client express
```



#### Step 2. Create a payment

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "YOUR_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // send to the customer
```



#### Step 3. Receive webhook

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "YOUR_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. Verify the signature
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. If payment is confirmed — credit the order
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. Do not credit twice
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`Payment from ${userId}: ${amount} USD`);
      // save the order / balance here
    }
  }

  // 4. Always respond like this
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### Step 1. Install the plugin

1. Download [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **Plugins → Add New → Upload**
3. **Activate**



#### Step 2. Enter settings

1. **WooCommerce → Settings → Payments → DV.net**
2. Enable the payment method
3. Enter:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `YOUR_API_KEY`
  - API Secret: `YOUR_SECRET_KEY`
4. Save



#### Step 3. Set the webhook in [DV.net](http://DV.net)

Enter the callback URL from the plugin settings.

#### Step 4. Verify

Place a test order and complete payment.

---



### 6) OpenCart



#### Step 1. Install the module

1. Download [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`)
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### Step 2. Enter settings

1. Open Edit for DV.net Gateway
2. Enter:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `YOUR_API_KEY`
  - API Secret: `YOUR_SECRET_KEY`
3. Status: Enabled
4. Save



#### Step 3. Set the webhook in [DV.net](http://DV.net)

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### Step 4. Verify

Place a test order.

---



### Webhooks in brief

1. Always respond with:

```json
{"success": true}
```

1. Signature:

```text
SHA256(request_body + Secret_key) = X-Sign header
```

1. To avoid crediting twice, remember:

```text
tx_hash + bc_uniq_key
```

1. Event types:


| Type                               | What to do          |
| ---------------------------------- | ------------------- |
| `PaymentReceived`                  | Credit the payment  |
| `PaymentNotConfirmed`              | Wait                |
| `WithdrawalFromProcessingReceived` | Withdrawal complete |


---



### Demo examples:


| What              | Link                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce       | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js        | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Express demo code | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| Form without API  | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |


