# Import keys into a crypto wallet

After you download a private key or seed phrase from DV.net, you need a third-party wallet to access the funds. This article covers two recommended options.

## Which wallet to use

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum and EVM | ✅ | ✅ |
| Base, BNB Chain, Polygon, Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

For EVM-only work, either wallet is fine. For BTC or BCH, use OKX Wallet.

## MetaMask

### Install

- **Browser:** [metamask.io](https://metamask.io) → Download → pick your browser (Chrome, Firefox, Edge, Brave)
- **Mobile:** App Store or Google Play, search “MetaMask”

Install only from the official site — fake extensions exist.

### Import private key

1. Open MetaMask
2. Click the account icon (top right)
3. Choose **Import account**
4. Paste the private key (string starting with `0x`)
5. Click **Import**

> Importing via private key only unlocks that one address.

### Import seed phrase

> ⚠️ Importing a seed phrase replaces the current MetaMask wallet. If MetaMask already holds another wallet, back up that wallet’s seed phrase first.

1. On the welcome screen choose **Import an existing wallet**
2. Enter the 12 or 24 words in the correct order
3. Set a password and finish setup

MetaMask shows the first address by default. For the next indices click **Add account** each time.

### Add a network

MetaMask defaults to Ethereum. For other networks go to [chainlist.org](https://chainlist.org), find the network, and click **Add to MetaMask**.

Manual parameters:

| Network | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### Remove the account when done

1. Open the account menu
2. Click **⋮** next to the account
3. Choose **Remove account**

## OKX Wallet

### Install

- **Browser:** [okx.com/web3](https://www.okx.com/web3) → Download Extension
- **Mobile:** App Store or Google Play, search “OKX Wallet”

### Import private key

1. Open OKX Wallet
2. Tap **+** next to the wallet selector → **Import wallet → Private key**
3. Pick **EVM**, **Bitcoin**, or **Bitcoin Cash**
4. Paste the private key
5. Set a password and finish import

Then switch to the network you need in the top menu.

### Import seed phrase

1. Choose **Import wallet → Seed phrase**
2. Enter the 12 or 24 words in order
3. If prompted, set the derivation path (see table below)
4. Set a password and finish import

**DV.net derivation paths:**

| Network | Derivation path |
|---|---|
| Ethereum and all EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N` is the address index (0, 1, 2, …).

### Find the address by index

After importing the seed phrase, use **Add account** repeatedly — OKX adds addresses with increasing indices. Compare each address to the one from your transaction.

### Delete the wallet when done

1. Open wallet management
2. Tap **⋮** on the wallet
3. Choose **Delete wallet** and confirm

> Removing an account or wallet from the app does not remove on-chain funds — it only removes access from that app.
