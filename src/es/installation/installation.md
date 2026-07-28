# Instrucciones de instalación y configuración del comerciante [dv.net](http://dv.net)

## Instalación

Instale el comerciante con el script proporcionado:

```bash
sudo bash -c "$(curl -fsSL https://dv.net/install.sh)"
```

Tenga en cuenta que, si tiene un firewall en su servidor, debe añadir los puertos **80** y **443** a las excepciones.

### Comprobar la presencia y el estado del firewall

#### Ubuntu / Debian

**UFW** (el más utilizado):

```bash
# Comprobar si ufw está instalado
command -v ufw && ufw --version

# Estado del firewall
sudo ufw status verbose

# Comprobar si el servicio está activo
systemctl is-active ufw
```

**firewalld** (menos frecuente, pero posible):

```bash
command -v firewall-cmd && firewall-cmd --version
sudo systemctl status firewalld
sudo firewall-cmd --state
```

**iptables / nftables** (si no se utilizan ufw ni firewalld):

```bash
command -v iptables && sudo iptables -L -n -v
command -v nft && sudo nft list ruleset
```



#### CentOS

**firewalld** (estándar en CentOS):

```bash
# Comprobar si firewalld está instalado
command -v firewall-cmd && firewall-cmd --version

# Estado y condición
sudo systemctl status firewalld
sudo firewall-cmd --state

# Lista de puertos abiertos
sudo firewall-cmd --list-ports
sudo firewall-cmd --list-services
```

**UFW** (si se instaló manualmente):

```bash
command -v ufw && ufw --version
sudo ufw status verbose
```



#### Abrir puertos (si el firewall está activo)

**UFW (Ubuntu / Debian):**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS / a veces Debian/Ubuntu):**

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```



## Vinculación de nombres de dominio

> En los ejemplos: el sitio es `domain.com`, el comerciante es `pay.domain.com`.

Dos opciones:

1. **Cloudflare** — la más sencilla: active el proxy y HTTPS estará disponible de inmediato.
2. **Nginx + Let's Encrypt** — si no utiliza Cloudflare.

---



### Opción 1. Cloudflare (recomendado)

Tras la instalación, el comerciante ya escucha en el puerto **80**. Cloudflare proporciona HTTPS al usuario final.

#### Paso 1. Abra los puertos 80 y 443

Consulte la sección [Instalación → Abrir puertos](#abrir-puertos-si-el-firewall-está-activo).

#### Paso 2. Añada un registro DNS

Cloudflare → su dominio → **DNS** → cree un registro A:


| Type | Name                        | Content             | Proxy status                   |
| ---- | --------------------------- | ------------------- | ------------------------------ |
| A    | `pay` (o el subdominio que necesite) | `IP_DE_SU_SERVIDOR` | **Proxied** (nube naranja) |




#### Paso 3. Modo SSL

Cloudflare → **SSL/TLS** → modo **Flexible**.

#### Paso 4. Comprobación

Espere un par de minutos y abra:

```text
https://pay.domain.com
```

Debería abrirse la página del comerciante. A continuación, continúe la configuración en el navegador.

---



### Opción 2. Nginx + Let's Encrypt

Si no utiliza Cloudflare, debe emitir el certificado SSL en su propio servidor.

#### Paso 1. Abra los puertos 80 y 443

Consulte la sección [Instalación → Abrir puertos](#abrir-puertos-si-el-firewall-está-activo).

#### Paso 2. DNS

En el panel de su registrador, cree un registro A:

```text
pay.domain.com    A     IP_DE_SU_SERVIDOR
```

Compruebe que el DNS ya apunta al servidor:

```bash
dig +short pay.domain.com
```



#### Paso 3. Instale Nginx y Certbot

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



#### Paso 4. Cambie el comerciante al puerto 8080

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



#### Paso 5. Configuración de Nginx

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



#### Paso 6. Emita el certificado

```bash
sudo certbot --nginx -d pay.domain.com
```



#### Paso 7. Comprobación

Abra:

```text
https://pay.domain.com
```

y continúe la configuración del comerciante.

## Configuración inicial en el navegador

Tras la instalación y la vinculación del dominio, abra la dirección del comerciante:

```text
https://pay.domain.com/
```

El sistema le redirigirá automáticamente al panel (`/dv-admin/`) y mostrará el asistente de instalación.

---



### Paso 1. Comprobación del sistema

Pantalla: **«Bienvenido al proyecto DaVinci»**.

Deben aparecer marcas verdes en:

- **PostgreSQL**
- **Redis**

Pulse **«Siguiente»**.

<a href="../../assets/images/installation/instalation-welcome.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Comprobación del sistema</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Comprobación del sistema\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-welcome.png" alt="Comprobación del sistema" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Paso 2. Creación del administrador del sistema

Pantalla: **«Crear administrador del sistema»**.

Complete los campos:


| Campo                  | Requisito          |
| --------------------- | ------------------- |
| Email                 | Email válido      |
| Password              | de 8 a 32 caracteres |
| Password confirmation | coincide con la contraseña |


Pulse **«Siguiente»**.

> Este es el usuario root. Guarde el inicio de sesión y la contraseña en un lugar seguro.  
> Solo se crea una vez durante la primera instalación.

Tras el registro, el sistema inicializará automáticamente el processing (vinculación merchant ↔ processing).

<a href="../../assets/images/installation/instalation-create-administrator.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Creación del administrador del sistema</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Creación del administrador del sistema\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-administrator.png" alt="Creación del administrador del sistema" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Paso 3. Generación y confirmación de la frase seed

Pantalla: **«Generate seed phrase» / generación de mnemónico**.

1. Elija la longitud de la frase: **12** o **24** palabras (24 por defecto).
2. Pulse **«Generate mnemonics»** si necesita regenerarla.
3. Pulse **«Show»** para ver las palabras.
4. **Copie y guarde la frase sin conexión** (papel / gestor de contraseñas / almacenamiento offline).
5. Pulse **«Confirm»**.

> La frase seed es la clave maestra de todas las carteras del comerciante. Quien la posea controla los fondos.  
> Sin ella, no es posible recuperar el acceso a las carteras.

Tras la confirmación, se abrirá **Quick start**.

<a href="../../assets/images/installation/instalation-seed.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Generación de la frase seed</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Generación de la frase seed\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-seed.png" alt="Generación de la frase seed" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Paso 4. Inicio rápido :



#### 4.1. URL del proyecto

Indique la URL de su sitio/proyecto en el formato `https://domain.com` y pulse **«Save».**

