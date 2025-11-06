# **DV-NET JS Client**
This is the official JavaScript/TypeScript client for integrating with the DV-NET Merchant API.
It provides convenient access to all API endpoints and handles request signing. It works in both Node.js and browser environments.

## Requirements

+ Node.js 18 or higher (for server-side usage)
+ A modern browser (for client-side usage)

## Installation
You can install the client via npm or yarn

```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## Getting Started

### Basic Client Initialization

To start using the client, you need your Merchant API Host and API Key.
This example uses ES Modules syntax (e.g., in a TypeScript file or a `.mjs` file).

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
