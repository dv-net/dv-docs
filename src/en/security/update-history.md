# Update and Verification of dv.net

Updating `dv.net` is simple and secure using the standard package
managers of your operating system, such as `apt`, `yum`, or `dnf`.

## Automatic Update Verification

With every update, your package manager **automatically verifies the
authenticity** of the packages. This is done using our public GPG key,
which ensures that you receive genuine and unmodified software. You do
not need to perform any manual actions to check the signature --- `apt`,
`yum`, and `dnf` handle this for you.

Our public key is available at: <https://dv.net/gpg.pub>

------------------------------------------------------------------------

## Viewing and Checking Update History

You can easily review the history of all installed updates and ensure
their integrity.

### For Debian / Ubuntu (using `apt`)

The update history is stored in log files. You can view them with the
following command:

``` bash
grep "upgrade dv.net" /var/log/dpkg.log
```

Or for a more detailed `apt` history:

``` bash
grep "dv.net" /var/log/apt/history.log
```

These logs show which versions of the `dv.net` package were installed
and when. Since `apt` verifies GPG signatures before installation, a
record in the log confirms a successful update.

### For CentOS / RHEL (using `yum`)

`yum` provides a convenient way to view transaction history.

``` bash
yum history list dv.net
```

To get detailed information about a specific update from the list, use:

``` bash
yum history info <transaction_ID>
```

This command will display transaction details, including GPG key
verification info.

### For Fedora and newer versions of CentOS / RHEL (using `dnf`)

`dnf` uses the same syntax as `yum` for history management.

``` bash
dnf history list dv.net
```

To get detailed information about a specific update:

``` bash
dnf history info <transaction_ID>
```

Like `yum`, `dnf` will show full transaction information, confirming
that the package passed authenticity checks before installation.

## Verifying Directly Downloaded Packages

Even after a package is installed, you can check its integrity and
authenticity. All downloaded packages are temporarily stored in the
package manager's cache, where they can be verified manually. This is
useful for security audits or confirming that a previously installed
file was not corrupted.

## For Debian / Ubuntu

By default, `APT` deletes `.deb` files after successful installation. To
make `APT` always keep downloaded packages in the cache, create a
configuration file:

``` bash
echo 'APT::Keep-Downloaded-Packages "true";' | sudo tee /etc/apt/apt.conf.d/01keep-debs
```

All downloaded packages will be stored in `/var/cache/apt/archives/`.

### Method 1: GPG Signature Verification (Recommended)

The most reliable way is to check the GPG signature of the package. This
confirms that the package was created by us and has not been altered.

``` bash
# Install the utility if missing
sudo apt-get install dpkg-sig

# Verify the signature of a specific package
dpkg-sig --verify /var/cache/apt/archives/dv-updater_*.deb
```

If the check is successful, you will see the **GOODSIG** status,
indicating authenticity. ✅

### Method 2: Checksum Verification

You can also check file integrity by comparing its checksum with the one
listed in the repository metadata.

1.  **Check the official checksum** of the package using `apt-cache`:

    ``` bash
    apt-cache show dv-updater
    ```

    In the output, find the **SHA256** line:

        Package: dv-updater
        Version: 0.0.11~RC01-nightly-20250717T220501Z
        Architecture: amd64
        Maintainer: dv-updater
        Installed-Size: 14500
        Filename: pool/main/d/dv-updater/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
        Size: 6025526
        SHA256: 2c60a10e0a55fb22903497280f78ab66e463e10a11b250c3147eb5672cd929bb
        Description: no description given

2.  **Calculate the checksum** of the downloaded file:

    ``` bash
    sha256sum /var/cache/apt/archives/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
    ```

3.  **Compare the results.** The hash output should exactly match the
    one from `apt-cache show`.

------------------------------------------------------------------------

## For CentOS / RHEL / Fedora

The `dnf` and `yum` package managers save downloaded packages in the
cache by default. They are usually located in a subdirectory inside
`/var/cache/dnf/`.

### Method 1: GPG Signature Verification (Recommended)

Use the standard `rpm` utility to check the signature of a downloaded
`.rpm` file. This is the most proper and reliable method.

``` bash
# Locate the package in the cache and verify it
rpm --checksig /var/cache/dnf/dvnet-*/packages/*.rpm
```

*Note: the path may differ slightly depending on your system version.
The `*` helps automatically locate the right directory.*

If the signature is valid, the command output for each checked package
will contain `digests signatures OK`.

### Method 2: Checksum Verification

This method checks the file's integrity, but not its authenticity.

1.  **Get the official checksum** of the package from the repository:

    ``` bash
    dnf repoquery --info dv-processing
    ```

    Or for `yum`:

    ``` bash
    repoquery --info dv-processing
    ```

    In the output, find the **Checksum** line:

        Name         : dv-processing
        Version      : 0.6.6
        ...
        Checksum Type: sha256
        Checksum     : f019a9564433cacf7a1c307e9a358e43cb9a3325abcdef1234567890abcdef
        ...

2.  **Calculate the checksum** for the cached file:

    ``` bash
    sha256sum /var/cache/dnf/dvnet-*/packages/dv-processing_0.6.6_linux_amd64.rpm
    ```

3.  **Compare the two values.** They must be identical.
