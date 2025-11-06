# **DV-NET PHP 클라이언트**

이 패키지는 DV-NET Merchant API 연동을 위한 공식 PHP 클라이언트입니다. 모든 API 엔드포인트에 쉽게 접근할 수 있도록 하며, 요청 서명 처리와 서버 응답을 PHP DTO(Data Transfer Object)로 매핑하는 기능을 제공합니다.

## **요구 사항**

* PHP 8.1 이상
* [Composer](https://getcomposer.org/)
* [PSR-18 호환 HTTP 클라이언트](https://www.php-fig.org/psr/psr-18/) (예: Guzzle, Symfony HTTPClient 등)
* [PSR-17 호환 HTTP 팩토리](https://www.php-fig.org/psr/psr-17/)

자체 HTTP 클라이언트를 제공하지 않는 경우, 이 라이브러리에는 간단한 내장 cURL 기반 클라이언트가 포함되어 있습니다.

## **설치**

Composer를 통해 클라이언트를 설치할 수 있습니다:  
composer require dv-net/php-client

## **시작하기**

### **기본 클라이언트 초기화**

클라이언트를 사용하려면 Merchant API Host와 API Key가 필요합니다.  
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
## **웹훅 처리**

이 라이브러리는 DV-NET에서 전송되는 웹훅을 손쉽게 파싱하여 구조화된 DTO로 매핑할 수 있는 WebhookMapper를 제공합니다.  

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
## **예외 처리**

클라이언트에서 발생하는 모든 예외는 기본 예외 DvNet\PhpClient\Exceptions\DvNetException을 확장합니다.

* DvNetInvalidRequestException: 4xx 오류(예: 잘못된 매개변수, 인증 실패)에서 발생합니다.
* DvNetServerException: 서버 측 5xx 오류에서 발생합니다.
* DvNetNetworkException: cURL 또는 기타 네트워크 수준 오류에서 발생합니다.
* DvNetInvalidResponseDataException: 서버 응답이 유효한 JSON이 아니거나 매핑할 수 없는 경우 발생합니다.
* DvNetInvalidWebhookException: 잘못된 페이로드에 대해 WebhookMapper가 발생시킵니다.

## **라이선스**

본 SDK는 MIT 라이선스하에 배포됩니다.