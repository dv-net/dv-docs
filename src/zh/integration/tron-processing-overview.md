# TRON 网络概览

为了理解 USDT 在 TRON 上的处理方式，以及为什么不同的手续费支付模式是合理的，了解网络本身的基础机制会很有帮助。本页不是启动所必需，但能帮助你在配置钱包时做出更合理的决策。

## TRON 资源模型

不同于 Ethereum 每笔交易都用 ETH 支付手续费，TRON 使用两层资源系统。网络中的任何操作都会消耗一种或两种资源：**Bandwidth** 与 **Energy**。

### Bandwidth

Bandwidth 会在 **任何** 交易中被消耗，可以理解为交易的“字节大小”。

- 每个账户每天免费获得 **600 Bandwidth Points**。
- 超出免费额度后，交易仍会执行，但会扣除（燃烧）TRX。
- 燃烧价格：**1 Bandwidth Point = 0.001 TRX**。

### Energy

Energy 用于执行 **智能合约**。所有 TRC-20 代币转账（USDT、USDC 等）都是智能合约调用，因此需要 Energy。

- Energy 没有免费额度，需要通过冻结 TRX 获得或通过租用获得。
- 如果 Energy 不足，网络会燃烧 TRX 来补足消耗。
- 燃烧价格：**1 Energy ~= 0.00021 TRX**。
- 一笔 USDT 转账大约消耗 **30,000-65,000 Energy**，如果通过燃烧 TRX 支付，通常约 **$1-2**。

### 资源对比

| | Bandwidth | Energy |
|---|---|---|
| 用途 | 所有交易 | 智能合约操作（TRC-20） |
| 免费额度 | 600 Points/天 | 无 |
| 恢复周期 | 每 24 小时 | 每 24 小时（有冻结时） |
| 获取方式 | 免费额度或冻结 TRX | 冻结 TRX 或租用 |
| 燃烧价格 | 0.001 TRX / Point | 0.00021 TRX / Energy |
| 可委托 | 是 | 是 |

### 资源恢复

通过冻结 TRX 获得的资源会持续恢复：大约每 ~3 秒（一个区块）会恢复当日额度的一小部分。实际效果是，只要冻结规模足够，且消耗不超过恢复速度，你可以几乎“免费”地完成交易。

## 冻结 TRX（Stake 2.0）

冻结 TRX 是获取资源的核心机制。你在网络中锁定 TRX，以获得 Energy 或 Bandwidth，同时获得 TRON Power（用于为验证人投票）。

当前采用 **Stake 2.0**（2023 年上线）：

- 冻结立即生效，资源会立刻到账。
- 解冻需要 **14 天**（unstaking）。
- 可以分别为“Energy”和“Bandwidth”冻结 TRX。
- 支持将资源 **委托** 给其他地址。

你获得的 Energy 与你在全网冻结 TRX 总量中的占比相关：

> **你的 Energy** = (你的冻结 TRX / 全网冻结 TRX 总量) x 全网每日 Energy 上限

## 资源委托

委托允许你将 Energy 或 Bandwidth 从一个账户转移给另一个账户，而无需转移代币本身。被委托的资源对接收方来说与自有资源等效。

这也是 DV Merchant 中 **Delegate** 模式的基础：你在主钱包冻结 TRX，并将 Energy 委托给处理钱包地址。

::: tip 更多
如何选择处理模式，请参见 [TRON 处理设置](/zh/integration/tron-processing-settings)。
:::
