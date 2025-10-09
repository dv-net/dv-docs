# 集成示例

在本指南中，我们将展示如何将加密货币支付集成到常见的电商平台和 Web 应用中。无论您使用何种技术栈，都可以轻松在网站上接受加密货币支付。

## 集成能力概览

我们的支付网关为多种平台提供灵活方案：

- **WooCommerce (WordPress)** — 开箱即用的网店插件
- **Express.js** — 面向 Node.js 应用的 RESTful API 集成
- **通用 API** — 适用于任何平台或编程语言

## WooCommerce 集成

WooCommerce 是在 WordPress 上创建网店的最受欢迎平台之一。将加密货币支付与 WooCommerce 集成，您即可在无需复杂设置的情况下接受 Bitcoin、Ethereum 等多种加密货币。

### 使用 WooCommerce 的优势

- ✅ **易于安装** — 通过 WordPress 管理面板几分钟内完成安装
- ✅ **自动换算** — 基于当前汇率自动计算加密货币金额
- ✅ **安全性** — 所有交易通过区块链保护并验证
- ✅ **支持多种加密货币** — Bitcoin、Ethereum、USDT、USDC 等
- ✅ **即时通知** — 通过 Webhook 系统跟踪支付状态

### 演示示例

您可以在我们的演示站点测试插件功能：

🔗 **[WooCommerce 演示](https://woocommerce.dv-net.store/)**

### 工作原理

当客户下单时：
- 在结账页面选择加密货币支付
- 获取用于转账的唯一钱包地址
- 查看用于快速移动支付的二维码
- 获得所选加密货币的准确支付金额

区块链确认交易后，订单状态会通过 Webhook 系统自动更新。

## Express.js 集成

Express.js 是一个流行的 Node.js Web 框架，广泛用于构建 Web 应用和 API。通过 RESTful API 集成加密货币支付，可构建灵活且可扩展的解决方案。

### 使用 Express.js 的优势

- ✅ **完全掌控** — 可完全自定义支付处理逻辑
- ✅ **RESTful API** — 现代化的集成方式
- ✅ **异步处理** — 使用 async/await 处理支付
- ✅ **灵活性** — 可融入任意业务逻辑
- ✅ **可扩展性** — 适用于任何规模的项目

### 演示示例

在实际示例中测试该集成：

🔗 **[Express.js 演示](https://express.dv-net.store/)**

## 源代码与示例

所有集成示例均为开源：

- 🛒 **[WooCommerce 插件](https://github.com/dv-net/dv-woocommerce)** — 开箱即用的 WordPress 插件
- 🚀 **[Express.js 演示](https://github.com/dv-net/dv-net-js-client-demo)** — 功能完整的 Node.js 演示