#### 4.2. Webhook y API

1. Indique la URL del webhook (donde DV.net enviará las notificaciones de pago).
2. Copie la **API key** — debe enviarla en el encabezado `x-api-key`.
3. Copie la clave secreta que se utiliza para verificar la autenticidad de los webhooks.



#### 4.3. Recarga de las carteras de processing

En la pantalla aparecerán las direcciones de las carteras de processing por red.

Deberá recargarlas más tarde: desde ellas se pagan las comisiones de red al transferir fondos desde las carteras calientes de los clientes.

Pulse **«Next»** / **«Finish»**, o **«Skip and set up later»** si prefiere configurarlo más tarde.

Tras finalizar, se abrirá el panel del comerciante.

<a href="../../assets/images/installation/instalation-quick-start.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Inicio rápido</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Inicio rápido\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-quick-start.png" alt="Inicio rápido" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



## Configuración del proyecto — paso a paso:

Configuración del comerciante ya instalado en un dominio de prueba:

```text
https://pay.domain.com/
```

---



### Parte 1. Acceder al panel

1. Abra el navegador (Chrome / Safari / Firefox).
2. En la barra de direcciones, escriba:

```text
https://pay.domain.com/
```

1. Pulse Enter.
2. Si aparece la pantalla de inicio de sesión, introduzca el **email** y la **contraseña** del administrador (los que creó durante la instalación).
3. Pulse el botón de inicio de sesión.

Debería acceder al panel de control de DV.net.

---



### Parte 2. Crear una tienda (proyecto)

1. En el menú izquierdo, busque **«Projects»** / **«Proyectos»**.
2. Haga clic en él.
3. Arriba a la derecha, pulse **«Create a store»** / **«Crear tienda»**.
4. Complete los campos:


| Campo                | Qué escribir                                 | Ejemplo               |
| ------------------- | ------------------------------------------ | -------------------- |
| **Name** / Nombre | Nombre de su tienda                 | `Tienda de prueba`   |
| **Site** / Sitio     | Enlace a su sitio (puede dejarse vacío) | `https://domain.com` |


1. Pulse **«Create a project»** / **«Crear proyecto»**.
2. Espere el mensaje de que la tienda se ha creado.
3. Volverá a la lista de proyectos, donde aparecerá su tienda.

> Si la tienda ya se creó en la etapa de Quick start, no es obligatorio crear una nueva. Simplemente abra la existente con **Edit**.

