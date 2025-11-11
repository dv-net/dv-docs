# Cómo aceptar pagos con criptomonedas en OpenCart con la extensión de pasarela de pago de DV.net

Ofrecer pagos con criptomonedas puede mejorar significativamente tu tienda OpenCart, atrayendo a un público más amplio y ofreciendo flexibilidad de pago moderna. DV.net ofrece una solución sólida para el procesamiento de pagos en cripto, y su extensión para OpenCart simplifica el proceso de integración.
Esta guía proporciona un recorrido claro y paso a paso para instalar y configurar la extensión de la pasarela de pago de DV.net en tu sitio web OpenCart.

## Requisitos previos:

- Un sitio web OpenCart activo.
- Acceso de administrador a tu panel de OpenCart.
- Una cuenta activa de DV.net.

## Paso 1: Obtén la extensión de DV.net para OpenCart

Primero, necesitas descargar los archivos de la extensión. Los obtendrás desde el repositorio oficial de DV.net en GitHub.

- Navega al repositorio oficial de la extensión de OpenCart de DV.net: https://github.com/dv-net/dv-opencart.
- Ve a la página Releases.
- Descarga el `dv-opencart-vX.X.X.ocmod.zip`.

## Paso 2: Instala la extensión en tu sitio OpenCart

OpenCart usa un Instalador de Extensiones para gestionar las cargas.

- Inicia sesión en tu panel de administración de OpenCart (por ejemplo, yourdomain.com/admin).
- Navega a Extensions > Installer desde el menú de la izquierda.
- Haz clic en el botón Upload.
- Selecciona el archivo .zip que descargaste en el Paso 1.
- Espera a que finalice el proceso de carga e instalación. Deberías ver un mensaje de éxito.
- Importante: Después de la instalación, ve a Extensions > Modifications y haz clic en el botón azul Refresh en la esquina superior derecha para asegurarte de que el sistema reconozca los cambios.
- También es buena idea limpiar la caché del tema. Ve al Dashboard, haz clic en el ícono azul del engranaje de Settings en la esquina superior derecha y luego pulsa los botones Refresh para Theme Cache y SASS Cache.

## Paso 3: Obtén tus credenciales de API de DV.net

Para conectar tu tienda con DV.net, necesitas tu API Key, API Secret y API URL.

- Inicia sesión en el panel de tu cuenta de DV.net.
- Busca tu proyecto o crea uno nuevo.
- Navega a la sección API Keys en Projects -> botón Edit para el proyecto específico (consulta obtaining-api-key-and-secret.md en los archivos de documentación).
- Verás la clave API y la clave secreta. Puedes regenerarlas si es necesario.
- En la sección inferior, proporciona las URL para los webhooks. Básicamente, solo necesitarás el webhook para pago exitoso.

## Paso 4: Configura la pasarela DV.net en OpenCart

Ahora, configura el método de pago dentro de tu panel de administración de OpenCart.

- En tu panel de OpenCart, ve a Extensions > Extensions.
- En el menú desplegable llamado "Choose the extension type", selecciona Payments.
- Desplázate por la lista hasta encontrar "DV.net Gateway". Haz clic en el botón verde Install (+) si aún no está instalada y luego en el botón azul Edit (lápiz).
- Se abrirá la página de configuración de DV.net. Completa los siguientes datos:
- API URL: pega la API URL del Paso 3.
- API Key: pega la API Key del Paso 3.
- API Secret: pega la API Secret del Paso 3.

## Paso 5: Configura el webhook en tu cuenta de DV.net

Tu tienda ya está configurada para enviar solicitudes de pago a DV.net. El paso final es configurar un webhook para que DV.net pueda enviar actualizaciones del estado del pago (como "Paid" o "Failed") de vuelta a tu tienda.

1. Vuelve al panel de tu cuenta de DV.net.
2. Navega a la sección Webhooks o Developer.
3. Crea un nuevo webhook.
4. Payload URL: Esta es la parte más importante. La URL única de webhook de tu tienda es: `https://example.com/wc-api/dv_gateway/` (Recuerda reemplazar example.com por la dirección real de tu sitio web. Asegúrate de que use https://).
5. Coloca aquí la dirección de tu webhook (para woo es algo como `https://example.com/index.php?route=extension/payment/dv_gateway/callback`) y presiona Create.
6. Events: Si se te solicita, selecciona los eventos a los que este webhook debe suscribirse. Deberías habilitar todos los eventos relacionados con pagos, como:
    1. Confirmed payment
    2. Unconfirmed payment (i.e when customer will send their payment via BTC and )
    3. Processing withdrawal (currently unsupported by this integration)
7. Guarda y activa el webhook en tu panel de DV.net.

## Paso 6: ¡Prueba tu integración!

- ¡Tu integración de DV.net con OpenCart ya debería estar completa! Es vital realizar una transacción de prueba.
- Visita el frontend de tu tienda OpenCart.
- Añade un producto al carrito.
- Completa el proceso de compra.
- Al seleccionar un método de pago, elige "DV.net Gateway" (o el título configurado, aunque a menudo es fijo en las extensiones de OpenCart).
- Confirma el pedido. Deberías ser redirigido a la página de pago de DV.net.
- Altamente recomendado: realiza una transacción real pequeña. Tras el pago exitoso en DV.net, vuelve a tu panel de OpenCart > Sales > Orders. Verifica que el estado del pedido de prueba se haya actualizado automáticamente de 'Pending' a 'Paid' (por ejemplo, 'Processing' o 'Complete').
Si el estado del pedido se actualiza correctamente sin intervención manual, ¡tu configuración es correcta! Ahora los clientes pueden pagar con criptomonedas a través de DV.net en tu tienda OpenCart.