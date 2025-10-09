# Verifizierung von Paketen und installierter Software

## Überprüfung der Authentizität unserer Pakete mit GPG

All unsere `.deb`- und `.rpm`-Pakete sowie deren Prüfsummen sind kryptografisch mit GPG-Schlüsseln signiert. Das stellt sicher, dass die von Ihnen heruntergeladenen Pakete von uns erstellt wurden und nicht von Dritten verändert oder beschädigt wurden. Sie können die Authentizität eines Pakets einfach mit unserem öffentlichen Schlüssel überprüfen.

Sämtlicher Quellcode des Projekts, die entsprechenden kompilierten Programme sowie `.deb`- und `.rpm`-Pakete werden in Releases auf github.com veröffentlicht. Die zugehörigen Signaturen befinden sich dort ebenfalls, in `.sig`-Dateien.

Beispiel: https://github.com/dv-net/dv-merchant/releases/tag/v0.9.4

![github-signed-assets.png](../../assets/images/security/github-signed-assets.png)

-----

### Schritt 1: Unseren öffentlichen GPG-Schlüssel importieren

Zunächst müssen Sie unseren öffentlichen Schlüssel in Ihren Schlüsselbund importieren. Das ist nur einmal erforderlich. 
Unser Schlüssel ist unter [https://dv.net/gpg.pub](https://dv.net/gpg.pub) veröffentlicht.

Speichern Sie den öffentlichen Schlüssel auf Ihrem Server:

```bash
curl https://dv.net/gpg.pub -o dv-net.asc
```

Importieren Sie ihn anschließend in Ihren Schlüsselbund:

```bash
gpg --import dv-net.asc
```

-----

### Schritt 2: Die Paket-Signatur verifizieren

Nach dem Import des Schlüssels können Sie die Signatur jedes heruntergeladenen Pakets überprüfen.

#### Für .deb-Pakete (Debian/Ubuntu)

Um ein `.deb`-Paket zu überprüfen, verwenden Sie den Befehl `dpkg-sig`. Falls er nicht installiert ist, können Sie ihn mit 
`sudo apt-get install dpkg-sig` installieren.

```bash
dpkg-sig --verify package_name.deb
```

Wenn die Signatur gültig ist, sehen Sie in der Ausgabe einen GOODSIG-Status von einem vertrauenswürdigen Schlüssel.

#### Für .rpm-Pakete (Fedora/CentOS/RHEL)

Um ein `.rpm`-Paket zu überprüfen, verwenden Sie den Befehl `rpm`.

```bash
rpm --checksig package_name.rpm
```

Wenn die Signatur korrekt ist, zeigt die Ausgabe des Befehls, dass alle Prüfungen (einschließlich `gpg`) erfolgreich bestanden wurden (`OK`).

Wenn Sie diese einfachen Schritte befolgen, können Sie die Integrität und Authentizität unserer Softwarepakete sicherstellen.