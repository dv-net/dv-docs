# 如何在 OpenCart 上使用 DV.net 支付网关扩展接受加密货币支付

提供加密货币支付可以显著提升你的 OpenCart 商店，吸引更广泛的受众并提供现代化的支付灵活性。DV.net 提供完善的加密支付处理方案，其 OpenCart 扩展简化了集成流程。
本指南将为你清晰地逐步讲解如何在 OpenCart 网站上安装和配置 DV.net 支付网关扩展。

## 先决条件：

- 一个已上线的 OpenCart 网站。
- 对你的 OpenCart 后台的管理员访问权限。
- 一个已激活的 DV.net 账户。

## 步骤 1：获取 DV.net OpenCart 扩展

首先，你需要下载扩展文件。你可以从官方 DV.net GitHub 仓库获取。

- 访问官方 DV.net OpenCart 扩展仓库：https://github.com/dv-net/dv-opencart
- 进入 Releases 页面
- 下载 `dv-opencart-vX.X.X.ocmod.zip`

## 步骤 2：在你的 OpenCart 站点安装扩展

OpenCart 使用 Extension Installer 来处理上传。

- 登录你的 OpenCart 管理后台（例如：yourdomain.com/admin）。
- 从左侧菜单进入 Extensions > Installer。
- 点击 Upload 按钮。
- 选择你在步骤 1 中下载的 .zip 文件。
- 等待上传和安装完成。你应当会看到成功提示。
- 重要：安装完成后，进入 Extensions > Modifications，并点击右上角的蓝色 Refresh 按钮，确保系统识别到更改。
- 建议同时清除主题缓存。进入 Dashboard，点击右上角的蓝色 Settings 齿轮图标，然后点击 Theme Cache 和 SASS Cache 的 Refresh 按钮。

## 步骤 3：获取你的 DV.net API 凭据

要将你的商店连接到 DV.net，你需要 API Key、API Secret 和 API URL。

- 登录你的 DV.net 账户后台。
- 进入 API Keys 部分（参阅文档文件中的 obtaining-api-key-and-secret.md）。
- 点击 "Create New Key"。
- 为该密钥设置一个相关名称（例如："OpenCart Store"）。
- 系统会显示你的 API Key 和 API Secret。
- 重要：立即复制 API Key 和 API Secret，并安全保存（例如保存在密码管理器中）。Secret 不会再次显示。
- 记下你的 API URL，即你的 DV.net 实例的基础 URL（例如：https://api.your-dv-instance.com）。

## 步骤 4：在 OpenCart 中配置 DV.net 网关

现在，在 OpenCart 管理面板中配置该支付方式。

- 在 OpenCart 后台进入 Extensions > Extensions。
- 在 “Choose the extension type” 下拉菜单中选择 Payments。
- 向下滚动列表，找到 "DV.net Gateway"。如果尚未安装，点击绿色 Install（+）按钮，然后点击蓝色 Edit（铅笔）按钮。
- 将打开 DV.net 配置页面。填写以下信息（基于 admin/controller/extension/payment/dv_gateway.php 及相关语言/模板文件）：
- API URL：粘贴步骤 3 中的 API URL。
- API Key：粘贴步骤 3 中的 API Key。
- API Secret：粘贴步骤 3 中的 API Secret。

## 步骤 5：测试你的集成！

- 现在你的 DV.net OpenCart 集成应已完成！强烈建议执行一次测试交易。
- 访问你的 OpenCart 商店前台。
- 将一个商品加入购物车。
- 按流程完成结账。
- 在选择支付方式时，选择 "DV.net Gateway"（或已配置的标题，但在 OpenCart 扩展中通常是固定的）。
- 确认订单。你应当会被重定向到 DV.net 支付页面。
- 强烈建议：完成一笔小额的真实交易。在 DV.net 支付成功后，回到 OpenCart 管理后台 > Sales > Orders。核实该测试订单的状态是否已自动从“Pending”状态更新为“Paid”状态（例如 “Processing” 或 “Complete”）。
如果订单状态能在无需人工干预的情况下正确更新，你的设置就成功了！现在客户可以通过 DV.net 在你的 OpenCart 商店使用加密货币进行支付。