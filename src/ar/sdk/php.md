# **عميل DV-NET لـ PHP**

هذا هو عميل PHP الرسمي للتكامل مع واجهة برمجة تطبيقات DV-NET Merchant. يوفّر وصولاً سهلاً إلى جميع نقاط نهاية واجهة البرمجة، ويتولى توقيع الطلبات، ويحوّل الاستجابات إلى كائنات نقل بيانات (DTOs) في PHP.

## **المتطلبات**

* PHP 8.1 أو أحدث
* [Composer](https://getcomposer.org/)
* [عميل HTTP متوافق مع PSR-18](https://www.php-fig.org/psr/psr-18/) (مثل Guzzle أو Symfony HTTPClient وغيرهما)
* [مصانع HTTP متوافقة مع PSR-17](https://www.php-fig.org/psr/psr-17/)

إذا لم توفّر عميل HTTP خاصاً بك، تتضمن هذه المكتبة عميلاً بسيطاً مدمجاً يعتمد على cURL.

## **التثبيت**

يمكنك تثبيت العميل عبر Composer:  
composer require dv-net/php-client

## **البدء**

### **التهيئة الأساسية للعميل**

لبدء استخدام العميل، ستحتاج إلى عنوان المضيف لواجهة Merchant API ومفتاح API الخاص بك.  
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
## **التعامل مع Webhooks**

تتضمن المكتبة WebhookMapper لتحليل webhooks الواردة من DV-NET بسهولة إلى DTOs منظمة.  

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
## **التعامل مع الاستثناءات**

جميع الاستثناءات التي يرميها العميل ترث من الأساس DvNet\PhpClient\Exceptions\DvNetException.

* DvNetInvalidRequestException: يُرمى لأخطاء 4xx (مثل: معاملات غير صحيحة، فشل المصادقة).
* DvNetServerException: يُرمى لأخطاء 5xx على جانب الخادم.
* DvNetNetworkException: يُرمى لإخفاقات الشبكة أو cURL.
* DvNetInvalidResponseDataException: يُرمى إذا لم تكن استجابة الخادم JSON صالحاً أو تعذّر تحويلها.
* DvNetInvalidWebhookException: يُرمى من قبل WebhookMapper للحوامل غير الصالحة.

## **الترخيص**

تم إصدار هذه الحزمة SDK بموجب رخصة MIT.