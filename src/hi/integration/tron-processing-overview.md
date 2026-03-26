# TRON नेटवर्क - ओवरव्यू

USDT प्रोसेसिंग TRON पर कैसे काम करता है और अलग-अलग fee-payment मोड्स क्यों उपयोगी हैं, इसे समझने के लिए नेटवर्क की बेसिक बातें जानना मदद करता है। यह पेज जरूरी नहीं है, लेकिन वॉलेट सेटअप करते समय बेहतर निर्णय लेने में मदद करता है।

## TRON का resource model

Ethereum के विपरीत, जहाँ हर ट्रांज़ैक्शन पर ETH में फीस चुकानी होती है, TRON दो-स्तरीय resource सिस्टम इस्तेमाल करता है। नेटवर्क पर किसी भी action में एक या दोनों resources खर्च होते हैं: **Bandwidth** और **Energy**।

### Bandwidth

Bandwidth **हर** ट्रांज़ैक्शन पर खर्च होता है - इसे ट्रांज़ैक्शन के "size" (bytes) के रूप में समझें।

- हर अकाउंट को रोज़ **600 Bandwidth Points** मुफ्त मिलते हैं।
- लिमिट खत्म होने पर भी ट्रांज़ैक्शन हो जाता है, लेकिन TRX कटता है (burn होता है)।
- Burn rate: **1 Bandwidth Point = 0.001 TRX**।

### Energy

Energy **smart contracts** चलाने पर खर्च होती है। सभी TRC-20 token transfers (USDT, USDC आदि) smart-contract calls हैं, इसलिए Energy चाहिए।

- Energy का कोई मुफ्त लिमिट नहीं है - इसे TRX freeze करके या rent करके मिलता है।
- Energy कम होने पर नेटवर्क deficit को TRX burn करके पूरा करता है।
- Burn rate: **1 Energy ~= 0.00021 TRX**।
- एक सामान्य USDT transfer लगभग **30,000-65,000 Energy** खर्च करता है, जो TRX burn से भुगतान करने पर करीब **$1-2** पड़ सकता है।

### Resources की तुलना

| | Bandwidth | Energy |
|---|---|---|
| किसके लिए | सभी ट्रांज़ैक्शन | smart-contract actions (TRC-20) |
| मुफ्त allowance | 600 Points/दिन | नहीं |
| replenishment | हर 24 घंटे | हर 24 घंटे (अगर stake है) |
| कैसे मिलता है | मुफ्त allowance या TRX freeze | TRX freeze या rent |
| burn price | 0.001 TRX / Point | 0.00021 TRX / Energy |
| delegation | हाँ | हाँ |

### Resource replenishment

TRX freeze से मिलने वाले resources लगातार replenish होते हैं - लगभग हर ~3 सेकंड (एक block) में daily amount का proportional हिस्सा वापस उपलब्ध होता है। व्यवहार में, पर्याप्त stake के साथ आप लगभग बिना फीस के ट्रांज़ैक्शन कर सकते हैं, जब तक consumption replenishment rate से अधिक न हो।

## TRX Freeze (Stake 2.0)

TRX freeze करना resources पाने का मुख्य तरीका है। आप TRX lock करते हैं और बदले में Energy या Bandwidth मिलती है, साथ ही TRON Power (validators के लिए voting rights) भी मिलता है।

वर्तमान मॉडल **Stake 2.0** है (2023 में लॉन्च):

- Freeze तुरंत लागू होता है - resources तुरंत मिलते हैं।
- Unfreeze में **14 दिन** लगते हैं (unstaking)।
- TRX को अलग-अलग "Energy के लिए" और "Bandwidth के लिए" freeze किया जा सकता है।
- आप resources को दूसरे addresses पर **delegate** कर सकते हैं।

Energy आपके कुल नेटवर्क stake में आपके हिस्से के अनुपात में होती है:

> **आपकी Energy** = (आपका frozen TRX / नेटवर्क का कुल frozen TRX) x नेटवर्क का daily Energy limit

## Resource delegation

Delegation आपको tokens ट्रांसफर किए बिना Energy या Bandwidth एक अकाउंट से दूसरे अकाउंट को देने देता है। Recipient के लिए delegated resources उसी तरह काम करते हैं जैसे उसके अपने।

DV Merchant सेटिंग्स में **Delegate** मोड इसी पर आधारित है: आप अपने मुख्य वॉलेट पर TRX freeze करते हैं और प्रोसेसिंग वॉलेट address पर Energy delegate करते हैं।

::: tip और जानकारी
कौन-सा प्रोसेसिंग मोड चुनना है, देखें: [TRON प्रोसेसिंग सेटिंग्स](/hi/integration/tron-processing-settings).
:::