<a href="../../assets/images/installation/instalation-create-store.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Creación de la tienda</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Creación de la tienda\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-store.png" alt="Creación de la tienda" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 3. Abrir la configuración de la tienda

1. En la lista **Projects**, busque su tienda.
2. A la derecha de la fila, pulse **«Edit»** / **«Editar»**.
3. Se abrirá la página de la tienda con dos pestañas arriba:
  - **Main** — claves API y webhooks
  - **Advanced settings** — monedas, sitio, formulario de pago

Primero configure **Main** y después **Advanced settings**.

---



### Parte 4. Obtener API key y Secret key

En la pestaña **Main**:

#### 4.1. API key

1. Busque el bloque **«Your API key»** / **«Su clave API»**.
2. Si aún no hay clave, pulse el botón de creación / **Generate**.
3. Pulse el icono de copiar junto a la clave.
4. Guarde la clave.

Esta clave la necesitará para incluirla en el encabezado de las solicitudes:

```text
x-api-key: SU_CLAVE
```



#### 4.2. Secret key (para verificar webhooks)

1. En la misma sección, busque **Secret key**.
2. Pulse **«Generate new»** / **«Generar»** si no hay clave.
3. Pulse **«Show»** para verla.
4. Cópiela y guárdela junto a la API key.

> La Secret key permite a su sitio comprobar: «esta notificación proviene realmente de DV.net, no de un estafador».

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>API key y Secret key</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'API key y Secret key\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="API key y Secret key" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 5. Configurar webhooks

Un webhook es una «llamada» de DV.net a su sitio cuando un cliente ha pagado.

1. En la pestaña **Main**, busque el bloque **«Webhooks»**.
2. En el campo URL, pegue la dirección de su controlador, por ejemplo:

```text
https://domain.com/api/dv-webhook
```

> Si aún no tiene un controlador propio, puede omitir temporalmente este paso y volver más tarde. Sin webhook, el pago puede funcionar, pero la tienda no sabrá por sí sola que el dinero ha llegado.

1. Active los eventos necesarios, como mínimo:
  - WebHook de pago exitoso (**WebHook on successful payment**)
2. Pulse **«Create»** o **«Save»**.
3. Pulse **«Test»** y compruebe que su servidor responde.

Repita para otros eventos si es necesario (pago no confirmado, retiro desde la cartera de processing).

<a href="../../assets/images/installation/instalation-api-webhook.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Configuración de webhooks</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Configuración de webhooks\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-api-webhook.png" alt="Configuración de webhooks" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 6. Activar monedas y ajustes básicos de la tienda

1. Vaya a la pestaña **«Advanced settings»** / **«Configuración avanzada»**.
2. En el bloque **General**:
  - compruebe el **nombre** de la tienda;
  - indique **Project website** (sitio del proyecto), si aún no está especificado.
3. En el bloque **Accepted currencies** / **Monedas aceptadas**:
  - haga clic en las monedas necesarias (por ejemplo USDT Tron, BTC, ETH);
  - o pulse **«Select all»** si necesita todas.
4. En el bloque **Payment form settings**:
  - **Minimal payment** — importe mínimo (no inferior a `$0.1`);
  - si lo desea, indique **success_url** y **return_url** (a dónde redirigir al cliente tras el pago).
5. Abajo, pulse **«Save»** / **«Guardar»**.

<a href="../../assets/images/installation/instalation-project-setting.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Configuración avanzada de la tienda</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Configuración avanzada de la tienda\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-project-setting.png" alt="Configuración avanzada de la tienda" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 7. Enlace de pago (formulario listo)

En **Advanced settings** habrá una plantilla de enlace del tipo:

```text
https://pay.domain.com/pay/store/ID_TIENDA/<su_client_ID>
```

Donde:

- `ID_TIENDA` — ya lo sustituye el sistema;
- `<su_client_ID>` — reemplácelo por el ID del cliente en su sistema (por ejemplo `user_15`).

Ejemplo:

```text
https://pay.domain.com/pay/store/SU_STORE_UUID/user_15
```

Este enlace se puede abrir en el navegador y se mostrará el formulario de pago de DV.net.

<a href="../../assets/images/installation/instalation-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Enlace de pago</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Enlace de pago\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-payment.png" alt="Enlace de pago" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 8. Crear un pago de prueba desde el panel:

1. Vuelva a **Projects**.
2. En la fila de la tienda, pulse **«Create payment»** / **«Crear pago»**.
3. En la ventana, complete:
  - **Amount** — importe en dólares, por ejemplo `5`;
  - **Email** — puede dejarse vacío;
  - **External ID** — ID del cliente (o deje la autogeneración);
  - **Currency** — moneda de pago (si lo solicita).
