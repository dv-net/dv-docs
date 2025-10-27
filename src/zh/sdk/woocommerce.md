# 使用 DV.net WooCommerce 插件在 WordPress 上接受加密货币支付

将加密货币支付网关集成到你的电商商店，是扩大客户群并提供现代、安全支付方式的绝佳途径。DV.net 提供了强大的交易处理方案，其专用的 WooCommerce 插件使集成过程变得直观、简单。
本指南将一步步带你在 WordPress 站点上安装并配置 DV.net WooCommerce 插件。

## 前提条件：

- 运行中的 WordPress 网站。
- 已安装并启用 WooCommerce 插件。
- 有效的 DV.net 帐号。

## 步骤 1：获取 DV.net WooCommerce 插件

第一步是下载插件文件。与官方 WordPress 仓库中的插件不同，你需要从 DV.net 的 GitHub 页面获取这个插件。

前往 DV.net WooCommerce 插件的官方仓库：https://github.com/dv-net/dv-woocommerce（此链接已在你的文件中提供）。
- 点击右侧菜单中的 Releases。
- 在最新版本的菜单中选择 "Source code (zip)"。
- 将 .zip 文件保存到你的电脑。不要解压。

## 步骤 2：在你的 WordPress 站点安装插件

现在将下载的 ZIP 文件上传到你的 WordPress 管理后台。
1. 登录你的 WordPress 管理后台（例如：yourdomain.com/wp-admin）。
2. 在左侧菜单中，导航到 Plugins > Add New。
3. 在 “Add Plugins” 页面顶部，点击 Upload Plugin 按钮。
4. 点击 "Choose File" 按钮并选择刚下载的 dv-woocommerce-main.zip 文件。
5. 点击 Install Now。
6. WordPress 安装完成后，点击 Activate Plugin 按钮。
你现在会在已启用插件列表中看到 "DV.net WooCommerce Plugin"。

## 步骤 3：获取你的 DV.net API 凭证

在插件开始工作之前，你需要使用 API 密钥将其连接到你的 DV.net 帐号。

1. 登录你的 DV.net 帐号控制台。
2. 前往 API Keys 部分（参考 obtaining-api-key-and-secret.md 文件）。
3. 点击 "Create New Key" 按钮。
4. 为你的密钥设置一个易识别的名称（例如："WooCommerce Store"）。
5. 系统会生成一个 API Key 和一个 API Secret。
6. 重要提示：复制 API Key 和 API Secret，并将其保存在安全的位置（如密码管理器）。离开该页面后将无法再次查看 Secret。
7. 同时记录你的 API URL。这是你的 DV.net 实例的主 API 地址（例如：https://api.your-dv-instance.com）。

## 步骤 4：在 WooCommerce 中配置 DV.net 网关

拿到 API 密钥后，你可以在 WooCommerce 内配置插件的相关设置。

1. 在 WordPress 仪表盘进入 WooCommerce > Settings。
2. 点击页面顶部的 Payments 选项卡。
3. 在支付方式列表中会看到 "DV.net"。点击最右侧的 Manage 按钮。
4. 将打开 DV.net 设置页面。填写以下字段（来源于 class-dv-gateway.php 文件）：
   1. Enable/Disable：勾选 "Enable DV.net"，在结账时启用此支付方式。
   2. Title：客户在选择支付方式时看到的标题。例如："Pay with Crypto via DV.net"。
   3. Description：显示在标题下方的简短说明。例如："Securely pay with cryptocurrency."。
   4. API URL：粘贴你在步骤 3 中记录的 API URL。
   5. API Key：粘贴你在步骤 3 中生成的 API Key。
   6. API Secret：粘贴你在步骤 3 中保存的 API Secret。
   7. Webhook Secret：这是一个至关重要的安全字段。你需要创建一个强壮且唯一的密钥短语（可使用密码生成器）。它相当于 DV.net 与你的商店共享的密码。请保存此密钥，你将在下一步用到它。
5. 点击页面底部的 Save changes 按钮保存更改。

## 步骤 5：在你的 DV.net 帐号中配置 Webhook

你的商店现已能够向 DV.net 发送支付请求。最后一步是设置一个 Webhook，让 DV.net 能够将支付状态更新（如 "Paid" 或 "Failed"）发送回你的商店。

1. 返回你的 DV.net 帐号控制台。
2. 进入 Webhooks 或 Developer 部分。
3. 创建一个新的 Webhook。
4. Payload URL：这是最重要的部分。你的商店专属的 Webhook URL 为：https://yourdomain.com/wc-api/dv_gateway/（请将 yourdomain.com 替换为你的实际站点域名，并确保使用 https://）。
5. Secret：粘贴你在步骤 4 中创建并保存的同一个 Webhook Secret。该密钥用于验证传入请求确实来自 DV.net（参见 webhook-signature-verification.md）。
6. Events：如果有提示，请选择该 Webhook 需要监听的事件。应启用所有与支付相关的事件，例如：
   1. payment.completed
   2. payment.failed
   3. invoice.paid（注意：事件名称可能略有不同。请选择所有与支付状态变更相关的事件。）
7. 在 DV.net 控制台中保存并启用该 Webhook。

## 第 6 步：一切就绪！（别忘了测试）

恭喜！DV.net 支付网关已成功集成到你的 WooCommerce 商店。

最后请进行一次真实环境测试。最佳测试方式如下：
1. 以顾客身份访问你的商店。
2. 将一个真实商品加入购物车。
3. 前往结账页面。
4. 选择 "Pay with Crypto via DV.net"（或你设置的标题）。
5. 下单并确认页面正确跳转到 DV.net 支付页面。
6. 强烈建议完成一笔小额测试交易，以确认支付成功后 WooCommerce 订单状态能在 Orders 中从 "Pending payment" 自动更新为 "Processing" 或 "Completed"。

如果订单状态能自动更新，你的集成就大功告成了！