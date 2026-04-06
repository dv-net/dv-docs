# Wrong-network deposit — recovering funds

If a payer sent tokens to your wallet address but chose a network your merchant does not support, the funds are not lost. This article explains what happened and how to recover them.

## Why this happens

Most Ethereum-compatible networks (Base, BNB Chain, Polygon, Arbitrum, and others) use the same address format. The same wallet address exists in all of these networks at once.

When sending funds, the exchange or wallet asks the payer to pick a network. If they chose a network your merchant does not track, the transaction succeeded on the blockchain — but your system did not record it.

> **The funds are safe.** They are on the correct address, just on another network. You can access them using that address’s private key or your merchant seed phrase.

## How to recover the funds

### Step 1 — Verify the transaction

Ask the payer for the transaction hash. Open a block explorer for the relevant network and confirm:

- the recipient address matches your store’s address
- the transaction status is **Success**
- the token and amount match what you expect

Block explorer: [ChainApi](https://chainapi.org/).

### Step 2 — Find the address in Hot Wallets

1. In the control panel go to **Transfers → Hot Wallets**
2. Enter the recipient address from the transaction in the search field
3. Confirm the address appears in the list

> If the address is not shown, disable the **Hide addresses with low balance** filter.

### Step 3 — Get access to the address

You need a **secret** to control the address that received the deposit on the other network: either the **private key** for that specific address or your merchant **seed phrase**.

- If you are working with **one address**, **the private key** is usually enough. See [Export private keys](./export-keys.md) for how to export it.
- If you want access via **all addresses** and may need to find the right one by index, use the **seed phrase**. See [Seed phrase: export, import, and address lookup](./seed-phrase.md).

> ⚠️ **The private key and seed phrase grant full access to funds.** Never share them with third parties or store them in untrusted places.

### Step 4 — Import into a wallet

Import into a third-party wallet whichever access method you obtained:

- if you exported a **private key** — import the private key
- if you exported a **seed phrase** — import the seed phrase

After import, confirm the correct address is shown, switch to the network where the tokens sit, and check the balance.

Step-by-step guides for MetaMask and OKX Wallet (private key, seed phrase, adding a network, removing the wallet when done) are in [Import keys into a crypto wallet](./wallets-import.md).