4. Pulse **«Create payment»**.
5. Copie el **enlace de pago** que aparece.
6. Ábralo en una nueva pestaña: debería abrirse la página de pago.

Así comprobará que la tienda funciona correctamente.

<a href="../../assets/images/installation/instalation-create-payment.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Creación de pago de prueba</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Creación de pago de prueba\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-create-payment.png" alt="Creación de pago de prueba" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 9. Conectar la tienda mediante API

Cuando ya tenga las claves:

**Dirección de la API:**

```text
https://pay.domain.com
```

**Crear factura / cartera para el pago:**

```bash
curl -X POST \
  'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: SU_API_KEY' \
  --data '{
    "amount": 20,
    "store_external_id": "user_123"
  }'
```

En la respuesta habrá el campo `**pay_url**` — envíelo al cliente.

---



### Parte 10. Recargar las carteras de processing

1. En el menú izquierdo, abra **Dashboard** / **Panel**.
2. Busque el bloque de carteras de processing (por red: Tron, Ethereum, etc.).
3. Copie la dirección de la red necesaria.
4. Envíe a ella una pequeña cantidad de cripto de la misma red (para comisiones).

Sin esto, la recepción de pagos puede funcionar, pero las transferencias/retiros desde las carteras calientes pueden fallar por falta de gas/comisión.

<a href="../../assets/images/installation/instalation-processing-balance.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>Carteras de processing</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'Carteras de processing\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/installation/instalation-processing-balance.png" alt="Carteras de processing" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

---



### Parte 11. Lista de comprobación «todo listo»

Marque con una casilla:

- [ ] Ha accedido a `https://pay.domain.com/`
- [ ] Ha creado una tienda (proyecto)
- [ ] Ha copiado la **API key**
- [ ] Ha copiado la **Secret key**
- [ ] Ha guardado la frase seed del administrador (ya en la etapa de instalación)
- [ ] Ha activado las monedas necesarias
- [ ] Ha configurado el webhook (o lo ha pospuesto de forma consciente)
- [ ] Ha creado un pago de prueba y abierto `pay_url`
- [ ] Si es necesario, ha recargado las carteras de processing

Si todos los puntos están completados, la tienda está lista para una integración de prueba.

---



### Problemas frecuentes (explicados de forma sencilla)


| Problema                     | Qué hacer                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| No se abre el sitio          | Compruebe que el dominio `pay.domain.com` apunta al servidor y que los puertos 80/443 están abiertos |
| No aparece el botón para crear tienda   | No ha iniciado sesión como administrador — cierre sesión e inicie de nuevo                       |
| No hay API key                  | Abra el proyecto → **Edit** → **Main** → Generate                                |
| El enlace de pago no se abre | Compruebe que lo copió completo; las monedas de la tienda están activadas                 |
| No llega el webhook           | La URL debe ser accesible desde internet (no localhost); compruebe Test en el panel   |
| Ha olvidado la contraseña de admin         | Recuperación mediante CLI en el servidor: `dv-merchant users` (se requiere acceso SSH)  |


---



## Ejemplos de integración

Escenarios:

1. Crear un pago de **10 USD** para el cliente `user_123`
2. Obtener el enlace `pay_url` y enviárselo al cliente
3. Recibir el webhook, verificar la firma y responder `{"success": true}`

Antes de empezar, sustituya sus propios valores:


| Qué            | Dónde encontrarlo          | Ejemplo                   |
| -------------- | ---------------------- | ------------------------ |
| Dirección del comerciante | su dominio de pago       | `https://pay.domain.com` |
| API key        | Projects → Edit → Main | `SU_API_KEY`            |
| Secret key     | en el mismo lugar                 | `SU_SECRET_KEY`         |
| ID de la tienda    | Advanced settings      | `SU_STORE_UUID`         |
| Su sitio       | sitio de la tienda          | `https://domain.com`     |




### Primero configure el webhook en el panel (una vez)

1. Abra `https://pay.domain.com`
2. Vaya a: **Projects → su tienda → Edit → Main**
3. Busque el bloque **Webhooks**
4. Pegue la URL: `https://domain.com/dv/webhook`
5. Active el pago confirmado
6. Pulse **Save**

---



### Esquema de pago

