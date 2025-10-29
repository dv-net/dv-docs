# Cómo aceptar pagos con criptomonedas en OpenCart con la extensión de pasarela de pago de DV.net

Ofrecer pagos con criptomonedas puede mejorar significativamente tu tienda OpenCart, atrayendo a un público más amplio y proporcionando flexibilidad de pago moderna. DV.net ofrece una solución sólida de procesamiento de pagos con criptomonedas, y su extensión para OpenCart simplifica el proceso de integración.
Esta guía proporciona un recorrido claro y paso a paso para instalar y configurar la extensión de la pasarela de pago de DV.net en tu sitio web OpenCart.

## Requisitos previos:

- Un sitio web de OpenCart activo.
- Acceso de administrador a tu panel de OpenCart.
- Una cuenta activa de DV.net.

## Paso 1: Obtener la extensión de OpenCart de DV.net

Primero, necesitas descargar los archivos de la extensión. Los obtendrás desde el repositorio oficial de DV.net en GitHub.

- Navega al repositorio oficial de la extensión de OpenCart de DV.net: https://github.com/dv-net/dv-opencart.
- Ve a la página Releases
- Descarga `dv-opencart-vX.X.X.ocmod.zip`

## Paso 2: Instalar la extensión en tu sitio OpenCart

OpenCart utiliza un Extension Installer para manejar las cargas.

- Inicia sesión en tu panel de administración de OpenCart (por ejemplo, yourdomain.com/admin).
- Navega a Extensions > Installer desde el menú de la izquierda.
- Haz clic en el botón Upload.
- Selecciona el archivo .zip que descargaste en el Paso 1.
- Espera a que el proceso de carga e instalación finalice. Deberías ver un mensaje de éxito.
- Importante: Después de la instalación, ve a Extensions > Modifications y haz clic en el botón azul Refresh en la esquina superior derecha para asegurarte de que el sistema reconozca los cambios.
- También es buena idea limpiar la caché del tema. Ve a Dashboard, haz clic en el ícono azul de Settings en la esquina superior derecha y luego haz clic en los botones Refresh de Theme Cache y SASS Cache.

## Paso 3: Obtener tus credenciales de API de DV.net

Para conectar tu tienda con DV.net, necesitas tu API Key, API Secret y API URL.

- Inicia sesión en el panel de tu cuenta de DV.net.
- Ve a la sección API Keys (consultando obtaining-api-key-and-secret.md de los archivos de documentación).
- Haz clic en "Create New Key".
- Asigna a la clave un nombre relevante (p. ej., "OpenCart Store").
- El sistema mostrará tu API Key y API Secret.
- Crítico: Copia inmediatamente tanto la API Key como la API Secret y guárdalas de forma segura (por ejemplo, en un gestor de contraseñas). El secret no se mostrará de nuevo.
- Anota tu API URL, que es la URL base de tu instancia de DV.net (por ejemplo, https://api.your-dv-instance.com).

## Paso 4: Configurar la pasarela de DV.net en OpenCart

Ahora, configura el método de pago dentro de tu panel de administración de OpenCart.

- En tu panel de OpenCart, ve a Extensions > Extensions.
- En el menú desplegable "Choose the extension type", selecciona Payments.
- Desplázate por la lista hasta encontrar "DV.net Gateway". Haz clic en el botón verde Install (+) si aún no está instalada y luego haz clic en el botón azul Edit (lápiz).
- Se abrirá la página de configuración de DV.net. Completa los siguientes detalles (basado en admin/controller/extension/payment/dv_gateway.php y los archivos de idioma/plantilla asociados):
- API URL: Pega el API URL del Paso 3.
- API Key: Pega el API Key del Paso 3.
- API Secret: Pega el API Secret del Paso 3.

## Paso 5: ¡Prueba tu integración!

- ¡Tu integración de DV.net con OpenCart ya debería estar completa! Es vital realizar una transacción de prueba.
- Visita el front end de tu tienda OpenCart.
- Añade un producto a tu carrito.
- Procede con el proceso de pago.
- Al seleccionar un método de pago, elige "DV.net Gateway" (o el título configurado, aunque a menudo está fijado en las extensiones de OpenCart).
- Confirma el pedido. Deberías ser redirigido a la página de pago de DV.net.
- Muy recomendado: Completa una transacción real pequeña. Tras el pago exitoso en DV.net, vuelve a tu panel de administración de OpenCart > Sales > Orders. Verifica que el estado del pedido de prueba se haya actualizado automáticamente desde tu estado 'Pending' a tu estado 'Paid' (por ejemplo, 'Processing' o 'Complete').
Si el estado del pedido se actualiza correctamente sin intervención manual, ¡tu configuración es correcta! Ahora los clientes pueden pagar con criptomonedas a través de DV.net en tu tienda OpenCart.