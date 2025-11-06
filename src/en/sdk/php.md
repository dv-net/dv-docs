# **DV-NET PHP Client**

This is the official PHP client for integrating with the DV-NET Merchant API. It provides convenient access to all API endpoints, handles request signing, and maps responses to PHP Data Transfer Objects (DTOs).

## **Requirements**

* PHP 8.1 or higher
* [Composer](https://getcomposer.org/)
* A [PSR-18 compatible HTTP client](https://www.php-fig.org/psr/psr-18/) (like Guzzle, Symfony HTTPClient, etc.)
* [PSR-17 compatible HTTP factories](https://www.php-fig.org/psr/psr-17/)

If you do not provide your own HTTP client, this library includes a simple built-in cURL-based client.

## **Installation**

You can install the client via Composer:  
composer require dv-net/php-client

## **Getting Started**

### **Basic Client Initialization**

To start using the client, you need your Merchant API Host and API Key.  
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
## **Handling Webhooks**

The library includes a WebhookMapper to easily parse incoming webhooks from DV-NET into structured DTOs.  

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
## **Exception Handling**

All exceptions thrown by the client extend the base DvNet\PhpClient\Exceptions\DvNetException.

* DvNetInvalidRequestException: Thrown for 4xx errors (e.g., bad parameters, authentication failure).
* DvNetServerException: Thrown for 5xx errors on the server side.
* DvNetNetworkException: Thrown for cURL or other network-level failures.
* DvNetInvalidResponseDataException: Thrown if the server's response is not valid JSON or cannot be mapped.
* DvNetInvalidWebhookException: Thrown by WebhookMapper for invalid payloads.

## **License**

This SDK is released under the MIT License.