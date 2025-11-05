# **Клиент DV-NET JS**
Это официальный клиент на JavaScript/TypeScript для интеграции с DV-NET Merchant API.
Он предоставляет удобный доступ ко всем конечным точкам API и выполняет подпись запросов. Работает как в среде Node.js, так и в браузере.

## Требования

+ Node.js 18 или выше (для серверного использования)
+ Современный браузер (для клиентского использования)

## Установка
Вы можете установить клиент через npm или yarn
```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## Начало работы

### Базовая инициализация клиента

Чтобы начать использовать клиент, вам нужны Merchant API Host и API Key.
В этом примере используется синтаксис ES Modules (например, в файле TypeScript или .mjs).

```js
// Import the client and exceptions
import { MerchantClient, DvNetException } from '@dv-net/js-client';

// Replace with your actual host and API key
const host = '[https://your-merchant-api.dv-net.com](https://your-merchant-api.dv-net.com)';
const apiKey = 'your_merchant_api_key_goes_here';

// --- Main function to run our async code ---
async function main() {
try {
// Initialize the client
const client = new MerchantClient(host, apiKey);

        // --- Example: Get available currencies ---
        const currenciesResponse = await client.getCurrencies();

        console.log(`Successfully fetched ${currenciesResponse.currencies.length} currencies:`);
        for (const currency of currenciesResponse.currencies) {
            console.log(`- ${currency.name} (${currency.ticker})`);
        }
        
        // --- Example: Get account balances ---
        const balancesResponse = await client.getProcessingWalletBalances();
        for (const walletBalance of balancesResponse.processingWallets) {
            console.log(`Balance for ${walletBalance.currencyShort.ticker}: ${walletBalance.asset.amount}`);
        }

    } catch (error) {
        // Catch base exception for all client errors
        if (error instanceof DvNetException) {
            console.error(`API Error: ${error.message}`);
            // You can also check for more specific errors:
            // if (error instanceof DvNetInvalidRequestException) { ... }
            // if (error instanceof DvNetServerException) { ... }
        } else {
            // Handle other unexpected errors
            console.error(`An unexpected error occurred: ${error.message}`);
        }
    }
}

// Run the main function
main();
```