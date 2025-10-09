# Vinculación de nombres de dominio

## Cloudflare

Simplemente añade el proxy del dominio a la dirección IP de tu servidor

## Nginx

- Instala y configura Nginx.
- Obtén un certificado SSL para tu dominio principal (por ejemplo, con `certbot`).
- Asegúrate de que tu sitio esté accesible en `https://tu_dominio`.

## Configuración y reinicio del comerciante

- Abre el archivo de configuración del comerciante:

  ```bash
  nano /home/dv/merchant/configs/config.yaml
  ```

- Añade (o modifica) las siguientes líneas:

  ```yaml
  http:
    port: "8080"
  ```

- Guarda los cambios y reinicia el backend:

  ```bash
  sudo systemctl restart dv-merchant
  ```

## Configuración de Nginx para un subdominio

- Crea un archivo de configuración de Nginx para el subdominio:

  ```bash
  nano /etc/nginx/conf.d/{tu_dominio o subdominio}.conf
  ```

- Pega el siguiente bloque (ajusta el puerto en `proxy_pass` si es necesario):

  ```nginx
  server {
      listen 80;
      server_name {tu_dominio};

      client_max_body_size 128M;

      access_log  /var/log/nginx/{tu_dominio}.access.log;
      error_log   /var/log/nginx/{tu_dominio}.error.log;

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

- Guarda los cambios y vuelve a cargar Nginx:

  ```bash
  sudo nginx -s reload
  ```

## Configuración de DNS

- En la configuración DNS de tu hosting (o registrador de dominio), vincula el subdominio `{tu_dominio o subdominio}` a la dirección IP de tu servidor. Por ejemplo, con un registro A:

  ```
  {tu_dominio o subdominio}    A     IP_de_tu_servidor
  ```

##  Emisión de certificado SSL para el subdominio

- Cuando el registro DNS se actualice y apunte al servidor, emite el certificado:

  ```bash
  sudo certbot --nginx -d {tu_dominio o subdominio}
  ```

## Verificación de estado y configuración final

- Asegúrate de que el backend se haya iniciado correctamente:

  ```bash
  systemctl status dv-merchant
  ```

- Ve a `http://{tu_dominio o subdominio}` (o `https://{tu_dominio o subdominio}` si el certificado se emitió correctamente) y continúa la configuración del comerciante en el navegador.