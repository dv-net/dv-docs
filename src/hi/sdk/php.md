# **DV-NET PHP क्लाइंट**

यह DV-NET Merchant API के साथ इंटीग्रेशन के लिए आधिकारिक PHP क्लाइंट है। यह सभी API एंडपॉइंट्स तक आसान पहुँच प्रदान करता है, रिक्वेस्ट साइनिंग संभालता है, और रेस्पॉन्स को PHP Data Transfer Objects (DTOs) में मैप करता है।

## **आवश्यकताएँ**

* PHP 8.1 या उससे ऊपर
* [Composer](https://getcomposer.org/)
* एक [PSR-18 संगत HTTP क्लाइंट](https://www.php-fig.org/psr/psr-18/) (जैसे Guzzle, Symfony HTTPClient, आदि)
* [PSR-17 संगत HTTP फैक्ट्रियाँ](https://www.php-fig.org/psr/psr-17/)

यदि आप अपना HTTP क्लाइंट प्रदान नहीं करते हैं, तो इस लाइब्रेरी में एक सरल बिल्ट-इन cURL-आधारित क्लाइंट शामिल है।

## **इंस्टॉलेशन**

आप Composer के माध्यम से क्लाइंट इंस्टॉल कर सकते हैं:  
composer require dv-net/php-client

## **शुरूआत**

### **बेसिक क्लाइंट इनिशियलाइज़ेशन**

क्लाइंट का उपयोग शुरू करने के लिए, आपको अपना Merchant API Host और API Key चाहिए।  
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
## **वेबहुक्स को हैंडल करना**

लाइब्रेरी में DV-NET से आने वाले वेबहुक्स को संरचित DTOs में आसानी से पार्स करने के लिए WebhookMapper शामिल है।  

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
## **एक्सेप्शन हैंडलिंग**

क्लाइंट द्वारा थ्रो किए गए सभी exceptions बेस DvNet\PhpClient\Exceptions\DvNetException को एक्सटेंड करते हैं।

* DvNetInvalidRequestException: 4xx त्रुटियों के लिए थ्रो होता है (जैसे, गलत पैरामीटर्स, प्रमाणीकरण विफलता)।
* DvNetServerException: सर्वर-साइड 5xx त्रुटियों के लिए थ्रो होता है।
* DvNetNetworkException: cURL या अन्य नेटवर्क-स्तरीय विफलताओं के लिए थ्रो होता है।
* DvNetInvalidResponseDataException: यदि सर्वर का रेस्पॉन्स वैध JSON नहीं है या मैप नहीं हो सकता, तो थ्रो होता है।
* DvNetInvalidWebhookException: अमान्य पेलोड के लिए WebhookMapper द्वारा थ्रो होता है।

## **लाइसेंस**

यह SDK MIT लाइसेंस के अंतर्गत जारी किया गया है।