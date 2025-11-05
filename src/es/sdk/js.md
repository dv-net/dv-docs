# **Cliente DV-NET JS**
Este es el cliente oficial de JavaScript/TypeScript para integrarse con la DV-NET Merchant API.
Proporciona acceso conveniente a todos los endpoints de la API y gestiona la firma de solicitudes. Funciona tanto en entornos Node.js como en navegadores.

## Requisitos

+ Node.js 18 o superior (para uso en el lado del servidor)
+ Un navegador moderno (para uso en el lado del cliente)

## Instalación
Puedes instalar el cliente con npm o yarn:# Using npm
```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## Primeros pasos

### Inicialización básica del cliente

Para empezar a usar el cliente, necesitas tu Merchant API Host y API Key.
Este ejemplo utiliza la sintaxis de ES Modules (p. ej., en un archivo TypeScript o un archivo .mjs).

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