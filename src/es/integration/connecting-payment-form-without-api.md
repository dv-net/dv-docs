# Conexión de un Formulario de Pago sin Usar la API

Puedes conectar un formulario de pago sin necesidad de integrar la API siguiendo estos sencillos pasos:

## 1. Encuentra el UUID de tu Tienda

Inicia sesión en la cuenta personal de tu proyecto y navega a la sección de **Configuración**.  
Allí encontrarás el **UUID** (identificador único) de tu tienda.

## 2. Genera un Enlace de Pago

Utiliza el siguiente formato para generar un enlace de pago:

### Donde:
- `{your-domain-or-subdomain}` — Tu dominio o subdominio registrado.
- `{store-uuid}` — El UUID de tu tienda (obtenido desde tu cuenta personal).
- `{client-id}` — Un identificador único que asignas al cliente al generar el enlace de pago. Este ID se usa para rastrear el pago y asociarlo con el monedero correcto del cliente.

> ⚠️ **Importante:** El `client-id` debe ser único para cada sesión del cliente para garantizar un seguimiento preciso y la correcta asociación del monedero.

---

Después de generar el enlace, puedes redirigir al cliente a él o integrarlo en un botón en tu sitio web.
