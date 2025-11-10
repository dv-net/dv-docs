# So akzeptieren Sie Krypto-Zahlungen in OpenCart mit der DV.net Payment-Gateway-Erweiterung

Das Anbieten von Kryptowährungszahlungen kann Ihren OpenCart-Shop deutlich aufwerten, eine breitere Zielgruppe ansprechen und moderne Zahlungsflexibilität bieten. DV.net stellt eine robuste Lösung zur Verarbeitung von Krypto-Zahlungen bereit, und die OpenCart-Erweiterung vereinfacht die Integration erheblich.
Diese Anleitung führt Sie Schritt für Schritt durch die Installation und Konfiguration der DV.net-Payment-Gateway-Erweiterung auf Ihrer OpenCart-Website.

## Voraussetzungen:

- Eine aktive OpenCart-Website.
- Administratorzugriff auf Ihr OpenCart-Dashboard.
- Ein aktives DV.net-Konto.

## Schritt 1: DV.net-OpenCart-Erweiterung beschaffen

Laden Sie zunächst die Erweiterungsdateien herunter. Diese erhalten Sie aus dem offiziellen DV.net-GitHub-Repository.

- Navigieren Sie zum offiziellen DV.net-OpenCart-Erweiterungs-Repository: https://github.com/dv-net/dv-opencart.
- Gehen Sie zur Releases-Seite
- Laden Sie die `dv-opencart-vX.X.X.ocmod.zip` herunter

## Schritt 2: Erweiterung auf Ihrer OpenCart-Website installieren

OpenCart verwendet einen Extension Installer, um Uploads zu verarbeiten.

- Melden Sie sich beim OpenCart-Admin-Dashboard an (z. B. yourdomain.com/admin).
- Navigieren Sie im linken Menü zu Extensions > Installer.
- Klicken Sie auf die Schaltfläche Upload.
- Wählen Sie die in Schritt 1 heruntergeladene .zip-Datei aus
- Warten Sie, bis Upload und Installation abgeschlossen sind. Es sollte eine Erfolgsmeldung erscheinen.
- Wichtig: Gehen Sie nach der Installation zu Extensions > Modifications und klicken Sie oben rechts auf die blaue Schaltfläche Refresh, damit das System die Änderungen übernimmt.
- Es ist außerdem sinnvoll, den Theme-Cache zu leeren. Gehen Sie zum Dashboard, klicken Sie oben rechts auf das blaue Einstellungszahnrad und anschließend auf die Refresh-Schaltflächen für Theme Cache und SASS Cache.

## Schritt 3: DV.net-API-Zugangsdaten abrufen

Um Ihren Shop mit DV.net zu verbinden, benötigen Sie API Key, API Secret und API URL.

- Melden Sie sich beim DV.net-Konto-Dashboard an.
- Suchen Sie Ihr Projekt oder erstellen Sie ein neues.
- Navigieren Sie zum Bereich API Keys zu Projects -> Edit-Button für das spezifische Projekt (verweisend auf obtaining-api-key-and-secret.md aus den Dokumentationsdateien).
- Sie sehen den API key und secret key. Bei Bedarf können Sie diese neu generieren.
- Geben Sie im unteren Abschnitt die URLs für Webhooks an. Im Grunde benötigen Sie nur einen Webhook für erfolgreiche Zahlungen.

## Schritt 4: DV.net-Gateway in OpenCart konfigurieren

Konfigurieren Sie nun die Zahlungsmethode im OpenCart-Adminbereich.

- Gehen Sie in Ihrem OpenCart-Dashboard zu Extensions > Extensions.
- Wählen Sie im Dropdown-Menü „Choose the extension type“ den Eintrag Payments.
- Scrollen Sie in der Liste, bis Sie „DV.net Gateway“ finden. Klicken Sie auf die grüne Schaltfläche Install (+), falls noch nicht installiert, und anschließend auf die blaue Schaltfläche Edit (Stift).
- Dadurch wird die DV.net-Konfigurationsseite geöffnet. Füllen Sie die folgenden Details aus:
- API URL: Fügen Sie die API URL aus Schritt 3 ein.
- API Key: Fügen Sie den API Key aus Schritt 3 ein.
- API Secret: Fügen Sie das API Secret aus Schritt 3 ein.
- 

## Schritt 5: Webhook in Ihrem DV.net-Konto konfigurieren

Ihr Shop ist nun so eingerichtet, dass er Zahlungsanforderungen an DV.net sendet. Der letzte Schritt besteht darin, einen Webhook einzurichten, damit DV.net Zahlungsstatus-Updates (wie „Paid“ oder „Failed“) an Ihren Shop zurücksenden kann.

1. Gehen Sie zurück zu Ihrem DV.net-Konto-Dashboard.
2. Navigieren Sie zum Bereich Webhooks oder Developer.
3. Erstellen Sie einen neuen Webhook.
4. Payload URL: Dies ist der wichtigste Teil. Die eindeutige Webhook-URL Ihres Shops lautet: `https://example.com/wc-api/dv_gateway/` (Denken Sie daran, example.com durch Ihre tatsächliche Website-Adresse zu ersetzen. Stellen Sie sicher, dass https:// verwendet wird).
5. Tragen Sie hier die Adresse für Ihren Webhook ein (für woo ist sie ungefähr so `https://example.com/index.php?route=extension/payment/dv_gateway/callback`) und klicken Sie auf Create
6. Events: Falls abgefragt, wählen Sie die Ereignisse, auf die dieser Webhook hören soll. Sie sollten alle zahlungsbezogenen Ereignisse aktivieren, z. B.:
    1. Confirmed payment
    2. Unconfirmed payment (d. h., wenn der Kunde seine Zahlung per BTC sendet und )
    3. Processing withdrawal (derzeit von dieser Integration nicht unterstützt)
7. Speichern und aktivieren Sie den Webhook in Ihrem DV.net-Dashboard.

## Schritt 6: Integration testen!

- Ihre DV.net-OpenCart-Integration sollte nun abgeschlossen sein! Es ist wichtig, eine Testtransaktion durchzuführen.
- Besuchen Sie das Frontend Ihres OpenCart-Shops.
- Legen Sie ein Produkt in den Warenkorb.
- Durchlaufen Sie den Checkout.
- Wählen Sie bei den Zahlungsmethoden „DV.net Gateway“ (oder den konfigurierten Titel, wobei dieser in OpenCart-Erweiterungen häufig fest vorgegeben ist).
- Bestätigen Sie die Bestellung. Sie sollten zur DV.net-Zahlungsseite weitergeleitet werden.
- Dringend empfohlen: Führen Sie eine kleine, echte Transaktion durch. Nach erfolgreicher Zahlung bei DV.net gehen Sie zurück zu Ihrem OpenCart-Adminbereich > Sales > Orders. Prüfen Sie, ob sich der Status der Testbestellung automatisch von Ihrem ‚Pending‘-Status auf Ihren ‚Paid‘-Status (z. B. ‚Processing‘ oder ‚Complete‘) aktualisiert hat.
Wenn sich der Bestellstatus ohne manuelles Eingreifen korrekt aktualisiert, war Ihre Einrichtung erfolgreich! Kunden können nun in Ihrem OpenCart-Shop mit Kryptowährungen über DV.net bezahlen.