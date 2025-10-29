# Acepta pagos con criptomonedas en WordPress con el plugin de WooCommerce de DV.net

Integrar una pasarela de pago en criptomonedas en tu tienda en línea es una excelente manera de ampliar tu base de clientes y ofrecer opciones de pago modernas y seguras. DV.net proporciona una solución potente para gestionar estas transacciones, y su plugin dedicado para WooCommerce hace que el proceso de integración sea sencillo.
Esta guía te acompañará, paso a paso, en la instalación y configuración del plugin de WooCommerce de DV.net en tu sitio de WordPress.

## Requisitos previos:

- Un sitio web de WordPress activo.
- El plugin WooCommerce instalado y activado.
- Una cuenta activa de DV.net.

## Paso 1: Obtén el plugin de WooCommerce de DV.net

El primer paso es descargar los archivos del plugin. A diferencia de los plugins del repositorio oficial de WordPress, este lo obtendrás desde la página de GitHub de DV.net.

Navega al repositorio oficial del plugin de WooCommerce de DV.net: https://github.com/dv-net/dv-woocommerce (Esto se proporcionó en tus archivos).
- Haz clic en la sección Releases en el menú de la derecha.
- Selecciona "Source code (zip)" en el menú de la última versión.
- Guarda el archivo .zip en tu computadora. No lo descomprimas.

## Paso 2: Instala el plugin en tu sitio de WordPress

Ahora vas a subir el archivo ZIP descargado a tu panel de administración de WordPress.
1. Inicia sesión en el área de administración de WordPress (p. ej., tudominio.com/wp-admin).
2. En el menú de la izquierda, ve a Plugins > Añadir nuevo.
3. En la parte superior de la página "Añadir plugins", haz clic en el botón Upload Plugin.
4. Haz clic en el botón "Choose File" y selecciona el archivo dv-woocommerce-main.zip que acabas de descargar.
5. Haz clic en Install Now.
6. Cuando WordPress termine de instalar el plugin, haz clic en el botón Activate Plugin.
Ahora verás "DV.net WooCommerce Plugin" en tu lista de plugins activos.

## Paso 3: Obtén tus credenciales de API de DV.net

Antes de que el plugin funcione, necesitas conectarlo con tu cuenta de DV.net usando claves de API.

1. Inicia sesión en el panel de tu cuenta de DV.net.
2. Navega a la sección API Keys (según el archivo obtaining-api-key-and-secret.md).
3. Haz clic en el botón "Create New Key".
4. Dale a tu clave un nombre descriptivo (p. ej., "WooCommerce Store").
5. El sistema generará una API Key y una API Secret.
6. Importante: Copia tanto la API Key como la API Secret y guárdalas en un lugar seguro, como un gestor de contraseñas. No podrás volver a ver el secreto después de abandonar esta página.
7. Además, toma nota de tu API URL. Esta es la URL principal de tu instancia de DV.net (p. ej., https://api.your-dv-instance.com).

## Paso 4: Configura la pasarela de DV.net en WooCommerce

Con tus claves de API a mano, ahora puedes configurar los ajustes del plugin dentro de WooCommerce.

1. En tu panel de WordPress, ve a WooCommerce > Ajustes.
2. Haz clic en la pestaña Payments en la parte superior de la página.
3. Verás "DV.net" en la lista de métodos de pago. Haz clic en el botón Manage a la derecha.
4. Se abrirá la página de ajustes de DV.net. Completa los siguientes campos (que encontramos en el archivo class-dv-gateway.php):
   1. Enable/Disable: Marca la casilla "Enable DV.net" para que este método de pago esté disponible en el checkout.
   2. Title: Este es el texto que los clientes verán al elegir un método de pago. Por ejemplo: "Pagar con cripto a través de DV.net".
   3. Description: Este es el texto corto que aparece debajo del título. Por ejemplo: "Paga de forma segura con criptomonedas."
   4. API URL: Pega la API URL que anotaste en el Paso 3.
   5. API Key: Pega la API Key que generaste en el Paso 3.
   6. API Secret: Pega la API Secret que guardaste en el Paso 3.
   7. Webhook Secret: Este es un campo crucial para la seguridad. Debes crear una frase secreta fuerte y única (p. ej., usando un generador de contraseñas). Piensa en ella como una contraseña que compartirán DV.net y tu tienda. Guarda este secreto, ya que lo necesitarás en el siguiente paso.
5. Haz clic en el botón Save changes al final de la página.

## Paso 5: Configura el webhook en tu cuenta de DV.net

Tu tienda ya está configurada para enviar solicitudes de pago a DV.net. El paso final es configurar un webhook para que DV.net pueda enviar actualizaciones de estado de pago (como "Paid" o "Failed") de vuelta a tu tienda.

1. Vuelve al panel de tu cuenta de DV.net.
2. Navega a la sección Webhooks o Developer.
3. Crea un nuevo webhook.
4. Payload URL: Esta es la parte más importante. La URL única del webhook de tu tienda es: https://yourdomain.com/wc-api/dv_gateway/ (Recuerda reemplazar yourdomain.com con la dirección real de tu sitio web. Asegúrate de que use https://).
5. Secret: Pega exactamente el mismo Webhook Secret que creaste y guardaste en el Paso 4. Se utiliza para verificar que las solicitudes entrantes provienen realmente de DV.net (como se menciona en webhook-signature-verification.md).
6. Events: Si se solicita, selecciona los eventos a los que debe suscribirse este webhook. Debes habilitar todos los eventos relacionados con pagos, como:
   1. payment.completed
   2. payment.failed
   3. invoice.paid (Nota: Los nombres exactos de los eventos pueden variar. Selecciona todos los que se relacionen con cambios en el estado del pago).
7. Guarda y activa el webhook en tu panel de DV.net.

Paso 6: ¡Todo listo! (No olvides hacer pruebas)

¡Felicidades! La pasarela de pago de DV.net ya está completamente integrada con tu tienda de WooCommerce.

Lo último que debes hacer es realizar una prueba en vivo. La mejor forma de hacerlo es:
1. Entra en tu tienda como si fueras un cliente.
2. Añade un producto real a tu carrito.
3. Ve a la página de checkout.
4. Selecciona "Pagar con cripto a través de DV.net" (o el título que configuraste).
5. Realiza el pedido y asegúrate de que eres redirigido correctamente a la página de pago de DV.net.
6. Te recomendamos encarecidamente completar una pequeña transacción de prueba para confirmar que el estado del pedido se actualiza automáticamente en la sección Pedidos de WooCommerce de "Pending payment" a "Processing" o "Completed" después de que el pago se complete correctamente.

Si el estado del pedido se actualiza automáticamente, ¡tu integración ha sido un éxito!