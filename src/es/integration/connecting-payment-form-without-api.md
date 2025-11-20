# Conectar un formulario de pago sin usar la API

Puedes conectar un formulario de pago sin integración con la API siguiendo estos sencillos pasos.

Además, puedes ver un ejemplo de integración [en este repositorio](https://github.com/dv-net/simple-payment-form)

## 1. Encuentra el enlace de pago de tu tienda

Inicia sesión en tu cuenta del proyecto y ve a **Proyectos**, **Editar**, **Configuración avanzada**.

Allí encontrarás el **enlace al formulario de pago sin API**, dentro del cual se encuentra el **UUID** (identificador único) de tu tienda.

## 2. Modifica el enlace de pago

Usa el siguiente formato para generar un enlace de pago:

### Dónde:

- `{your-domain-or-subdomain}` es tu dominio o subdominio registrado.
- `{store-uuid}` es el UUID de tu tienda (especificado en el enlace de la tienda).
- `{client-id}` es un identificador único del cliente que asignas al generar el enlace. Es necesario para rastrear el pago y vincularlo a la billetera del cliente deseado.

> ⚠️ **Importante:** `client-id` debe ser único para cada sesión del cliente para garantizar un seguimiento e identificación correctos.

---

Una vez generado el enlace, puedes redirigir al cliente a él o incorporarlo en un botón en tu sitio.