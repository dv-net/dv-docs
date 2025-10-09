# Domainnamen-Verknüpfung

## Cloudflare

Fügen Sie einfach die Domain-Proxy-Weiterleitung zur IP-Adresse Ihres Servers hinzu.

## Nginx

- Installieren und konfigurieren Sie Nginx.
- Besorgen Sie ein SSL-Zertifikat für Ihre Hauptdomain (z. B. mit `certbot`).
- Stellen Sie sicher, dass Ihre Website unter `https://ihre_domain` erreichbar ist.

## Merchant-Konfiguration und Neustart

- Öffnen Sie die Merchant-Konfigurationsdatei:

  ```bash
  nano /home/dv/merchant/configs/config.yaml
  ```

- Fügen Sie die folgenden Zeilen hinzu (oder ändern Sie sie):

  ```yaml
  http:
    port: "8080"
  ```

- Speichern Sie die Änderungen und starten Sie das Backend neu:

  ```bash
  sudo systemctl restart dv-merchant
  ```

## Nginx-Konfiguration für eine Subdomain

- Erstellen Sie eine Nginx-Konfigurationsdatei für die Subdomain:

  ```bash
  nano /etc/nginx/conf.d/{ihre_domain oder subdomain}.conf
  ```

- Fügen Sie den folgenden Block ein (passen Sie bei Bedarf den Port in `proxy_pass` an):

  ```nginx
  server {
      listen 80;
      server_name {ihre_domain};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{ihre_domain}.access.log;
      error_log   /var/log/nginx/{ihre_domain}.error.log;

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

- Speichern Sie die Änderungen und starten Sie Nginx neu:

  ```bash
  sudo nginx -s reload
  ```

## DNS-Konfiguration

- Verknüpfen Sie in den DNS-Einstellungen Ihres Hostings (oder Domain-Registrars) die Subdomain
  `{ihre_domain oder subdomain}` mit der IP-Adresse Ihres Servers. Zum Beispiel mit einem A-Record:

  ```
  {ihre_domain oder subdomain}    A     Ihre_Server_IP
  ```

## SSL-Zertifikat für die Subdomain ausstellen

- Sobald der DNS-Eintrag aktualisiert wurde und auf den Server zeigt, stellen Sie ein Zertifikat aus:

  ```bash
  sudo certbot --nginx -d {ihre_domain oder subdomain}
  ```

## Statusprüfung und finale Konfiguration

- Stellen Sie sicher, dass das Backend erfolgreich gestartet wurde:

  ```bash
  systemctl status dv-merchant
  ```

- Gehen Sie zu `http://{ihre_domain oder subdomain}` (oder `https://{ihre_domain oder subdomain}`, wenn das Zertifikat
  korrekt ausgestellt wurde) und setzen Sie die Merchant-Konfiguration im Browser fort.