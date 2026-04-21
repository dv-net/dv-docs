# क्रिप्टो वॉलेट में कुंजी आयात

DV.net से निजी कुंजी या सीड डाउनलोड के बाद तीसरे पक्ष का वॉलेट चाहिए। MetaMask और OKX Wallet।

## कौन सा वॉलेट

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum व EVM | ✅ | ✅ |
| Base, BNB Chain, Polygon, Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

केवल EVM: कोई भी। BTC/BCH: OKX।

## MetaMask

### इंस्टॉल

- **ब्राउज़र:** [metamask.io](https://metamask.io)
- **मोबाइल:** स्टोर में «MetaMask»

केवल आधिकारिक साइट से।

### निजी कुंजी आयात

1. MetaMask खोलें
2. ऊपर दाएँ खाता आइकन
3. **Import account**
4. निजी कुंजी चिपकाएँ (`0x` से)
5. **Import**

> केवल वही एक पता।

### सीड आयात

> ⚠️ वर्तमान MetaMask बदल देगा। पहले मौजूदा सीड बैकअप करें।

1. **Import an existing wallet**
2. 12 या 24 शब्द
3. पासवर्ड

पहला पता स्वतः; अगले **Add account** से।

### नेटवर्क जोड़ें

डिफ़ॉल्ट Ethereum। अन्य: [chainlist.org](https://chainlist.org) → **Add to MetaMask**।

मैन्युअल:

| नेटवर्क | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### खाता हटाएँ

1. खाता मेनू
2. खाते के पास **⋮**
3. **Remove account**

## OKX Wallet

### इंस्टॉल

- [okx.com/web3](https://www.okx.com/web3)
- मोबाइल: «OKX Wallet»

### निजी कुंजी

1. OKX खोलें
2. **+** → **Import wallet → Private key**
3. **EVM**, **Bitcoin** या **Bitcoin Cash**
4. कुंजी
5. पासवर्ड

फिर ऊपर नेटवर्क।

### सीड

1. **Import wallet → Seed phrase**
2. शब्द
3. यदि पथ माँगे तो नीचा तालिका
4. पासवर्ड

**DV.net पथ:**

| नेटवर्क | पथ |
|---|---|
| Ethereum व EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### सूचकांक

सीड के बाद **Add account** दबाते रहें; पता लेनदेन से मिलाएँ।

### वॉलेट हटाएँ

1. वॉलेट प्रबंधन
2. **⋮**
3. **Delete wallet**

> ऐप से हटाने से ऑन-चेन धन नहीं मिटते।