```text
1. El cliente hace clic en «Pagar»
2. Su sitio crea el pago en DV.net y envía el enlace al cliente
3. El cliente abre pay_url y paga
4. DV.net envía un webhook a su sitio notificándole el estado del pago
5. Usted verifica la firma y acredita el pedido
6. Responde {"success": true}
```

---



### 1) cURL



#### Paso 1. Crear el pago

```bash
curl -X POST 'https://pay.domain.com/api/v1/external/wallet' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: SU_API_KEY' \
  --data '{
    "amount": "10",
    "currency": "USD",
    "store_external_id": "user_123",
    "email": "user@domain.com"
  }'
```



#### Paso 2. Obtener `pay_url` de la respuesta

Envíe este enlace al cliente.

#### Además:

Obtener la lista de monedas:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies' \
  -H 'x-api-key: SU_API_KEY'
```

Obtener el tipo de cambio actual:

```bash
curl 'https://pay.domain.com/api/v1/external/store/currencies/USDT.Tron/rate' \
  -H 'x-api-key: SU_API_KEY'
```

---



### 2) Python



#### Paso 1. Instalar la biblioteca

```bash
pip install dv-net-client
```



#### Paso 2. Crear el pago

```python
from dv_net_client import MerchantClient

client = MerchantClient(
    host="https://pay.domain.com",
    x_api_key="SU_API_KEY",
)

wallet = client.get_external_wallet(
    store_external_id="user_123",
    amount="10",
    currency="USD",
    email="user@domain.com",
)

print(wallet.pay_url)  # enviar al cliente
```



#### Paso 3. Recibir el webhook

```python
from flask import Flask, request, jsonify
from dv_net_client.utils import MerchantUtilsManager
from dv_net_client.mappers import WebhookMapper
from dv_net_client.dto.webhook import ConfirmedWebhookResponse

app = Flask(__name__)
utils = MerchantUtilsManager()
mapper = WebhookMapper()

SECRET = "SU_SECRET_KEY"
already_done = set() 

@app.post("/dv/webhook")
def webhook():
    raw = request.get_data(as_text=True)
    sign = request.headers.get("X-Sign", "")

    # 1. Verificar la firma
    if not utils.check_sign(sign, SECRET, raw):
        return "invalid signature", 403

    webhook = mapper.map_webhook(request.get_json(force=True))

    # 2. Si el pago está confirmado — acreditar
    if isinstance(webhook, ConfirmedWebhookResponse) and webhook.status == "completed":
        user_id = webhook.wallet.store_external_id
        amount = webhook.transactions.amount_usd
        uniq = f"{webhook.transactions.tx_hash}:{webhook.transactions.bc_uniq_key}"

        # 3. No acreditar dos veces
        if uniq not in already_done:
            already_done.add(uniq)
            print(f"Pago de {user_id}: {amount} USD")
            # aquí guarda el pedido / saldo

    # 4. Responder siempre así
    return jsonify({"success": True})
```

---



### 3) PHP



#### Paso 1. Instalar la biblioteca

```bash
composer require dv-net/dv-net-php-client
```



#### Paso 2. Crear el pago

```php
<?php
require 'vendor/autoload.php';

use DvNet\DvNetClient\MerchantClient;
use DvNet\DvNetClient\SimpleHttpClient;

$client = new MerchantClient(
    httpClient: new SimpleHttpClient(),
    host: 'https://pay.domain.com',
    xApiKey: 'SU_API_KEY'
);

$wallet = $client->getExternalWallet(
    storeExternalId: 'user_123',
    amount: '10',
    currency: 'USD',
    email: 'user@domain.com'
);

echo $wallet->payUrl; // enviar al cliente
```



#### Paso 3. Recibir el webhook (`/dv/webhook`)

```php
<?php
$secret = 'SU_SECRET_KEY';
$raw = file_get_contents('php://input');
$sign = $_SERVER['HTTP_X_SIGN'] ?? '';

// 1. Verificar la firma
if (!hash_equals(hash('sha256', $raw . $secret), $sign)) {
    http_response_code(403);
    exit('invalid signature');
}

$data = json_decode($raw, true);

// 2. Si el pago está confirmado — acreditar
if (($data['type'] ?? '') === 'PaymentReceived' && ($data['status'] ?? '') === 'completed') {
    $userId = $data['wallet']['store_external_id'];
    $amount = $data['amount'];
    $uniq = $data['transactions']['tx_hash'] . ':' . $data['transactions']['bc_uniq_key'];

    // 3. Compruebe en la BD que $uniq no se haya procesado
    // Acredite el pedido al usuario $userId
}

// 4. Responder siempre así
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

