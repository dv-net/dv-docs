# Aktualisierung und Verifizierung von dv.net

Die Aktualisierung von `dv.net` ist einfach und sicher mit den Standard-Paketverwaltungen Ihres Betriebssystems, wie `apt`, `yum` oder `dnf`.

## Automatische Aktualisierungsverifizierung

Bei jeder Aktualisierung überprüft Ihre Paketverwaltung die Authentizität der Pakete automatisch. Dies geschieht mit unserem öffentlichen GPG-Schlüssel, der sicherstellt, dass Sie echte und unveränderte Software erhalten. Sie müssen keine manuellen Schritte zur Signaturprüfung durchführen --- `apt`, `yum` und `dnf` übernehmen das für Sie.

Unser öffentlicher Schlüssel ist verfügbar unter: <https://dv.net/gpg.pub>

------------------------------------------------------------------------

## Anzeigen und Prüfen des Aktualisierungsverlaufs

Sie können den Verlauf aller installierten Updates leicht einsehen und ihre Integrität sicherstellen.

### Für Debian / Ubuntu (mit `apt`)

Der Aktualisierungsverlauf wird in Protokolldateien gespeichert. Sie können ihn mit folgendem Befehl anzeigen:

``` bash
grep "upgrade dv.net" /var/log/dpkg.log
```

Oder für eine detailliertere `apt`-Historie:

``` bash
grep "dv.net" /var/log/apt/history.log
```

Diese Protokolle zeigen, welche Versionen des `dv.net`-Pakets wann installiert wurden. Da `apt` vor der Installation GPG-Signaturen überprüft, bestätigt ein Eintrag im Protokoll eine erfolgreiche Aktualisierung.

### Für CentOS / RHEL (mit `yum`)

`yum` bietet eine bequeme Möglichkeit, den Transaktionsverlauf anzuzeigen.

``` bash
yum history list dv.net
```

Um detaillierte Informationen zu einer bestimmten Aktualisierung aus der Liste zu erhalten, verwenden Sie:

``` bash
yum history info <transaction_ID>
```

Dieser Befehl zeigt Transaktionsdetails an, einschließlich Informationen zur GPG-Schlüsselprüfung.

### Für Fedora und neuere Versionen von CentOS / RHEL (mit `dnf`)

`dnf` verwendet für die Verlaufsverwaltung die gleiche Syntax wie `yum`.

``` bash
dnf history list dv.net
```

Um detaillierte Informationen zu einer bestimmten Aktualisierung zu erhalten:

``` bash
dnf history info <transaction_ID>
```

Wie `yum` zeigt `dnf` vollständige Transaktionsinformationen an und bestätigt damit, dass das Paket die Authentizitätsprüfungen vor der Installation bestanden hat.

## Überprüfung direkt heruntergeladener Pakete

Auch nachdem ein Paket installiert wurde, können Sie seine Integrität und Authentizität prüfen. Alle heruntergeladenen Pakete werden vorübergehend im Cache der Paketverwaltung gespeichert, wo sie manuell verifiziert werden können. Dies ist nützlich für Sicherheitsprüfungen oder um zu bestätigen, dass eine zuvor installierte Datei nicht beschädigt wurde.

## Für Debian / Ubuntu

Standardmäßig löscht `APT` `.deb`-Dateien nach erfolgreicher Installation. Damit `APT` heruntergeladene Pakete stets im Cache behält, erstellen Sie eine Konfigurationsdatei:

``` bash
echo 'APT::Keep-Downloaded-Packages "true";' | sudo tee /etc/apt/apt.conf.d/01keep-debs
```

Alle heruntergeladenen Pakete werden in `/var/cache/apt/archives/` gespeichert.

### Methode 1: GPG-Signaturprüfung (empfohlen)

Die zuverlässigste Methode ist die Prüfung der GPG-Signatur des Pakets. Dadurch wird bestätigt, dass das Paket von uns erstellt wurde und nicht verändert wurde.

``` bash
# Install the utility if missing
sudo apt-get install dpkg-sig

# Verify the signature of a specific package
dpkg-sig --verify /var/cache/apt/archives/dv-updater_*.deb
```

Wenn die Prüfung erfolgreich ist, sehen Sie den Status GOODSIG, der die Authentizität bestätigt. ✅

### Methode 2: Prüfsummenüberprüfung

Sie können die Dateiintegrität auch überprüfen, indem Sie ihre Prüfsumme mit der in den Repository-Metadaten aufgeführten vergleichen.

1.  Offizielle Prüfsumme des Pakets mit `apt-cache` prüfen:

    ``` bash
    apt-cache show dv-updater
    ```

    Suchen Sie in der Ausgabe die Zeile **SHA256**:

        Package: dv-updater
        Version: 0.0.11~RC01-nightly-20250717T220501Z
        Architecture: amd64
        Maintainer: dv-updater
        Installed-Size: 14500
        Filename: pool/main/d/dv-updater/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
        Size: 6025526
        SHA256: 2c60a10e0a55fb22903497280f78ab66e463e10a11b250c3147eb5672cd929bb
        Description: no description given

2.  Prüfsumme der heruntergeladenen Datei berechnen:

    ``` bash
    sha256sum /var/cache/apt/archives/dv-updater_0.0.11~RC01-nightly-20250717T220501Z_amd64.deb
    ```

3.  Ergebnisse vergleichen. Die Hash-Ausgabe muss exakt mit der aus `apt-cache show` übereinstimmen.

------------------------------------------------------------------------

## Für CentOS / RHEL / Fedora

Die Paketverwaltungen `dnf` und `yum` speichern heruntergeladene Pakete standardmäßig im Cache. Sie befinden sich in der Regel in einem Unterverzeichnis innerhalb von `/var/cache/dnf/`.

### Methode 1: GPG-Signaturprüfung (empfohlen)

Verwenden Sie das Standardwerkzeug `rpm`, um die Signatur einer heruntergeladenen `.rpm`-Datei zu prüfen. Dies ist die korrekteste und zuverlässigste Methode.

``` bash
# Locate the package in the cache and verify it
rpm --checksig /var/cache/dnf/dvnet-*/packages/*.rpm
```

*Hinweis: Der Pfad kann je nach Systemversion leicht abweichen. Das `*` hilft, das richtige Verzeichnis automatisch zu finden.*

Ist die Signatur gültig, enthält die Befehlsausgabe für jedes geprüfte Paket `digests signatures OK`.

### Methode 2: Prüfsummenüberprüfung

Diese Methode prüft die Integrität der Datei, jedoch nicht deren Authentizität.

1.  Offizielle Prüfsumme des Pakets aus dem Repository abrufen:

    ``` bash
    dnf repoquery --info dv-processing
    ```

    Oder für `yum`:

    ``` bash
    repoquery --info dv-processing
    ```

    Suchen Sie in der Ausgabe die Zeile **Checksum**:

        Name         : dv-processing
        Version      : 0.6.6
        ...
        Checksum Type: sha256
        Checksum     : f019a9564433cacf7a1c307e9a358e43cb9a3325abcdef1234567890abcdef
        ...

2.  Prüfsumme für die zwischengespeicherte Datei berechnen:

    ``` bash
    sha256sum /var/cache/dnf/dvnet-*/packages/dv-processing_0.6.6_linux_amd64.rpm
    ```

3.  Vergleichen Sie beide Werte. Sie müssen identisch sein.