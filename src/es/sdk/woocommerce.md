# Acepta pagos en criptomonedas en WordPress con el plugin DV.net para WooCommerce

Integrar una pasarela de pago con criptomonedas en tu tienda de comercio electrónico es una excelente manera de ampliar tu base de clientes y ofrecer opciones de pago modernas y seguras. DV.net proporciona una solución potente para gestionar estas transacciones, y su plugin dedicado para WooCommerce hace que el proceso de integración sea sencillo.
Esta guía te llevará, paso a paso, por la instalación y configuración del plugin DV.net para WooCommerce en tu sitio de WordPress.

## Requisitos previos:

- Un sitio web de WordPress activo.
- El plugin WooCommerce instalado y activado.
- Una cuenta activa de DV.net.

## Paso 1: Obtener el plugin DV.net para WooCommerce

El primer paso es descargar los archivos del plugin. A diferencia de los plugins del repositorio oficial de WordPress, este lo obtendrás desde la página de GitHub de DV.net.

Navega al repositorio oficial del plugin DV.net para WooCommerce: https://github.com/dv-net/dv-woocommerce (Esto fue proporcionado en tus archivos).
- Haz clic en la sección Releases en el menú de la derecha.
- Selecciona "Source code (zip)" del menú de la última versión.
- Guarda el archivo .zip en tu ordenador. No lo descomprimas.

## Paso 2: Instalar el plugin en tu sitio de WordPress

Ahora subirás el archivo ZIP descargado al panel de administración de WordPress.
1. Inicia sesión en tu área de administración de WordPress (por ejemplo, tudominio.com/wp-admin).
2. En el menú de la izquierda, ve a Plugins > Add New.
3. En la parte superior de la página "Add Plugins", haz clic en el botón Upload Plugin.
4. Haz clic en el botón "Choose File" y selecciona el archivo dv-woocommerce-main.zip que acabas de descargar.
5. Haz clic en Install Now.
6. Cuando WordPress termine de instalar el plugin, haz clic en el botón Activate Plugin.
Ahora verás "DV.net WooCommerce Plugin" en tu lista de plugins activos.

## Paso 3: Obtener tus credenciales de API de DV.net

Para conectar tu tienda con DV.net, necesitas tu API Key, API Secret y API URL.

- Inicia sesión en el panel de tu cuenta de DV.net.
- Busca tu proyecto o crea uno nuevo.
- Ve a la sección API Keys en Projects -> botón Edit del proyecto específico (consulta obtaining-api-key-and-secret.md de los archivos de documentación).
- Verás la API key y la secret key. Puedes regenerarlas si es necesario.
- En la sección inferior, proporciona las URL para los webhooks. Básicamente necesitarás el webhook solo para el pago exitoso.

## Paso 4: Configurar la pasarela de DV.net en WooCommerce

Con tus claves de API en mano, ahora puedes configurar los ajustes del plugin dentro de WooCommerce.

1. En el escritorio de WordPress, ve a WooCommerce > Settings.
2. Haz clic en la pestaña Payments en la parte superior de la página.
3. Verás "DV.net" en la lista de métodos de pago. Haz clic en el botón Manage a la derecha.
4. Se abrirá la página de ajustes de DV.net. Completa los siguientes campos:
   1. Enable/Disable: Marca la casilla "Enable DV.net" para que este método de pago esté disponible en el checkout.
   2. Title: Este es el texto que verán los clientes al elegir el método de pago. Por ejemplo: "Paga con criptomonedas vía DV.net".
   3. Description: Este es el texto corto mostrado bajo el título. Por ejemplo: "Paga de forma segura con criptomonedas."
   4. API URL: Pega la API URL.
   5. API Key: Pega la API Key que guardaste en el Paso 3.
   6. API Secret: Pega la API Secret que guardaste en el Paso 3.
5. Haz clic en el botón Save changes en la parte inferior de la página.

## Paso 5: Configurar el Webhook en tu cuenta de DV.net

Tu tienda ya está configurada para enviar solicitudes de pago a DV.net. El paso final es configurar un webhook para que DV.net pueda enviar las actualizaciones de estado del pago (como "Paid" o "Failed") de vuelta a tu tienda.

1. Vuelve al panel de tu cuenta de DV.net.
2. Ve a la sección Webhooks o Developer.
3. Crea un nuevo webhook.
4. Payload URL: Esta es la parte más importante. La URL de webhook única de tu tienda es: `https://example.com/wc-api/dv_gateway/` (Recuerda reemplazar example.com con la dirección real de tu sitio web. Asegúrate de que use https://).
5. Coloca aquí la dirección de tu webhook (para Woo es algo como `https://example.com/?wc-api=dv_gateway`)
6. Events: Si se solicita, selecciona los eventos a los que este webhook debe suscribirse. Deberías habilitar todos los eventos relacionados con pagos, tales como:
   1. Confirmed payment
   2. Unconfirmed payment (es decir, cuando el cliente envíe su pago vía BTC and )
   3. Processing withdrawal (actualmente no compatible con esta integración)
7. Guarda y activa el webhook en tu panel de DV.net.

## Paso 6: ¡Todo listo! (No olvides hacer pruebas)

¡Enhorabuena! La pasarela de pago de DV.net ahora está totalmente integrada con tu tienda WooCommerce.

Lo último que debes hacer es realizar una prueba real. La mejor manera de hacerlo es:
1. Entra en tu tienda como si fueras un cliente.
2. Añade un producto real a tu carrito.
3. Ve a la página de pago.
4. Selecciona "Paga con criptomonedas vía DV.net" (o el título que definiste).
5. Realiza el pedido y asegúrate de que eres redirigido correctamente a la página de pago de DV.net.
6. Te recomendamos encarecidamente completar una transacción pequeña para confirmar que el estado del pedido se actualiza automáticamente en la sección Pedidos de WooCommerce de "Pago pendiente" a "Procesando" o "Completado" después de que el pago se realice con éxito.

Si el estado del pedido se actualiza automáticamente, ¡tu integración ha sido un éxito!