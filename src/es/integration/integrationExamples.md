# Ejemplos de integración

En esta guía, exploraremos ejemplos prácticos de integración de pagos con criptomonedas en plataformas de comercio electrónico y aplicaciones web populares. Mostraremos lo fácil que es aceptar pagos cripto en tu sitio web, independientemente de la tecnología que utilices.

## Descripción general de las capacidades de integración

Nuestra pasarela de pago ofrece soluciones flexibles para diversas plataformas:

- **WooCommerce (WordPress)** — complemento listo para usar para tiendas en línea
- **Express.js** — integración mediante RESTful API para aplicaciones de Node.js
- **API universal** — para cualquier plataforma o lenguaje de programación

## Integración con WooCommerce

WooCommerce es una de las plataformas más populares para crear tiendas en línea en WordPress. Integrar pagos con criptomonedas con WooCommerce te permite aceptar Bitcoin, Ethereum y otras criptomonedas sin una configuración compleja.

### Ventajas de usar WooCommerce

- ✅ **Instalación sencilla** — instala mediante el panel de administración de WordPress en solo unos minutos
- ✅ **Conversión automática** — calcula automáticamente el importe en cripto según el tipo de cambio actual
- ✅ **Seguridad** — todas las transacciones están protegidas y verificadas a través de la blockchain
- ✅ **Compatibilidad con múltiples criptomonedas** — Bitcoin, Ethereum, USDT, USDC y más
- ✅ **Notificaciones instantáneas** — sistema de webhooks para rastrear el estado del pago

### Ejemplo de demostración

Puedes probar la funcionalidad del complemento en nuestro sitio de demostración:

🔗 **[Demo de WooCommerce](https://woocommerce.dv-net.store/)**

### Cómo funciona

Al realizar un pedido, el cliente:
- Selecciona el pago con criptomonedas en la página de pago
- Recibe una dirección de cartera única para la transferencia
- Ve un código QR para un pago móvil rápido
- Obtiene el importe exacto en la criptomoneda seleccionada

Después de que la blockchain confirme la transacción, el estado del pedido se actualiza automáticamente a través del sistema de webhooks.

## Integración con Express.js

Express.js es un framework web popular para Node.js, ampliamente utilizado para crear aplicaciones web y APIs. Integrar pagos cripto mediante RESTful API te permite crear soluciones flexibles y escalables.

### Ventajas de usar Express.js

- ✅ **Control total** — lógica de procesamiento de pagos completamente personalizable
- ✅ **RESTful API** — enfoque de integración moderno
- ✅ **Procesamiento asíncrono** — usa async/await para manejar los pagos
- ✅ **Flexibilidad** — se puede integrar en cualquier lógica de negocio
- ✅ **Escalabilidad** — adecuado para proyectos de cualquier tamaño

### Ejemplo de demostración

Prueba la integración en un ejemplo real:

🔗 **[Demo de Express.js](https://express.dv-net.store/)**

## Código fuente y ejemplos

Todos los ejemplos de integración son de código abierto:

- 🛒 **[Complemento de WooCommerce](https://github.com/dv-net/dv-woocommerce)** — complemento de WordPress listo para usar
- 🚀 **[Demo de Express.js](https://github.com/dv-net/dv-net-js-client-demo)** — demo de Node.js con todas las funciones