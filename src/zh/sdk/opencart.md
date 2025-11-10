# 如何在 OpenCart 中使用 DV.net 支付网关扩展接受加密货币支付

提供加密货币支付可以显著提升你的 OpenCart 商店，吸引更广泛的受众并提供现代化的支付灵活性。DV.net 提供强大的加密货币支付处理解决方案，其 OpenCart 扩展可简化集成过程。
本指南将为你清晰地逐步讲解如何在你的 OpenCart 网站上安装和配置 DV.net 支付网关扩展。

## Prerequisites:

- 一个已上线的 OpenCart 网站。
- 对 OpenCart 仪表盘的管理员访问权限。
- 一个有效的 DV.net 账户。

## Step 1: 获取 DV.net OpenCart 扩展

首先，你需要下载扩展文件。你可以从官方 DV.net GitHub 仓库获取这些文件。

- 前往官方 DV.net OpenCart 扩展仓库：https://github.com/dv-net/dv-opencart。
- 前往 Releases 页面
- 下载 `dv-opencart-vX.X.X.ocmod.zip`

## Step 2: 在你的 OpenCart 站点安装扩展

OpenCart 使用 Extension Installer 处理上传。

- 登录到你的 OpenCart 管理后台（例如，yourdomain.com/admin）。
- 从左侧菜单导航到 Extensions > Installer。
- 点击 Upload 按钮。
- 选择你在第 1 步下载的 .zip 文件
- 等待上传和安装完成。你应会看到成功消息。
- 重要：安装后，前往 Extensions > Modifications，并点击右上角的蓝色 Refresh 按钮，以确保系统识别更改。
- 同样建议清理你的主题缓存。进入 Dashboard，点击右上角的蓝色 Settings 齿轮图标，然后点击 Theme Cache 和 SASS Cache 的 Refresh 按钮。

## Step 3: 获取你的 DV.net API 凭据

要将你的商店连接到 DV.net，需要准备 API Key、API Secret 和 API URL。

- 登录你的 DV.net 账户仪表盘。
- 找到你的项目或创建一个新项目。
- 导航到 API Keys 部分：Projects -> 针对特定项目的 Edit 按钮（参考文档文件中的 obtaining-api-key-and-secret.md）。
- 你将看到 API key 和 secret key。如有需要可以重新生成。
- 在下方的部分提供 webhooks 的 URL。基本上你只需要成功支付的 webhook 即可。

## Step 4: 在 OpenCart 中配置 DV.net 网关

现在，在你的 OpenCart 管理面板中配置该支付方式。

- 在 OpenCart 仪表盘，前往 Extensions > Extensions。
- 在标注为 "Choose the extension type" 的下拉菜单中，选择 Payments。
- 向下滚动列表直到找到 "DV.net Gateway"。如果尚未安装，点击绿色的 Install（+）按钮，然后点击蓝色的 Edit（铅笔）按钮。
- 这将打开 DV.net 配置页面。填写以下信息：
- API URL: 粘贴来自第 3 步的 API URL。
- API Key: 粘贴来自第 3 步的 API Key。
- API Secret: 粘贴来自第 3 步的 API Secret。
- 

## Step 5: 在你的 DV.net 账户中配置 Webhook

你的商店现已设置好向 DV.net 发送支付请求。最后一步是设置 webhook，以便 DV.net 能将支付状态更新（如“Paid”或“Failed”）回传到你的商店。

1. 返回你的 DV.net 账户仪表盘。
2. 导航到 Webhooks 或 Developer 部分。
3. 创建一个新的 webhook。
4. Payload URL：这是最重要的部分。你的商店唯一的 webhook URL 是：`https://example.com/wc-api/dv_gateway/`（记得将 example.com 替换为你的网站实际地址。确保使用 https://）。
5. 在此处填写你的 webhook 地址（对于 woo，大致为 `https://example.com/index.php?route=extension/payment/dv_gateway/callback`），然后点击 Create
6. Events：如果有提示，请选择此 webhook 需要监听的事件。你应启用所有与支付相关的事件，例如：
    1. Confirmed payment
    2. Unconfirmed payment（例如当客户通过 BTC 发送付款时）
    3. Processing withdrawal（此集成目前不支持）
7. 在你的 DV.net 仪表盘中保存并启用该 webhook。

## Step 6: 测试你的集成！

- 你的 DV.net OpenCart 集成现在应已完成！务必执行一次测试交易。
- 访问你的 OpenCart 商店前台。
- 将商品加入购物车。
- 按流程进行结账。
- 在选择支付方式时，选择 "DV.net Gateway"（或你配置的标题，但在 OpenCart 扩展中通常是固定的）。
- 确认订单。你应被重定向到 DV.net 支付页面。
- 强烈建议：完成一笔小额的真实交易。在 DV.net 支付成功后，返回 OpenCart 管理后台 > Sales > Orders。确认测试订单的状态已从“Pending”自动更新为“Paid”（例如“Processing”或“Complete”）。
如果订单状态能在无需手动干预的情况下正确更新，则你的设置已成功！客户现在可以通过 DV.net 在你的 OpenCart 商店使用加密货币付款。