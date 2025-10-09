# dv.net 的更新与验证

使用操作系统的标准软件包管理器（如 `apt`、`yum` 或 `dnf`）更新 `dv.net` 简单且安全。

## 自动更新验证

每次更新时，您的包管理器都会自动验证软件包的真实性。这是通过我们的公开 GPG 密钥完成的，确保您收到的是原版且未被篡改的软件。您无需手动检查签名——`apt`、`yum` 和 `dnf` 会替您处理。

我们的公钥位于：<https://dv.net/gpg.pub>

------------------------------------------------------------------------

## 查看与检查更新历史

您可以轻松查看所有已安装更新的历史并确保其完整性。

### 适用于 Debian / Ubuntu（使用 `apt`）

更新历史保存在日志文件中。您可以使用以下命令查看：

``` bash
grep "upgrade dv.net" /var/log/dpkg.log
```

或查看更详细的 `apt` 历史：

``` bash
grep "dv.net" /var/log/apt/history.log
```

这些日志显示安装了哪些版本的 `dv.net` 包以及时间。由于 `apt` 会在安装前验证 GPG 签名，日志中的记录即可确认更新成功。

### 适用于 CentOS / RHEL（使用 `yum`）

`yum` 提供了便捷的事务历史查看方式。

``` bash
yum history list dv.net
```

要获取列表中某次更新的详细信息，请使用：

``` bash
yum history info <transaction_ID>
```

该命令会显示事务详情，包括 GPG 密钥验证信息。

### 适用于 Fedora 以及较新的 CentOS / RHEL（使用 `dnf`）

`dnf` 在历史管理方面与 `yum` 使用相同的语法。

``` bash
dnf history list dv.net
```

要获取某次更新的详细信息：

``` bash
dnf history info <transaction_ID>
```

与 `yum` 一样，`dnf` 会显示完整的事务信息，确认软件包在安装前已通过真实性检查。

## 验证直接下载的软件包

即使软件包已安装，您仍可检查其完整性与真实性。所有下载的软件包都会临时保存在包管理器的缓存中，您可以手动验证。这对于进行安全审计或确认先前安装的文件未损坏很有用。

## 适用于 Debian / Ubuntu

默认情况下，`APT` 会在成功安装后删除 `.deb` 文件。要让 `APT` 始终在缓存中保留已下载的软件包，请创建一个配置文件：

``` bash
echo 'APT::Keep-Downloaded-Packages "true";' | sudo tee /etc/apt/apt.conf.d/01keep-debs
```

所有下载的软件包将存储在 `/var/cache/apt/archives/` 中。

### 方法一：GPG 签名验证（推荐）

最可靠的方法是检查软件包的 GPG 签名。这可以确认软件包由我们创建且未被篡改。

``` bash
# Install the utility if missing
sudo apt-get install dpkg-sig

# Verify the signature of a specific package
dpkg-sig --verify /var/cache/apt/archives/dv-updater_*.deb
```

如果检查成功，您将看到 GOODSIG 状态，表示真实性已通过。✅

### 方法二：校验和验证

您也可以通过将其校验和与仓库元数据中列出的值进行比较来检查文件完整性。

1.  使用 `apt-cache` 查看软件包的官方校验和：

    ``` bash
    apt-cache show dv-updater
    ```

    在输出中，找到 **SHA256** 行：

        Package: dv-updater
        Version: 0.0.11~RC01-nightly-20250717T220501Z
        Architecture: amd64
        Maintainer: dv-updater
        Installed-Size: 14500
        Filename: pool/main/d/dv-updater/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
        Size: 6025526
        SHA256: 2c60a10e0a55fb22903497280f78ab66e463e10a11b250c3147eb5672cd929bb
        Description: no description given

2.  计算下载文件的校验和：

    ``` bash
    sha256sum /var/cache/apt/archives/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
    ```

3.  比较结果。哈希值必须与 `apt-cache show` 输出中的值完全一致。

------------------------------------------------------------------------

## 适用于 CentOS / RHEL / Fedora

`dnf` 和 `yum` 包管理器默认会将下载的软件包保存在缓存中。它们通常位于 `/var/cache/dnf/` 下的某个子目录中。

### 方法一：GPG 签名验证（推荐）

使用标准的 `rpm` 工具检查已下载 `.rpm` 文件的签名。这是最规范且最可靠的方法。

``` bash
# Locate the package in the cache and verify it
rpm --checksig /var/cache/dnf/dvnet-*/packages/*.rpm
```

*注意：路径可能因系统版本略有不同。使用 `*` 可自动定位正确的目录。*

如果签名有效，命令输出中针对每个检查的软件包都会包含 `digests signatures OK`。

### 方法二：校验和验证

此方法仅检查文件完整性，不验证其真实性。

1.  从仓库获取该软件包的官方校验和：

    ``` bash
    dnf repoquery --info dv-processing
    ```

    或用于 `yum`：

    ``` bash
    repoquery --info dv-processing
    ```

    在输出中，找到 **Checksum** 行：

        Name         : dv-processing
        Version      : 0.6.6
        ...
        Checksum Type: sha256
        Checksum     : f019a9564433cacf7a1c307e9a358e43cb9a3325abcdef1234567890abcdef
        ...

2.  计算缓存文件的校验和：

    ``` bash
    sha256sum /var/cache/dnf/dvnet-*/packages/dv-processing_0.6.6_linux_amd64.rpm
    ```

3.  比较这两个值。它们必须完全相同。