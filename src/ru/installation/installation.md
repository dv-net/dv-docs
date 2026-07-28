# Инструкция по установке и настройке мерчанта [dv.net](http://dv.net)

## Установка

Установите мерчант с помощью предоставленного скрипта:

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

Учтите, что если у вас на сервере стоит Firewall, то вам необходимо добавить в исключения порты **80** и **443**.

### Проверка наличия и состояния firewall

#### Ubuntu / Debian

**UFW** (чаще всего используется):

```bash
# Проверить, установлен ли ufw
command -v ufw && ufw --version

# Статус firewall
sudo ufw status verbose

# Проверить, активен ли сервис
systemctl is-active ufw
```

**firewalld** (реже, но возможен):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (если ufw и firewalld не используются):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (стандарт для CentOS):

```bash
# Проверить, установлен ли firewalld
command -v firewall-cmd && firewall-cmd --version

# Статус и состояние
sudo systemctl status firewalld
sudo firewall-cmd --state

# Список открытых портов
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (если установлен вручную):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### Открытие портов (если firewall активен)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / иногда Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## Привязка доменных имён

> В примерах: сайт — `domain.com`, мерчант — `pay.domain.com`.

Два варианта:

1. **Cloudflare** — самый простой: включили прокси, HTTPS появляется сразу.
2. **Nginx + Let's Encrypt** — если Cloudflare нет.

---



### Вариант 1. Cloudflare (рекомендуется)

Мерчант после установки уже слушает порт **80**. Cloudflare сам выдаёт HTTPS для пользователя.

#### Шаг 1. Откройте порты 80 и 443

См. раздел [Установка → Открытие портов](#открытие-портов-если-firewall-активен).

#### Шаг 2. Добавьте DNS-запись

Cloudflare → ваш домен → **DNS** → создайте A-запись:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (или нужный поддомен) | `IP_вашего_сервера` | **Proxied** (оранжевое облако) |




#### Шаг 3. Режим SSL

Cloudflare → **SSL/TLS** → режим **Flexible**.

#### Шаг 4. Проверка

Подождите пару минут и откройте:

```text
https://pay.domain.com
```

Должна открыться страница мерчанта. Дальше настраивайте в браузере.

---



### Вариант 2. Nginx + Let's Encrypt

Если Cloudflare не используете — SSL выпускаете сами на сервере.

#### Шаг 1. Откройте порты 80 и 443

См. раздел [Установка → Открытие портов](#открытие-портов-если-firewall-активен).

#### Шаг 2. DNS

В панели регистратора создайте A-запись:

```text
pay.domain.com    A     IP_вашего_сервера
```

Проверьте, что DNS уже указывает на сервер:

```bash
dig +short pay.domain.com
```



#### Шаг 3. Установите Nginx и Certbot

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



#### Шаг 4. Переведите мерчант на порт 8080

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



#### Шаг 5. Конфиг Nginx

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



#### Шаг 6. Выпустите сертификат

```bash
sudo certbot --nginx -d pay.domain.com
```



#### Шаг 7. Проверка

Откройте:

```text
https://pay.domain.com
```

и продолжите настройку мерчанта.

## Первоначальная настройка в браузере

После установки и привязки домена откройте адрес мерчанта:

```text
https://pay.domain.com/
```

Система сама перенаправит в панель (`/dv-admin/`) и покажет мастер установки.

---



### Шаг 1. Проверка системы

Экран: **«Добро пожаловать в проект DaVinci»**.

Должны быть зелёные галочки:

- **PostgreSQL**
- **Redis**

Нажмите **«Далее»**.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Проверка системы</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Проверка системы\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="Проверка системы" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Шаг 2. Создание администратора системы

Экран: **«Создать администратора системы»**.

Заполните:


| Поле                  | Требование          |
| --------------------- | ------------------- |
| Email                 | Валидный email      |
| Password              | от 8 до 32 символов |
| Password confirmation | совпадает с паролем |


Нажмите **«Далее»**.

> Это root-пользователь. Сохраните логин и пароль в надёжном месте.  
> Создаётся только один раз при первой установке.

После регистрации система автоматически инициализирует процессинг (связка merchant ↔ processing).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Создание администратора системы</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Создание администратора системы\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="Создание администратора системы" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Шаг 3. Генерация и подтверждение seed-фразы

Экран: **«Generate seed phrase» / генерация мнемоники**.

1. Выберите длину фразы: **12** или **24** слова (по умолчанию 24).
2. Нажмите **«Generate mnemonics»**, если нужно перегенерировать.
3. Нажмите **«Show»**, чтобы увидеть слова.
4. **Скопируйте и сохраните фразу офлайн** (бумага / менеджер паролей / офлайн-хранилище).
5. Нажмите **«Confirm»**.

> Seed-фраза — мастер-ключ всех кошельков мерчанта. Кто ею владеет — владеет средствами.  
> Без неё восстановление доступа к кошелькам невозможно.

После подтверждения откроется **Quick start**.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Генерация seed-фразы</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Генерация seed-фразы\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="Генерация seed-фразы" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Шаг 4. Быстрый старт :



#### 4.1. URL проекта

Укажите URL вашего сайта/проекта в формате `https://domain.com` и нажмите **«Save».**

