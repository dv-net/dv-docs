# **DV-NET PHP-Client**

Dies ist der offizielle PHP-Client zur Integration mit der DV-NET Merchant API. Er bietet bequemen Zugriff auf alle API-Endpunkte, übernimmt das Signieren von Anfragen und bildet Antworten auf PHP Data Transfer Objects (DTOs) ab.

## **Voraussetzungen**

* PHP 8.1 oder höher
* [Composer](https://getcomposer.org/)
* Ein [PSR-18-kompatibler HTTP-Client](https://www.php-fig.org/psr/psr-18/) (z. B. Guzzle, Symfony HTTPClient etc.)
* [PSR-17-kompatible HTTP-Factories](https://www.php-fig.org/psr/psr-17/)

Wenn Sie keinen eigenen HTTP-Client bereitstellen, enthält diese Bibliothek einen einfachen, integrierten cURL-basierten Client.

## **Installation**

Sie können den Client über Composer installieren:  
composer require dv-net/php-client

## **Erste Schritte**

### **Grundlegende Initialisierung des Clients**

Um den Client zu verwenden, benötigen Sie Ihren Merchant-API-Host und API-Schlüssel.  
```php
<?php  
require 'vendor/autoload.php';

use DvNet\PhpClient\MerchantClient;  
use DvNet\PhpClient\Exceptions\DvNetException;

// Replace with your actual host and API key  
$host = '[https://your-merchant-api.dv-net.com](https://your-merchant-api.dv-net.com)';  
$apiKey = 'your_merchant_api_key_goes_here';

try {  
// Initialize the client  
// You can optionally pass your own PSR-18 HTTP client and PSR-17 factories  
$client = new MerchantClient($host, $apiKey);

    // --- Example: Get available currencies ---  
    $currenciesResponse = $client->getCurrencies();

    echo "Successfully fetched " . count($currenciesResponse->getCurrencies()) . " currencies:\n";

    foreach ($currenciesResponse->getCurrencies() as $currency) {  
        echo "- " . $currency->getName() . " (" . $currency->getTicker() . ")\n";  
    }  
      
    // --- Example: Get account balances ---  
    $balancesResponse = $client->getProcessingWalletBalances();  
    foreach ($balancesResponse->getProcessingWallets() as $walletBalance) {  
        echo "Balance for " . $walletBalance->getCurrencyShort()->getTicker() . ": " . $walletBalance->getAsset()->getAmount() . "\n";  
    }

} catch (DvNetException $e) {  
// Catch base exception for all client errors  
echo "API Error: " . $e->getMessage() . "\n";

    // You can also catch more specific exceptions:  
    // \DvNet\PhpClient\Exceptions\DvNetInvalidRequestException  
    // \DvNet\PhpClient\Exceptions\DvNetNetworkException  
    // \DvNet\PhpClient\Exceptions\DvNetServerException  
}
```
## **Webhooks verarbeiten**

Die Bibliothek enthält einen WebhookMapper, um eingehende Webhooks von DV-NET einfach in strukturierte DTOs zu parsen.  

```php
<?php  
require 'vendor/autoload.php';

use DvNet\\PhpClient\\WebhookMapper;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\ConfirmedWebhookResponse;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\UnconfirmedWebhookResponse;  
use DvNet\\PhpClient\\Dto\\WebhookMapper\\WithdrawalWebhookResponse;  
use DvNet\\PhpClient\\Exceptions\\DvNetInvalidWebhookException;

// 1. Get the raw request body  
$requestBody = file_get_contents('php://input');

// 2. (Recommended) Verify the signature  
// See: /integration/webhook-signature-verification.md  
// $signature = $_SERVER['HTTP_X_SIGNATURE_SHA256'];  
// $secret = 'your_webhook_secret_key';  
// if (!MerchantUtilsManager::verifySignature($requestBody, $signature, $secret)) {  
//    http_response_code(401);  
//    echo 'Invalid signature';  
//    exit;  
// }

// 3. Map the webhook payload  
$mapper = new WebhookMapper();

try {  
$webhook = $mapper->map($requestBody);

    // 4. Handle the webhook based on its type  
    if ($webhook instanceof ConfirmedWebhookResponse) {  
        // A deposit has been confirmed  
        $tx = $webhook->getTransaction();  
        echo "Handling confirmed transaction: " . $tx->getTxid() . " for " . $tx->getAmount() . " " . $tx->getCurrency();  
          
    } elseif ($webhook instanceof UnconfirmedWebhookResponse) {  
        // A new unconfirmed deposit has arrived  
        $wallet = $webhook->getWallet();  
        echo "Handling unconfirmed transaction for wallet: " . $wallet->getAddress();  
          
    } elseif ($webhook instanceof WithdrawalWebhookResponse) {  
        // A withdrawal has been processed  
        $withdrawal = $webhook->getWithdrawal();  
        echo "Handling withdrawal: " . $withdrawal->getId() . " with status " . $withdrawal->getStatus();  
    }  
      
    // Send a 200 OK response to DV-NET  
    http_response_code(200);  
    echo "OK";

} catch (DvNetInvalidWebhookException $e) {  
// Payload was not valid JSON or was not a known webhook type  
http_response_code(400);  
echo "Invalid webhook data: " . $e->getMessage();  
}

```
## **Exception-Handling**

Alle vom Client ausgelösten Exceptions erweitern die Basisklasse DvNet\PhpClient\Exceptions\DvNetException.

* DvNetInvalidRequestException: Wird bei 4xx-Fehlern ausgelöst (z. B. falsche Parameter, Authentifizierungsfehler).
* DvNetServerException: Wird bei 5xx-Fehlern auf Serverseite ausgelöst.
* DvNetNetworkException: Wird bei cURL- oder anderen Netzwerkfehlern ausgelöst.
* DvNetInvalidResponseDataException: Wird ausgelöst, wenn die Serverantwort kein gültiges JSON ist oder nicht abgebildet werden kann.
* DvNetInvalidWebhookException: Wird vom WebhookMapper bei ungültigen Payloads ausgelöst.

## **Lizenz**

Dieses SDK wird unter der MIT-Lizenz veröffentlicht.