# **DV-NET JS 客户端**
这是用于集成 DV-NET 商户 API 的官方 JavaScript/TypeScript 客户端。
它提供对所有 API 端点的便捷访问并处理请求签名。可在 Node.js 和浏览器环境中使用。

## 要求

+ Node.js 18 或更高版本（服务器端使用）
+ 现代浏览器（客户端使用）

## 安装
你可以通过 npm 或 yarn 安装该客户端：# 使用 npm
```
npm install @dv-net/js-client

# Using yarn
yarn add @dv-net/js-client
```

## 入门

### 基本客户端初始化

要开始使用该客户端，你需要商户 API 主机和 API 密钥。
此示例使用 ES Modules 语法（例如在 TypeScript 文件或 .mjs 文件中）。

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