#### 4.2. Webhook и API

1. Укажите URL вебхука (куда DV.net будет слать уведомления об оплатах).
2. Скопируйте **API key** — его нужно передавать в заголовке `x-api-key`.
3. Скопируйте секретный ключ, использующийся для проверки подлинности вебхуков.



#### 4.3. Пополнение processing-кошельков

На экране будут адреса processing-кошельков по сетям.

Их нужно пополнить позже — с них оплачиваются комиссии сети при переводах с горячих кошельков клиентов.

Нажмите **«Next»** / **«Finish»**, либо **«Skip and set up later»**, если настроите позже.

После завершения откроется дашборд мерчанта.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Быстрый старт</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Быстрый старт\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="Быстрый старт" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## Настройка проекта — пошагово:

Настройка уже установленного мерчанта на тестовом домене:

```text
https://pay.domain.com/
```

---



### Часть 1. Войти в панель

1. Откройте браузер (Chrome / Safari / Firefox).
2. В адресной строке введите:

```text
https://pay.domain.com/
```

1. Нажмите Enter.
2. Если откроется вход — введите **email** и **пароль** администратора (которые создавали при установке).
3. Нажмите кнопку входа.

Вы должны попасть в панель управления DV.net.

---



### Часть 2. Создать магазин (проект)

1. В левом меню найдите пункт **«Projects»** / **«Проекты»**.
2. Нажмите на него.
3. Справа вверху нажмите кнопку **«Create a store»** / **«Создать магазин»**.
4. Заполните поля:


| Поле                | Что писать                                 | Пример               |
| ------------------- | ------------------------------------------ | -------------------- |
| **Name** / Название | Как называется ваш магазин                 | `Тестовый магазин`   |
| **Site** / Сайт     | Ссылка на ваш сайт (можно оставить пустым) | `https://domain.com` |


1. Нажмите **«Create a project»** / **«Создать проект»**.
2. Дождитесь сообщения, что магазин создан.
3. Вы вернётесь в список проектов — там появится ваш магазин.

> Если магазин уже создался на этапе Quick start — новый создавать не обязательно. Просто откройте существующий через **Edit**.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Создание магазина</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Создание магазина\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="Создание магазина" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 3. Открыть настройки магазина

1. В списке **Projects** найдите ваш магазин.
2. Справа в строке нажмите **«Edit»** / **«Редактировать»**.
3. Откроется страница магазина с двумя вкладками сверху:
  - **Main** — ключи API и вебхуки
  - **Advanced settings** — валюты, сайт, форма оплаты