---



### 4) JavaScript (Node.js)



#### Paso 1. Instalar la biblioteca

```bash
npm install @dv-net/js-client express
```



#### Paso 2. Crear el pago

```js
import { MerchantClient } from "@dv-net/js-client";

const client = new MerchantClient({
  host: "https://pay.domain.com",
  xApiKey: "SU_API_KEY",
});

const wallet = await client.getExternalWallet({
  storeExternalId: "user_123",
  amount: "10",
  currency: "USD",
  email: "user@domain.com",
});

console.log(wallet.payUrl); // enviar al cliente
```



#### Paso 3. Recibir el webhook

```js
import express from "express";
import crypto from "crypto";

const app = express();
const SECRET = "SU_SECRET_KEY";
const alreadyDone = new Set(); 

app.post("/dv/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sign = String(req.header("x-sign") || "");

  // 1. Verificar la firma
  const calc = crypto.createHash("sha256").update(raw + SECRET).digest("hex");
  if (calc !== sign) {
    return res.status(403).send("invalid signature");
  }

  const data = JSON.parse(raw);

  // 2. Si el pago está confirmado — acreditar
  if (data.type === "PaymentReceived" && data.status === "completed") {
    const userId = data.wallet.store_external_id;
    const amount = data.amount;
    const uniq = `${data.transactions.tx_hash}:${data.transactions.bc_uniq_key}`;

    // 3. No acreditar dos veces
    if (!alreadyDone.has(uniq)) {
      alreadyDone.add(uniq);
      console.log(`Pago de ${userId}: ${amount} USD`);
      // aquí guarda el pedido / saldo
    }
  }

  // 4. Responder siempre así
  res.json({ success: true });
});

app.listen(3000);
```

---



### 5) WooCommerce



#### Paso 1. Instalar el plugin

1. Descargue [https://github.com/dv-net/dv-woocommerce](https://github.com/dv-net/dv-woocommerce)
2. WordPress → **Plugins → Add New → Upload**
3. **Activate**



#### Paso 2. Introducir la configuración

1. **WooCommerce → Settings → Payments → DV.net**
2. Active el pago
3. Indique:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `SU_API_KEY`
  - API Secret: `SU_SECRET_KEY`
4. Guarde



#### Paso 3. Configurar el webhook en [DV.net](http://DV.net)

Indique la callback URL de la configuración del plugin.

#### Paso 4. Comprobar

Realice un pedido de prueba y páguelo.

---



### 6) OpenCart



#### Paso 1. Instalar el módulo

1. Descargue [https://github.com/dv-net/dv-opencart](https://github.com/dv-net/dv-opencart) (`dv-opencart.ocmod.zip`)
2. **Extensions → Installer → Upload**
3. **Extensions → Payments → DV.net → Install**
4. **Extensions → Modifications → Refresh**



#### Paso 2. Introducir la configuración

1. Abra Edit en DV.net Gateway
2. Indique:
  - Merchant URL: `https://pay.domain.com`
  - API Key: `SU_API_KEY`
  - API Secret: `SU_SECRET_KEY`
3. Status: Enabled
4. Guarde



#### Paso 3. Configurar el webhook en [DV.net](http://DV.net)

```text
https://domain.com/index.php?route=extension/payment/dv_gateway/callback
```



#### Paso 4. Comprobar

Realice un pedido de prueba.

---



### Breve introducción a los webhooks

1. Responda siempre:

```json
{"success": true}
```

1. Firma:

```text
SHA256(cuerpo_solicitud + Secret_key) = encabezado X-Sign
```

1. Para no acreditar dos veces, recuerde:

```text
tx_hash + bc_uniq_key
```

1. Tipos de eventos:


| Tipo                                | Qué hacer       |
| ---------------------------------- | ---------------- |
| `PaymentReceived`                  | Acreditar el pago |
| `PaymentNotConfirmed`              | Esperar        |
| `WithdrawalFromProcessingReceived` | Retiro completado   |


---



### Ejemplos de demostración:


| Qué              | Enlace                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| WooCommerce      | [https://woocommerce.dv-net.store/](https://woocommerce.dv-net.store/)                             |
| Express.js       | [https://express.dv-net.store/](https://express.dv-net.store/)                                     |
| Código de la demo Express | [https://github.com/dv-net/dv-net-js-client-demo](https://github.com/dv-net/dv-net-js-client-demo) |
| Formulario sin API    | [https://github.com/dv-net/simple-payment-form](https://github.com/dv-net/simple-payment-form)     |


