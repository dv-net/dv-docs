# TRON network overview

To understand how USDT processing works on TRON and why different fee-payment modes make sense, it helps to know the basics of the network itself. This page is optional, but it helps you make informed decisions when configuring the wallet.

## TRON resource model

Unlike Ethereum, where each transaction pays a fee in ETH, TRON uses a two-layer resource system. Any action on the network consumes one or both resources: **Bandwidth** and **Energy**.

### Bandwidth

Bandwidth is spent on **any** transaction - it is the transaction "size" measured in bytes.

- Each account receives **600 Bandwidth Points per day** for free.
- If the limit is exceeded, the transaction still goes through, but TRX is deducted (burned).
- Burn rate: **1 Bandwidth Point = 0.001 TRX**.

### Energy

Energy is spent when executing **smart contracts**. All TRC-20 token transfers (USDT, USDC, etc.) are smart-contract calls and require Energy.

- There is no free Energy limit - you obtain it by freezing TRX or renting.
- If there is not enough Energy, the network burns TRX to cover the deficit.
- Burn rate: **1 Energy ~= 0.00021 TRX**.
- A typical USDT transfer consumes roughly **30,000-65,000 Energy**, which can cost around **$1-2** when paid by burning TRX.

### Resource comparison

| | Bandwidth | Energy |
|---|---|---|
| Used for | All transactions | Smart-contract actions (TRC-20) |
| Free allowance | 600 Points/day | None |
| Replenishment | Every 24 hours | Every 24 hours (if frozen stake exists) |
| How to obtain | Free allowance or freeze TRX | Freeze TRX or rent |
| Burn price | 0.001 TRX / Point | 0.00021 TRX / Energy |
| Delegation | Yes | Yes |

### Resource replenishment

Resources obtained by freezing TRX replenish continuously - roughly every ~3 seconds (one block), a proportional part of the daily amount becomes available again. In practice, with sufficient stake, you can send transactions almost for free as long as consumption does not exceed replenishment.

## Freezing TRX (Stake 2.0)

Freezing TRX is the core mechanism for getting resources. You lock TRX and receive Energy or Bandwidth, as well as TRON Power (voting rights for validators).

The current model is **Stake 2.0** (launched in 2023):

- Freezing is immediate - resources are credited right away.
- Unfreezing takes **14 days** (unstaking period).
- You can freeze TRX separately "for Energy" and "for Bandwidth".
- You can **delegate resources** to other addresses.

Energy is proportional to your share of the total frozen TRX on the network:

> **Your Energy** = (Your frozen TRX / Total frozen TRX on the network) x Network daily Energy limit

## Resource delegation

Delegation allows you to transfer Energy or Bandwidth from one account to another without transferring tokens. Delegated resources work for the recipient the same way as their own.

This is what the **Delegate** mode in DV Merchant processing settings relies on: you freeze TRX on your main wallet and delegate Energy to the processing wallet address.

::: tip More
How to choose the processing mode is described in [TRON processing settings](/en/integration/tron-processing-settings).
:::
