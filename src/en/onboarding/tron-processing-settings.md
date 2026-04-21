# TRON processing settings

On the **TRON processing settings** page, you choose which resources will be used to pay network fees when withdrawing USDT from deposit wallets to your main wallet or an exchange. This choice affects the cost of each outgoing transfer.

## Why there are costs

When you withdraw USDT (TRC-20) from a deposit wallet, it is a smart-contract call on the TRON network. It requires **Energy**. If the wallet has no Energy available, the network covers the deficit by burning TRX - roughly **$2-5 per transaction** (about **65,000-130,000 Energy**).

You can avoid these costs or reduce them significantly by selecting the right mode.

::: info Want the details?
Learn what Energy and Bandwidth are and how delegation works in TRON in [TRON network overview](/en/onboarding/tron-processing-overview).
:::

## Mode 1 - Burn TRX

For each USDT withdrawal from a deposit wallet, TRX is automatically burned from the processing wallet balance.

**Cost:** ~$2-5 per transfer.

**What you need to do:** keep enough TRX on the wallet - everything else happens automatically.

**When to choose:** good for a quick start or testing. No setup required. With regular volume, this mode becomes the most expensive.

## Mode 2 - Delegate cloud from DV.net

Energy is automatically rented from the DaVinci Merchant provider and delegated to your processing wallet before each transaction.

**Cost:** **about 2x cheaper** than Burn TRX.

**What you need to do:** nothing. For now, we share excess Energy for free, but transfers may sometimes take a few hours.

**When to choose:** the best default for most merchants. No technical knowledge required, works out of the box, and is noticeably cheaper than burning TRX.

## Mode 3 - Delegate

You freeze (stake) TRX on your own wallet and delegate the received Energy to the processing wallet. Transfers are performed using your own resources.

**Cost:** ~$0 per transfer. Frozen TRX is not spent; Energy replenishes automatically every 24 hours.

**What you need to do:**

1. Freeze TRX on your main wallet. You receive Energy proportionally to the frozen amount.
2. Delegate Energy to your processing wallet address. The address is shown at the top of the settings page.

**When to choose:** if you have a stable flow of withdrawals and want to minimize operating costs. With ~20-30 transactions per day, it pays off quickly.
