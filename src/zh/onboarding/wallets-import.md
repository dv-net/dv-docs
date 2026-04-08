# 将密钥导入加密货币钱包

从 DV.net 下载私钥或助记词后，需使用第三方钱包访问资金。本文介绍 MetaMask 与 OKX Wallet。

## 如何选择

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum 与 EVM | ✅ | ✅ |
| Base、BNB Chain、Polygon、Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

仅 EVM 任选其一；需要 BTC/BCH 请用 OKX Wallet。

## MetaMask

### 安装

- **浏览器：** [metamask.io](https://metamask.io) → Download
- **手机：** App Store / 国内应用商店搜索「MetaMask」

务必从官网安装。

### 导入私钥

1. 打开 MetaMask
2. 右上角账户图标
3. **Import account**
4. 粘贴私钥（以 `0x` 开头）
5. **Import**

> 仅解锁该单一地址。

### 导入助记词

> ⚠️ 将替换当前 MetaMask 钱包。若已有其他钱包请先备份其助记词。

1. **Import an existing wallet**
2. 按顺序输入 12 或 24 个词
3. 设置密码并完成

默认显示第一个地址；后续地址点 **Add account** 递增添加。

### 添加网络

默认 Ethereum；其他网络可访问 [chainlist.org](https://chainlist.org) 并 **Add to MetaMask**。

手动参数：

| 网络 | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### 用后移除账户

1. 账户菜单
2. 账户旁的 **⋮**
3. **Remove account**

## OKX Wallet

### 安装

- [okx.com/web3](https://www.okx.com/web3) 浏览器扩展
- 手机搜索「OKX Wallet」

### 导入私钥

1. 打开 OKX Wallet
2. **+** → **Import wallet → Private key**
3. 选择 **EVM**、**Bitcoin** 或 **Bitcoin Cash**
4. 粘贴私钥
5. 设置密码

随后在顶部切换网络。

### 导入助记词

1. **Import wallet → Seed phrase**
2. 输入 12 或 24 个词
3. 若需填写派生路径，见下表
4. 设置密码

**DV.net 派生路径：**

| 网络 | 路径 |
|---|---|
| Ethereum 与全部 EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### 按索引找地址

导入助记词后反复点 **Add account**，序号递增，与交易地址比对。

### 删除钱包

1. 钱包管理
2. 钱包旁的 **⋮**
3. **Delete wallet**

> 从应用删除钱包不会删除链上资产，仅移除本地访问。
