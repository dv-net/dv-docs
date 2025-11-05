# **Cliente PHP de DV-NET**

Este es el cliente PHP oficial para integrar con la DV-NET Merchant API. Proporciona acceso conveniente a todos los endpoints de la API, gestiona la firma de solicitudes y mapea las respuestas a Objetos de Transferencia de Datos (DTOs) en PHP.

## **Requisitos**

* PHP 8.1 o superior
* [Composer](https://getcomposer.org/)
* Un cliente HTTP compatible con [PSR-18](https://www.php-fig.org/psr/psr-18/) (como Guzzle, Symfony HTTPClient, etc.)
* [Fábricas HTTP compatibles con PSR-17](https://www.php-fig.org/psr/psr-17/)

Si no proporciona su propio cliente HTTP, esta biblioteca incluye un cliente simple integrado basado en cURL.

## **Instalación**

Puede instalar el cliente mediante Composer:  
composer require dv-net/php-client

## **Primeros pasos**

### **Inicialización básica del cliente**

Para empezar a usar el cliente, necesita su host de la API de comercios y su clave de API.  
```php
<?php  
require 'vendor/autoload.php';

use DvNet\PhpClient\MerchantClient;  
use DvNet\PhpClient\Exceptions\DvNetException;

// Reemplace con su host y clave de API reales  
$host = '[https://your-merchant-api.dv-net.com](https://your-merchant-api.dv-net.com)';  
$apiKey = 'your_merchant_api_key_goes_here';

try {  
// Inicializar el cliente  
// Opcionalmente puede pasar su propio cliente HTTP PSR-18 y fábricas PSR-17  
$client = new MerchantClient($host, $apiKey);

    // --- Ejemplo: Obtener las monedas disponibles ---  
    $currenciesResponse = $client->getCurrencies();

    echo "Se obtuvieron correctamente " . count($currenciesResponse->getCurrencies()) . " monedas:\n";

    foreach ($currenciesResponse->getCurrencies() as $currency) {  
        echo "- " . $currency->getName() . " (" . $currency->getTicker() . ")\n";  
    }  
      
    // --- Ejemplo: Obtener saldos de cuenta ---  
    $balancesResponse = $client->getProcessingWalletBalances();  
    foreach ($balancesResponse->getProcessingWallets() as $walletBalance) {  
        echo "Saldo para " . $walletBalance->getCurrencyShort()->getTicker() . ": " . $walletBalance->getAsset()->getAmount() . "\n";  
    }

} catch (DvNetException $e) {  
// Capture la excepción base para todos los errores del cliente  
echo "Error de API: " . $e->getMessage() . "\n";

    // También puede capturar excepciones más específicas:  
    // \DvNet\PhpClient\Exceptions\DvNetInvalidRequestException  
    // \DvNet\PhpClient\Exceptions\DvNetNetworkException  
    // \DvNet\PhpClient\Exceptions\DvNetServerException  
}
```
## **Manejo de webhooks**

La biblioteca incluye un WebhookMapper para analizar fácilmente los webhooks entrantes de DV-NET en DTOs estructurados.  

```php
<?php  
require 'vendor/autoload.php';

use DvNet\\PhpClient\\WebhookMapper;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\ConfirmedWebhookResponse;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\UnconfirmedWebhookResponse;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\WithdrawalWebhookResponse;  
use DvNet\\PhpClient\\Exceptions\\DvNetInvalidWebhookException;

// 1. Obtener el cuerpo bruto de la solicitud  
$requestBody = file_get_contents('php://input');

// 2. (Recomendado) Verificar la firma  
// Ver: /integration/webhook-signature-verification.md  
// $signature = $_SERVER['HTTP_X_SIGNATURE_SHA256'];  
// $secret = 'your_webhook_secret_key';  
// if (!MerchantUtilsManager::verifySignature($requestBody, $signature, $secret)) {  
//    http_response_code(401);  
//    echo 'Firma no válida';  
//    exit;  
// }

// 3. Mapear el payload del webhook  
$mapper = new WebhookMapper();

try {  
$webhook = $mapper->map($requestBody);

    // 4. Manejar el webhook según su tipo  
    if ($webhook instanceof ConfirmedWebhookResponse) {  
        // Se ha confirmado un depósito  
        $tx = $webhook->getTransaction();  
        echo "Gestionando transacción confirmada: " . $tx->getTxid() . " por " . $tx->getAmount() . " " . $tx->getCurrency();  
          
    } elseif ($webhook instanceof UnconfirmedWebhookResponse) {  
        // Ha llegado un nuevo depósito sin confirmar  
        $wallet = $webhook->getWallet();  
        echo "Gestionando transacción sin confirmar para la billetera: " . $wallet->getAddress();  
          
    } elseif ($webhook instanceof WithdrawalWebhookResponse) {  
        // Se ha procesado un retiro  
        $withdrawal = $webhook->getWithdrawal();  
        echo "Gestionando retiro: " . $withdrawal->getId() . " con estado " . $withdrawal->getStatus();  
    }  
      
    // Enviar una respuesta 200 OK a DV-NET  
    http_response_code(200);  
    echo "OK";

} catch (DvNetInvalidWebhookException $e) {  
// La carga útil no era JSON válido o no era un tipo de webhook reconocido  
http_response_code(400);  
echo "Datos de webhook no válidos: " . $e->getMessage();  
}

```
## **Gestión de excepciones**

Todas las excepciones lanzadas por el cliente extienden la clase base DvNet\PhpClient\Exceptions\DvNetException.

* DvNetInvalidRequestException: Se lanza para errores 4xx (p. ej., parámetros incorrectos, fallo de autenticación).
* DvNetServerException: Se lanza para errores 5xx en el lado del servidor.
* DvNetNetworkException: Se lanza para fallos de cURL u otros fallos a nivel de red.
* DvNetInvalidResponseDataException: Se lanza si la respuesta del servidor no es JSON válido o no puede mapearse.
* DvNetInvalidWebhookException: Lanzada por WebhookMapper para cargas útiles no válidas.

## **Licencia**

Este SDK se distribuye bajo la Licencia MIT.