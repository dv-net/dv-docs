# 使用 DV.net WooCommerce 插件在 WordPress 上接受加密货币支付

将加密货币支付网关集成到电商商店，是拓展客户群并提供现代、安全支付选项的绝佳方式。DV.net 为处理此类交易提供了强大的方案，其专用的 WooCommerce 插件让集成过程变得简单直接。
本指南将一步步带你在 WordPress 站点上安装并配置 DV.net WooCommerce 插件。

## 先决条件：

- 一个已运行的 WordPress 网站。
- 已安装并启用 WooCommerce 插件。
- 一个已激活的 DV.net 账户。

## 步骤 1：获取 DV.net WooCommerce 插件

第一步是下载插件文件。与官方 WordPress 插件仓库中的插件不同，你需要从 DV.net 的 GitHub 页面获取该插件。

前往 DV.net WooCommerce 插件的官方仓库：https://github.com/dv-net/dv-woocommerce（你的文件中已提供）。
- 点击右侧菜单中的 Releases。
- 在最新版本的菜单中选择 “Source code (zip)”。
- 将 .zip 文件保存到你的电脑。不要解压。

## 步骤 2：在你的 WordPress 站点安装插件

现在将下载的 ZIP 文件上传到你的 WordPress 管理后台。
1. 登录你的 WordPress 管理后台（例如：yourdomain.com/wp-admin）。
2. 在左侧菜单进入 Plugins > Add New。
3. 在“Add Plugins”页面顶部，点击 Upload Plugin 按钮。
4. 点击 “Choose File” 按钮并选择你刚下载的 dv-woocommerce-main.zip 文件。
5. 点击 Install Now。
6. 当 WordPress 完成插件安装后，点击 Activate Plugin 按钮。
现在你会在已启用插件列表中看到 “DV.net WooCommerce Plugin”。

## 步骤 3：获取你的 DV.net API 凭据

要将你的商店连接到 DV.net，你需要 API Key、API Secret 和 API URL。

- 登录你的 DV.net 账户控制台。
- 找到你的项目或新建一个项目。
- 导航到 Projects -> 针对具体项目的 Edit 按钮 下的 API Keys 部分（参见文档文件中的 obtaining-api-key-and-secret.md）。
- 你会看到 API key 和 secret key，必要时可以重新生成。
- 在下方的部分提供 Webhook 的 URL。基本上你只需要成功付款的 Webhook 即可。

## 步骤 4：在 WooCommerce 中配置 DV.net 网关

拿到 API 凭据后，你可以在 WooCommerce 中配置插件设置。

1. 在 WordPress 仪表盘进入 WooCommerce > Settings。
2. 点击页面顶部的 Payments 选项卡。
3. 在支付方式列表中你会看到 “DV.net”。点击最右侧的 Manage 按钮。
4. 将打开 DV.net 的设置页面。填写以下字段：
   1. Enable/Disable：勾选 “Enable DV.net”，在结账时启用该支付方式。
   2. Title：顾客在选择支付方式时看到的文本。例如：“Pay with Crypto via DV.net”。
   3. Description：显示在标题下方的简短说明。例如：“Securely pay with cryptocurrency.”
   4. API URL：粘贴 API URL。
   5. API Key：粘贴你在步骤 3 中保存的 API Key。
   6. API Secret：粘贴你在步骤 3 中保存的 API Secret。
5. 点击页面底部的 Save changes 按钮保存更改。

## 步骤 5：在你的 DV.net 账户中配置 Webhook

你的商店现在已设置为向 DV.net 发送支付请求。最后一步是设置一个 Webhook，让 DV.net 能把支付状态更新（如 “Paid” 或 “Failed”）回传到你的商店。

1. 返回你的 DV.net 账户控制台。
2. 前往 Webhooks 或 Developer 部分。
3. 新建一个 Webhook。
4. Payload URL：这是最重要的部分。你的商店唯一的 Webhook URL 是：`https://example.com/wc-api/dv_gateway/`（记得将 example.com 替换为你的真实站点地址，并确保使用 https://）。
5. 将你的 Webhook 地址填在此处（对于 WooCommerce，形式类似 `https://example.com/?wc-api=dv_gateway`）
6. Events：如果需要，选择该 Webhook 应监听的事件。你应启用所有与支付相关的事件，例如：
   1. Confirmed payment
   2. Unconfirmed payment（即当客户通过 BTC 发送付款且）
   3. Processing withdrawal（当前此集成不支持）
7. 在 DV.net 控制台中保存并启用该 Webhook。

## 步骤 6：大功告成！（别忘了测试）

恭喜！DV.net 支付网关现已完全集成到你的 WooCommerce 商店。

最后务必进行一次真实测试。最佳做法如下：
1. 以顾客身份访问你的商店。
2. 将一个真实商品加入购物车。
3. 前往结账页面。
4. 选择 “Pay with Crypto via DV.net”（或你设定的标题）。
5. 下单并确认是否正确跳转到 DV.net 支付页面。
6. 我们强烈建议完成一笔小额测试交易，以确认在支付成功后，你的 WooCommerce 订单状态会在 Orders 中从 “Pending payment” 自动更新为 “Processing” 或 “Completed”。

如果订单状态能自动更新，你的集成就成功了！