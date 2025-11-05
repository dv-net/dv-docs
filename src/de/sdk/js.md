# **DV-NET JS-Client**
Dies ist der offizielle JavaScript-/TypeScript-Client für die Integration mit der DV-NET Merchant API.
Er bietet bequemen Zugriff auf alle API-Endpunkte und übernimmt die Signierung von Anfragen. Er funktioniert sowohl in Node.js- als auch in Browser-Umgebungen.

## Voraussetzungen

+ Node.js 18 oder höher (für die serverseitige Nutzung)
+ Ein moderner Browser (für die clientseitige Nutzung)

## Installation
Sie können den Client über npm oder yarn installieren:# Mit npm
```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## Erste Schritte

### Grundlegende Client-Initialisierung

Um den Client zu verwenden, benötigen Sie Ihren Merchant-API-Host und API-Schlüssel.
Dieses Beispiel verwendet die ES-Modules-Syntax (z. B. in einer TypeScript-Datei oder einer .mjs-Datei).

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