Сначала настроим **Main**, потом **Advanced settings**.

---



### Часть 4. Получить API key и Secret key

На вкладке **Main**:

#### 4.1. API key

1. Найдите блок **«Your API key»** / **«Ваш API ключ»**.
2. Если ключа ещё нет — нажмите кнопку создания / **Generate**.
3. Нажмите иконку копирования рядом с ключом.
4. Сохраните ключ.

Этот ключ потребуется вам для вставки в заголовок запросов:

```text
x-api-key: ВАШ_КЛЮЧ
```



#### 4.2. Secret key (для проверки вебхуков)

1. В том же разделе найдите **Secret key**.
2. Нажмите **«Generate new»** / **«Сгенерировать»**, если ключа нет.
3. Нажмите **«Show»**, чтобы увидеть его.
4. Скопируйте и сохраните рядом с API key.

> Secret key нужен, чтобы ваш сайт проверял: «это уведомление точно от DV.net, а не от мошенника».

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key и Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key и Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key и Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 5. Настроить вебхуки

Вебхук — это «звонок» от DV.net на ваш сайт, когда клиент заплатил.

1. На вкладке **Main** найдите блок **«Webhooks»**.
2. В поле URL вставьте адрес вашего обработчика, например:

```text
https://domain.com/api/dv-webhook
```

> Пока своего обработчика нет — можно временно пропустить этот шаг и вернуться позже. Без вебхука оплата работать может, но магазин сам не узнает, что деньги пришли.

1. Включите нужные события, минимум:
  - WebHook об успешном платеже (**WebHook on successful payment**)
2. Нажмите **«Create»** или **«Save»**.
3. Нажмите **«Test»**, проверьте, что ваш сервер отвечает.

Повторите для других событий, если нужно (неподтверждённый платёж, вывод с процессингового кошелька).

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Настройка вебхуков</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Настройка вебхуков\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="Настройка вебхуков" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 6. Включить валюты и базовые настройки магазина

1. Перейдите на вкладку **«Advanced settings»** / **«Расширенные настройки»**.
2. В блоке **General**:
  - проверьте **название** магазина;
  - укажите **Project website** (сайт проекта), если ещё не указан.
3. В блоке **Accepted currencies** / **Принимаемые валюты**:
  - нажмите на нужные монеты (например USDT Tron, BTC, ETH);
  - или нажмите **«Select all»**, если нужны все.
4. В блоке **Payment form settings**:
  - **Minimal payment** — минимальная сумма (не меньше `$0.1`);
  - при желании укажите **success_url** и **return_url** (куда вернуть клиента после оплаты).
5. Внизу нажмите **«Save»** / **«Сохранить»**.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Расширенные настройки магазина</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Расширенные настройки магазина\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="Расширенные настройки магазина" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 7. Ссылка на оплату (готовая форма)

В **Advanced settings** будет шаблон ссылки вида:

```text
https://pay.domain.com/pay/store/ID_МАГАЗИНА/<ваш_client_ID>
```

Где:

- `ID_МАГАЗИНА` — уже подставлен системой;
- `<ваш_client_ID>` — замените на ID клиента в вашей системе (например `user_15`).

Пример:

```text
https://pay.domain.com/pay/store/ВАШ_STORE_UUID/user_15
```

Эту ссылку можно открыть в браузере — откроется платёжная форма DV.net.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Ссылка на оплату</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Ссылка на оплату\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="Ссылка на оплату" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 8. Создать тестовый платёж из панели:

1. Вернитесь в **Projects**.
2. В строке магазина нажмите **«Create payment»** / **«Создать платёж»**.
3. В окне заполните:
  - **Amount** — сумма в долларах, например `5`;
  - **Email** — можно оставить пустым;
  - **External ID** — ID клиента (или оставьте автогенерацию);
  - **Currency** — валюту оплаты (если спрашивает).
