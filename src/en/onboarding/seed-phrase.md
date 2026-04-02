# Seed phrase: export, import, and deposit address lookup

The seed phrase is your merchant’s master secret. All hot-wallet addresses are derived from it mathematically. With the seed phrase you can recover access to any address and list every deposit address that was ever generated.

> ⚠️ **The seed phrase is the most sensitive secret in your setup.** Anyone who knows it can access all wallets. Keep it offline in a secure place; never share it.

## Exporting the seed phrase

1. Go to **Transfers → Hot Wallets**
2. Click **Download seed phrases** in the upper-right corner
3. Complete two-factor authentication
4. Save the file somewhere secure

> Prefer storing the seed phrase on paper or on an offline device that is not connected to the internet.

## Importing the seed phrase into a wallet

Importing the seed phrase gives access to all merchant addresses through a standard crypto wallet.

### MetaMask (EVM networks)

1. Install [MetaMask](https://metamask.io)
2. On the welcome screen choose **Import an existing wallet**
3. Enter the seed phrase (12 or 24 words) in order
4. Set a password and finish setup
5. Switch to the network you need from the top menu

> MetaMask supports all EVM chains: Ethereum, Base, BNB Chain, Polygon, Arbitrum, and others.

### OKX Wallet (EVM + BTC and more)

1. Install [OKX Wallet](https://www.okx.com/web3)
2. Choose **Import wallet → Seed phrase**
3. Enter the seed phrase in order
4. Set a password and finish setup
5. In the wallet section pick the network or coin you need

> OKX Wallet supports EVM networks, Bitcoin, Bitcoin Cash, and more — useful when you work across several chains.

## Finding deposit addresses from the seed phrase

DV.net generates deposit addresses using standard derivation paths. With the seed phrase you can reproduce any address manually.

### Standard derivation paths

| Network | Derivation path |
|---|---|
| Ethereum and all EVM chains | `m/44'/60'/0'/0/N` |
| Bitcoin (Legacy) | `m/44'/0'/0'/0/N` |
| Bitcoin (SegWit) | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N` is the address index (0, 1, 2, …). The first generated address is `N=0`, the second is `N=1`, and so on.

### Finding a specific address

A dedicated tool that lists derived addresses with indices and private keys is the easiest way to search by seed phrase.

#### Tool: iancoleman BIP39

[iancoleman.io/bip39](https://iancoleman.io/bip39/) is an open-source browser tool. It can be used fully offline: save the page and open it without the internet.

> ⚠️ **Enter the seed phrase only offline.** Save the page via “Save as”, disconnect from the network, then enter the phrase. Never enter it on someone else’s device or while online.

**How to use it:**

1. Open [iancoleman.io/bip39](https://iancoleman.io/bip39/) and save the page offline (Ctrl+S / Cmd+S)
2. Go offline and open the saved file in the browser
3. In **BIP39 Mnemonic**, enter the seed phrase
4. Under **Coin**, pick the asset:
   - `ETH — Ethereum` for all EVM chains (Ethereum, Base, BNB Chain, Polygon, etc.)
   - `BTC — Bitcoin` for Bitcoin Legacy or SegWit
   - `BCH — Bitcoin Cash` for Bitcoin Cash
5. Under **Derivation Path**, open the tab that matches your standard:
   - **BIP44** — EVM addresses and Bitcoin Legacy (`m/44'/...`)
   - **BIP84** — Bitcoin SegWit (`m/84'/...`)
6. **Derived Addresses** shows a table: path, address, public key, private key
7. Find the address that matches your transaction
8. Copy the matching private key to import into a wallet

By default, indices 0–19 are shown. For more, use **Show more rows** or set **starting from index**.

> Most addresses fall in 0–1000. If you do not see it in the first 20 rows, widen the range in steps of 20.
