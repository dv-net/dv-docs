# Verification of Packages and Installed Software

## Verifying the Authenticity of Our Packages with GPG

All our `.deb` and `.rpm` packages and their checksums are cryptographically signed using GPG keys. This ensures that 
the packages you download were created by us and have not been altered or corrupted by third parties. You can easily 
verify the authenticity of a package using our public key.

All project source code, corresponding compiled executables, as well as `.deb` and `.rpm` packages are published in 
releases on github.com. Their corresponding signatures are located there as well, in `.sig` files.

Example: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

<a href="../../assets/images/security/github-signed-assets.png" target="_blank" rel="noopener noreferrer" onclick="event.preventDefault(); const img = this.querySelector('img'); const openImage = () => { try { const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const dataUrl = canvas.toDataURL('image/png'); const w = window.open('', '_blank'); if (w) { w.document.write('<html><head><title>GitHub Signed Assets</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;}img{max-width:100%;max-height:100%;object-fit:contain;}</style></head><body><img src=\'' + dataUrl + '\' alt=\'GitHub Signed Assets\' /></body></html>'); w.document.close(); } } catch(e) { window.open(this.href, '_blank'); } }; if (img && img.complete && img.naturalWidth > 0) { openImage(); } else if (img) { img.onload = openImage; img.onerror = () => window.open(this.href, '_blank'); } else { window.open(this.href, '_blank'); } return false;">
  <img src="../../assets/images/security/github-signed-assets.png" alt="GitHub Signed Assets" style="max-width: 100%; cursor: zoom-in;" loading="lazy" />
</a>

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