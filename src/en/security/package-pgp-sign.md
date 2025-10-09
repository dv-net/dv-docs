# Verification of Packages and Installed Software

## Verifying the Authenticity of Our Packages with GPG

All our `.deb` and `.rpm` packages and their checksums are cryptographically signed using GPG keys. This ensures that 
the packages you download were created by us and have not been altered or corrupted by third parties. You can easily 
verify the authenticity of a package using our public key.

All project source code, corresponding compiled executables, as well as `.deb` and `.rpm` packages are published in 
releases on github.com. Their corresponding signatures are located there as well, in `.sig` files.

Example: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

![github-signed-assets.png](../../assets/images/security/github-signed-assets.png)

-----

### Step 1: Import Our Public GPG Key

First, you need to import our public key into your keychain. This only needs to be done once. 
Our key is published at [https://dv.net/gpg.pub](https://dv.net/gpg.pub)

Save the public key to your server:

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

Then, import it into your keychain:

```bash
gpg --import dv-net.asc
```

-----

### Step 2: Verify the Package Signature

After importing the key, you can verify the signature of any package you have downloaded.

#### For .deb packages (Debian/Ubuntu)

To verify a `.deb` package, use the `dpkg-sig` command. If it is not installed, you can install it with 
`sudo apt-get install dpkg-sig`.

```bash
dpkg-sig --verify package_name.deb
```

If the signature is valid, you will see a **GOODSIG** status from a trusted key in the output.

#### For .rpm packages (Fedora/CentOS/RHEL)

To verify an `.rpm` package, use the `rpm` command.

```bash
rpm --checksig package_name.rpm
```

If the signature is correct, the command's output will show that all checks (including `gpg`) have passed 
successfully (`OK`).

Following these simple steps will help you ensure the integrity and authenticity of our software packages.