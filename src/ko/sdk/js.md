# **DV-NET JS Client**
이는 DV-NET Merchant API와 연동하기 위한 공식 JavaScript/TypeScript 클라이언트입니다.
모든 API 엔드포인트에 쉽게 접근할 수 있도록 하며 요청 서명을 처리합니다. Node.js와 브라우저 환경 모두에서 동작합니다.

## Requirements

+ Node.js 18 이상(서버 사이드용)
+ 최신 브라우저(클라이언트 사이드용)

## Installation
클라이언트는 npm 또는 yarn으로 설치할 수 있습니다:# Using npm
```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## Getting Started

### Basic Client Initialization

클라이언트를 사용하려면 Merchant API Host와 API Key가 필요합니다.
이 예시는 ES Modules 문법을 사용합니다(예: TypeScript 파일 또는 .mjs 파일).

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