4. Нажмите **«Create payment»**.
5. Скопируйте появившуюся **ссылку на оплату**.
6. Откройте её в новой вкладке — должна открыться страница оплаты.

Так вы проверяете, что магазин живой.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Создание тестового платежа</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Создание тестового платежа\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="Создание тестового платежа" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 9. Подключить магазин через API

Когда ключи уже есть:

**Адрес API:**

```text
https://pay.domain.com
```

**Создать счёт / кошелёк для оплаты:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: ВАШ_API_КЛЮЧ' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

В ответе будет поле `**pay_url**` — его отправляют клиенту.

---



### Часть 10. Пополнить processing-кошельки

1. В левом меню откройте **Dashboard** / **Дашборд**.
2. Найдите блок processing-кошельков (по сетям: Tron, Ethereum и т.д.).
3. Скопируйте адрес нужной сети.
4. Отправьте на него немного крипты той же сети (для комиссий).

Без этого приём платежей может работать, а вот переводы/выводы с горячих кошельков — упираться в нехватку газа/комиссии.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Processing-кошельки</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Processing-кошельки\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="Processing-кошельки" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Часть 11. Чек-лист «всё готово»

Отметьте галочками:

- [ ] Вошли на `https://pay.domain.com/`
- [ ] Создали магазин (проект)
- [ ] Скопировали **API key**
- [ ] Скопировали **Secret key**
- [ ] Сохранили seed-фразу администратора (ещё на этапе установки)
- [ ] Включили нужные валюты
- [ ] Настроили вебхук (или отложили осознанно)
- [ ] Создали тестовый платёж и открыли `pay_url`
- [ ] При необходимости пополнили processing-кошельки

Если все пункты сделаны — магазин готов к тестовой интеграции.

---



### Частые проблемы (простыми словами)


| Проблема                     | Что сделать                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Не открывается сайт          | Проверьте, что домен `pay.domain.com` указывает на сервер, порты 80/443 открыты |
| Нет кнопки создать магазин   | Вы не вошли под администратором — выйдите и войдите снова                       |
| Нет API key                  | Откройте проект → **Edit** → **Main** → Generate                                |
| Ссылка оплаты не открывается | Проверьте, что скопировали её целиком; валюты магазина включены                 |
| Вебхук не приходит           | URL должен быть доступен из интернета (не localhost); проверьте Test в панели   |
| Забыли пароль админа         | Восстановление через CLI на сервере: `dv-merchant users` (нужен доступ по SSH)  |


---



## Примеры интеграций

Сценарии:

1. Создать оплату на **10 USD** для клиента `user_123`
2. Получить ссылку `pay_url` и отдать клиенту
3. Принять вебхук, проверить подпись, ответить `{"success": true}`

Перед началом подставьте свои значения:


| Что            | Куда смотреть          | Пример                   |
| -------------- | ---------------------- | ------------------------ |
| Адрес мерчанта | ваш домен оплаты       | `https://pay.domain.com` |
| API key        | Projects → Edit → Main | `ВАШ_API_KEY`            |
| Secret key     | там же                 | `ВАШ_SECRET_KEY`         |
| ID магазина    | Advanced settings      | `ВАШ_STORE_UUID`         |
| Ваш сайт       | сайт магазина          | `https://domain.com`     |




### Сначала настройте вебхук в панели (один раз)

1. Откройте `https://pay.domain.com`
2. Зайдите: **Projects → ваш магазин → Edit → Main**
3. Найдите блок **Webhooks**
4. Вставьте URL: `https://domain.com/dv/webhook`
5. Включите подтверждённый платёж
6. Нажмите **Save**

---



### Схема оплаты

```text
1. Клиент нажимает «Оплатить»
2. Ваш сайт создаёт оплату в DV.net и отдает ссылку клиенту
3. Клиент открывает pay_url и платит
4. DV.net присылает вебхук на ваш сайт, уведомляя Вас о статусе платежа
5. Вы проверяете подпись и зачисляете заказ
6. Отвечаете {"success": true}
```

