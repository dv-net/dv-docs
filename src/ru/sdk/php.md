# **DV-NET PHP‑клиент**

Официальный PHP‑клиент для интеграции с DV-NET Merchant API. Предоставляет удобный доступ ко всем конечным точкам API, выполняет подписание запросов и отображает ответы в PHP DTO (Data Transfer Objects).

## **Требования**

* PHP 8.1 или выше
* [Composer](https://getcomposer.org/)
* [Совместимый с PSR-18 HTTP‑клиент](https://www.php-fig.org/psr/psr-18/) (например, Guzzle, Symfony HTTPClient и т. д.)
* [Совместимые с PSR-17 HTTP‑фабрики](https://www.php-fig.org/psr/psr-17/)

Если вы не предоставляете собственный HTTP‑клиент, эта библиотека включает простой встроенный клиент на основе cURL.

## **Установка**

Вы можете установить клиент через Composer:  
composer require dv-net/php-client

## **Начало работы**

### **Базовая инициализация клиента**

Чтобы начать использовать клиент, вам нужны хост Merchant API и ключ API.  
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
## **Обработка вебхуков**

Библиотека включает WebhookMapper для удобного парсинга входящих вебхуков от DV-NET в структурированные DTO.  

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
## **Обработка исключений**

Все исключения, выбрасываемые клиентом, наследуются от базового DvNet\PhpClient\Exceptions\DvNetException.

* DvNetInvalidRequestException: Выбрасывается для ошибок 4xx (например, некорректные параметры, сбой аутентификации).
* DvNetServerException: Выбрасывается для ошибок 5xx на стороне сервера.
* DvNetNetworkException: Выбрасывается при сбоях cURL или других сетевых ошибках.
* DvNetInvalidResponseDataException: Выбрасывается, если ответ сервера не является корректным JSON или не может быть отображен.
* DvNetInvalidWebhookException: Выбрасывается WebhookMapper при некорректной нагрузке.

## **Лицензия**

Этот SDK распространяется по лицензии MIT.