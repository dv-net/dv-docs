# Ocultar el Panel de Administración del Servidor del Comerciante

Esta guía describe cómo configurar **Nginx** para segmentar el acceso al **Panel de Administración** ($/dv-admin/$), el
**Formulario de Pago** ($/pay/$) y la **API** ($/api/v1/*$) de la aplicación **dv-merchant**. Esto mejora la seguridad
al restringir el acceso a rutas confidenciales y proporcionar distintos dominios para diferentes funciones.

## 1. Descripción general de rutas de dv-merchant

La aplicación de servidor **dv-merchant** sirve tanto el frontend como la API para varios componentes, utilizando los siguientes
grupos de rutas:

* **/pay/**: Carga el JS y el frontend del **Formulario de Pago**.
* **/dv-admin/**: Carga el JS y el frontend del **Panel de Administración**.
* **/api/v1/public**: Métodos de API **pública** usados por el **Formulario de Pago**.
* **/api/v1/external**: Métodos de API para la **integración con la tienda** (p. ej., crear una factura).
* **/api/v1/dv-admin**: Métodos de API para el **Panel de Administración**.

## 2. Preparación preliminar

### 2.1. Instalación de Nginx

Instale **Nginx** en su servidor. Las instrucciones dependen de su sistema operativo (p. ej.,
`sudo apt update && sudo apt install nginx` para Debian/Ubuntu).

### 2.2. Cambiar el puerto de dv-merchant

Para operar a través de Nginx como proxy inverso, cambie **dv-merchant** a un puerto local (p. ej., **8080**) que no sea accesible externamente.

Edite el archivo de configuración:
`nano /home/dv/merchant/configs/config.yaml`

En la sección `'http'`, establezca el nuevo puerto:

```yaml
http:
  port: "8080"
```

### 2.3. Actualizar la dirección de Callback

Debe actualizar la **Callback URL** desde el sistema de procesamiento hacia el servidor del comerciante en la configuración del sistema para que
apunte a la dirección externa configurada para el Formulario de Pago (p. ej., `https://pay.some-domain.com`).

## 3. Configuración de Nginx

Crearemos **tres archivos de configuración de Nginx** (hosts virtuales) por separado, cada uno responsable de su propio dominio/subdominio
y con sus propias reglas de acceso.

Importante: Se recomienda **HTTPS/SSL** para todas las configuraciones (p. ej., usando **Certbot**), pero los ejemplos a continuación usan
HTTP (puerto 80) por simplicidad.

### 3.1. Configuración para el Formulario de Pago (`pay.some-domain.com`)

Este host debe proporcionar acceso al Formulario de Pago y a su API pública. Todas las rutas relacionadas con administración o la API externa deben
ser **bloqueadas** o **redireccionadas**.

Cree el archivo `/etc/nginx/conf.d/pay.some-domain.com.conf`:

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

### 3.2. Configuración para la API de la tienda externa (`integration.some-domain.com`)

Este host debe ser accesible **solo** desde las direcciones IP de su tienda para la interacción con la API (p. ej., crear una factura).

Cree el archivo `/etc/nginx/conf.d/integration.some-domain.com.conf`:

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

### 3.3. Configuración para el Panel de Administración (`panel.some-domain.com`)

Este host debe proporcionar acceso a todo lo relacionado con la administración y ser accesible **solo desde direcciones IP de confianza**.

Cree el archivo `/etc/nginx/conf.d/panel.some-domain.com.conf`:

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

## 4. Finalizar la configuración

Después de crear todos los archivos de configuración:

1.  Pruebe la configuración de Nginx:
    ```bash
    sudo nginx -t
    ```
    Asegúrese de que no haya errores de sintaxis.
2.  Reinicie Nginx:
    ```bash
    sudo systemctl restart nginx
    ```
3.  Verifique el DNS: Asegúrese de que los tres dominios (`pay.some-domain.com`, `integration.some-domain.com` y
4. `panel.some-domain.com`) apunten a la dirección IP de su servidor.

El Panel de Administración (rutas $/dv-admin/*$ y $/api/v1/dv-admin/*$) ahora está **oculto** y accesible solo mediante el
dominio `panel.some-domain.com` desde un conjunto limitado de direcciones IP, mientras que el Formulario de Pago y la API Externa tienen
acceso claramente segregado y restringido.