---



### 1) cURL



#### Шаг 1. Создать оплату

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: ВАШ_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### Шаг 2. Взять `pay_url` из ответа

Эту ссылку отправьте клиенту.

#### Дополнительно:

Получить писок валют:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: ВАШ_API_KEY'
```

Получить актуальный курс:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: ВАШ_API_KEY'
```

---



### 2) Python



#### Шаг 1. Установить библиотеку

```bash
pip install dv-net-client
```



#### Шаг 2. Создать оплату

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="ВАШ_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # отправьте клиенту
```



#### Шаг 3. Принять вебхук

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "ВАШ_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. Проверить подпись
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. Если платёж подтверждён — зачислить
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. Не зачислять повторно
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"Оплата от {user_id}: {amount} USD")
            # тут сохраняете заказ / баланс

    # 4. Всегда отвечайте так
    return jsonify({"success": True})
```

---



### 3) PHP



#### Шаг 1. Установить библиотеку

```bash
composer require dv-net/dv-net-php-client
```



#### Шаг 2. Создать оплату

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: 'ВАШ_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // отправьте клиенту
```



#### Шаг 3. Принять вебхук (`/dv/webhook`)

```php
<?php
$secret = 'ВАШ_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. Проверить подпись
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. Если платёж подтверждён — зачислить
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. Проверьте в БД, что $uniq ещё не был
    // Зачислите заказ пользователю $userId
}

// 4. Всегда отвечайте так
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### Шаг 1. Установить библиотеку

```bash
npm install @dv-net/js-client express
```



#### Шаг 2. Создать оплату

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "ВАШ_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // отправьте клиенту
```



#### Шаг 3. Принять вебхук

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "ВАШ_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. Проверить подпись
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. Если платёж подтверждён — зачислить
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. Не зачислять повторно
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`Оплата от ${userId}: ${amount} USD`);
      // тут сохраняете заказ / баланс
    }
  }

  // 4. Всегда отвечайте так
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### Шаг 1. Установить плагин

1. Скачайте [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **Плагины → Добавить → Загрузить**
3. **Активировать**



#### Шаг 2. Вписать настройки

1. **WooCommerce → Настройки → Платежи → DV.net**
2. Включите оплату
3. Укажите:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `ВАШ_API_KEY`
  - API Secret: `ВАШ_SECRET_KEY`
4. Сохраните



#### Шаг 3. Прописать вебхук в [DV.net](http://DV.net)

Укажите callback URL из настроек плагина.

#### Шаг 4. Проверить

Сделайте тестовый заказ и оплатите.

---



### 6) OpenCart



#### Шаг 1. Установить модуль

1. Скачайте [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`)
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### Шаг 2. Вписать настройки

1. Откройте Edit у DV.net Gateway
2. Укажите:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `ВАШ_API_KEY`
  - API Secret: `ВАШ_SECRET_KEY`
3. Status: Enabled
4. Сохраните



#### Шаг 3. Прописать вебхук в [DV.net](http://DV.net)

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### Шаг 4. Проверить

Сделайте тестовый заказ.

---



### Коротко про вебхуки

1. Всегда отвечайте:

```json
{"success": true}
```

1. Подпись:

```text
SHA256(тело_запроса + Secret_key) = заголовок X-Sign
```

1. Чтобы не зачислить дважды, запоминайте:

```text
tx_hash + bc_uniq_key
```

1. Типы событий:


| Тип                                | Что делать       |
| ---------------------------------- | ---------------- |
| `PaymentReceived`                  | Зачислять оплату |
| `PaymentNotConfirmed`              | Подождать        |
| `WithdrawalFromProcessingReceived` | Вывод завершён   |


---



### Демо-примеры:


| Что              | Ссылка                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce      | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js       | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Код Express-демо | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| Форма без API    | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |


