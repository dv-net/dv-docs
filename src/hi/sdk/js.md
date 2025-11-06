# **DV-NET JS क्लाइंट**
यह DV-NET Merchant API के साथ इंटीग्रेशन के लिए आधिकारिक JavaScript/TypeScript क्लाइंट है।
यह सभी API endpoints तक सुविधाजनक पहुंच प्रदान करता है और request signing संभालता है। यह Node.js और ब्राउज़र दोनों वातावरणों में काम करता है।

## आवश्यकताएँ

+ Node.js 18 या उससे अधिक (सर्वर-साइड उपयोग के लिए)
+ एक आधुनिक ब्राउज़र (क्लाइंट-साइड उपयोग के लिए)

## स्थापना
आप npm या yarn के माध्यम से क्लाइंट इंस्टॉल कर सकते हैं:# Using npm
```
npm install @dv-net/js-client

# npm का उपयोग
# Using yarn
yarn add @dv-net/js-client
```

## शुरू करें

### मूल क्लाइंट प्रारंभिककरण

क्लाइंट का उपयोग शुरू करने के लिए, आपको अपना Merchant API Host और API Key चाहिए।
यह उदाहरण ES Modules सिंटैक्स का उपयोग करता है (जैसे TypeScript फ़ाइल या .mjs फ़ाइल में)।

```js
// क्लाइंट और exceptions इम्पोर्ट करें
import { MerchantClient, DvNetException } from '@dv-net/js-client';

// अपने वास्तविक host और API key से बदलें
const host = '[https://your-merchant-api.dv-net.com](https://your-merchant-api.dv-net.com)';
const apiKey = 'your_merchant_api_key_goes_here';

// --- हमारे async कोड को चलाने के लिए मुख्य फ़ंक्शन ---
async function main() {
try {
    // क्लाइंट इनिशियलाइज़ करें
    const client = new MerchantClient(host, apiKey);

        // --- उदाहरण: उपलब्ध मुद्राएँ प्राप्त करें ---
        const currenciesResponse = await client.getCurrencies();

        console.log(`सफलतापूर्वक ${currenciesResponse.currencies.length} मुद्राएँ प्राप्त हुईं:`);
        for (const currency of currenciesResponse.currencies) {
            console.log(`- ${currency.name} (${currency.ticker})`);
        }
        
        // --- उदाहरण: अकाउंट बैलेंस प्राप्त करें ---
        const balancesResponse = await client.getProcessingWalletBalances();
        for (const walletBalance of balancesResponse.processingWallets) {
            console.log(`${walletBalance.currencyShort.ticker} के लिए बैलेंस: ${walletBalance.asset.amount}`);
        }

    } catch (error) {
        // सभी क्लाइंट errors के लिए बेस exception पकड़ें
        if (error instanceof DvNetException) {
            console.error(`API त्रुटि: ${error.message}`);
            // आप और अधिक विशिष्ट errors भी जांच सकते हैं:
            // if (error instanceof DvNetInvalidRequestException) { ... }
            // if (error instanceof DvNetServerException) { ... }
        } else {
            // अन्य अप्रत्याशित errors को संभालें
            console.error(`एक अप्रत्याशित त्रुटि हुई: ${error.message}`);
        }
    }
}

// मुख्य फ़ंक्शन चलाएँ
main();
```