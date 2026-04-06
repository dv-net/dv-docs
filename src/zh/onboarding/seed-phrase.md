# 助记词：导出、导入与充值地址查找

助记词是商户的主密钥，所有热钱包地址均由其推导。掌握助记词可恢复任意地址并枚举曾生成的充值地址。

> ⚠️ **助记词是最高敏感信息。** 知情者可动用全部钱包。请离线妥善保管，切勿泄露。

## 导出助记词

1. **Transfers → Hot Wallets**
2. 右上角 **Download seed phrases**
3. 完成双重身份验证
4. 安全保存文件

> 建议纸质备份或使用未联网设备。

## 在钱包中导入助记词

导入后可通过标准加密钱包访问商户全部地址。

### MetaMask（EVM）

1. 安装 [MetaMask](https://metamask.io)
2. 欢迎页选择 **Import an existing wallet**
3. 按顺序输入 12 或 24 个词
4. 设置密码并完成
5. 在顶部切换到目标网络

> MetaMask 支持 Ethereum、Base、BNB Chain、Polygon、Arbitrum 等全部 EVM 网络。

### OKX Wallet（EVM + BTC 等）

1. 安装 [OKX Wallet](https://www.okx.com/web3)
2. **Import wallet → Seed phrase**
3. 按顺序输入助记词
4. 设置密码
5. 选择网络或币种

> OKX 同时支持 EVM、Bitcoin、Bitcoin Cash 等多链。

## 用助记词查找充值地址

DV.net 使用标准派生路径。

### 标准路径

| 网络 | 派生路径 |
|---|---|
| Ethereum 及全部 EVM | `m/44'/60'/0'/0/N` |
| Bitcoin（Legacy） | `m/44'/0'/0'/0/N` |
| Bitcoin（SegWit） | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N` 为地址索引（0, 1, 2, …）。

### 查找指定地址

使用可列出派生地址、索引与私钥的工具最为省事。

#### 工具：iancoleman BIP39

[iancoleman.io/bip39](https://iancoleman.io/bip39/) — 开源，可保存网页后离线使用。

> ⚠️ **务必离线输入助记词。** 先「另存为」页面，断网后再输入。勿在他人设备或联网时输入。

**步骤：**

1. 打开页面并保存（Ctrl+S / Cmd+S）
2. 断网后打开本地文件
3. 在 **BIP39 Mnemonic** 填入助记词
4. **Coin** 中选：`ETH — Ethereum`（各 EVM）、`BTC`、`BCH` 等
5. **Derivation Path** 中选 **BIP44** 或 **BIP84**（SegWit）
6. 在 **Derived Addresses** 表格中查找与交易一致的地址
7. 复制对应私钥导入钱包

默认显示索引 0–19；可用 **Show more rows** 或 **starting from index** 扩展。

> 多数地址在 0–1000 内；前 20 个没有可每次多展 20 行。
