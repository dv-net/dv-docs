# Привязка доменных имён

## Cloudflare

Просто добавьте проксирование домена на IP адрес вашего сервера

## Nginx

- Установите и настройте Nginx.
- Получите SSL-сертификат для вашего основного домена (например, с помощью `certbot`).
- Убедитесь, что ваш сайт доступен по адресу `https://ваш_домен`.

## Настройка и перезапуск мерчанта

- Откройте файл конфигурации мерчанта:

  ```bash
  nano /home/dv/merchant/configs/config.yaml
  ```

- Добавьте (или измените) следующие строки:

  ```yaml
  http:
    port: "8080"
  ```

- Сохраните изменения и перезапустите бэкенд:

  ```bash
  sudo systemctl restart dv-merchant
  ```

## Настройка Nginx для поддомена

- Создайте файл конфигурации Nginx для поддомена:

  ```bash
  nano /etc/nginx/conf.d/{ваш_домен или поддомен}.conf
  ```

- Вставьте в него следующий блок (при необходимости корректируйте порт в `proxy_pass`):

  ```nginx
  server {
      listen 80;
      server_name {ваш_домен};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{ваш_домен}.access.log;
      error_log   /var/log/nginx/{ваш_домен}.error.log;

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

- Сохраните изменения и перезапустите Nginx:

  ```bash
  sudo nginx -s reload
  ```

## Настройка DNS

- В настройках DNS вашего хостинга (или регистратора домена) привяжите поддомен `{ваш_домен или поддомен}` к IP-адресу вашего сервера. Например, с помощью A-записи:

  ```
  {ваш_домен или поддомен}    A     IP_вашего_сервера
  ```

## Выпуск SSL-сертификата для поддомена

- Когда DNS-запись обновится и будет указывать на сервер, выпустите сертификат:

  ```bash
  sudo certbot --nginx -d {ваш_домен или поддомен}
  ```

## Проверка статуса и финальная настройка

- Убедитесь, что бэкенд успешно запущен:

  ```bash
  systemctl status dv-merchant
  ```

- Перейдите по адресу `http://{ваш_домен или поддомен}` (или `https://{ваш_домен или поддомен}`, если сертификат корректно выпущен) и продолжите настройку мерчанта в браузере.
