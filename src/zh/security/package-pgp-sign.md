# 验证软件包和已安装软件

## 使用 GPG 验证我们软件包的真实性

我们所有的 `.deb` 和 `.rpm` 软件包及其校验和均使用 GPG 密钥进行加密签名。这确保了您下载的软件包由我们创建，且未被第三方篡改或损坏。您可以使用我们的公钥轻松验证软件包的真实性。

所有项目源代码、对应编译的可执行文件，以及 `.deb` 和 `.rpm` 软件包都在 github.com 的 releases 中发布。相应的签名也位于同处，以 `.sig` 文件形式提供。

示例: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

<a href="../../assets/images/security/github-signed-assets.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>GitHub 签名资源</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'GitHub 签名资源\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/github-signed-assets.png" alt="GitHub 签名资源" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

-----

### 步骤 1：导入我们的 GPG 公钥

首先，您需要将我们的公钥导入到您的密钥环中。此操作只需进行一次。  
我们的密钥发布在 [https://dv.net/gpg.pub](https://dv.net/gpg.pub)

将公钥保存到您的服务器：

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

然后，将其导入到您的密钥环：

```bash
gpg --import dv-net.asc
```

-----

### 步骤 2：验证软件包签名

导入密钥后，您可以验证任意已下载软件包的签名。

#### 适用于 .deb 包（Debian/Ubuntu）

要验证 `.deb` 包，请使用 `dpkg-sig` 命令。若未安装，可通过 
`sudo apt-get install dpkg-sig` 进行安装。

```bash
dpkg-sig --verify package_name.deb
```

如果签名有效，输出中会显示来自受信任密钥的 **GOODSIG** 状态。

#### 适用于 .rpm 包（Fedora/CentOS/RHEL）

要验证 `.rpm` 包，请使用 `rpm` 命令。

```bash
rpm --checksig package_name.rpm
```

如果签名正确，命令输出会显示所有检查（包括 `gpg`）均通过（`OK`）。

按照这些简单步骤操作，可帮助您确保我们软件包的完整性与真实性。