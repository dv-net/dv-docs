# So akzeptieren Sie Krypto-Zahlungen in OpenCart mit der DV.net Payment-Gateway-Erweiterung

Die Annahme von Kryptowährungszahlungen kann Ihren OpenCart-Shop erheblich aufwerten, ein breiteres Publikum ansprechen und moderne Zahlungsflexibilität bieten. DV.net stellt eine robuste Lösung zur Verarbeitung von Krypto-Zahlungen bereit, und die OpenCart-Erweiterung vereinfacht die Integration.
Diese Anleitung bietet eine klare, schrittweise Anleitung zur Installation und Konfiguration der DV.net Payment-Gateway-Erweiterung auf Ihrer OpenCart-Website.

## Voraussetzungen:

- Eine aktive OpenCart-Website.
- Admin-Zugriff auf Ihr OpenCart-Dashboard.
- Ein aktives DV.net-Konto.

## Schritt 1: DV.net OpenCart-Erweiterung herunterladen

Zuerst müssen Sie die Erweiterungsdateien herunterladen. Diese erhalten Sie aus dem offiziellen DV.net GitHub-Repository.

- Navigieren Sie zum offiziellen DV.net OpenCart-Erweiterungs-Repository: https://github.com/dv-net/dv-opencart.
- Wechseln Sie zur Seite Releases.
- Laden Sie die `dv-opencart-vX.X.X.ocmod.zip` herunter.

## Schritt 2: Die Erweiterung auf Ihrer OpenCart-Site installieren

OpenCart verwendet einen Extension Installer, um Uploads zu verarbeiten.

- Melden Sie sich in Ihrem OpenCart-Admin-Dashboard an (z. B. yourdomain.com/admin).
- Navigieren Sie im linken Menü zu Extensions > Installer.
- Klicken Sie auf die Schaltfläche Upload.
- Wählen Sie die in Schritt 1 heruntergeladene .zip-Datei aus.
- Warten Sie, bis der Upload- und Installationsprozess abgeschlossen ist. Sie sollten eine Erfolgsmeldung sehen.
- Wichtig: Gehen Sie nach der Installation zu Extensions > Modifications und klicken Sie oben rechts auf die blaue Schaltfläche Refresh, damit das System die Änderungen erkennt.
- Es ist außerdem ratsam, den Theme-Cache zu leeren. Gehen Sie zu Dashboard, klicken Sie oben rechts auf das blaue Zahnrad-Symbol Settings und klicken Sie anschließend auf die Refresh-Schaltflächen für Theme Cache und SASS Cache.

## Schritt 3: Ihre DV.net-API-Zugangsdaten abrufen

Um Ihren Shop mit DV.net zu verbinden, benötigen Sie Ihren API Key, API Secret und die API URL.

- Melden Sie sich in Ihrem DV.net-Konto-Dashboard an.
- Navigieren Sie zum Bereich API Keys (siehe obtaining-api-key-and-secret.md in den Dokumentationsdateien).
- Klicken Sie auf "Create New Key".
- Geben Sie dem Schlüssel einen passenden Namen (z. B. "OpenCart Store").
- Das System zeigt Ihren API Key und Ihr API Secret an.
- Wichtig: Kopieren Sie sowohl den API Key als auch das API Secret sofort und bewahren Sie sie sicher auf (z. B. in einem Passwort-Manager). Das Secret wird später nicht erneut angezeigt.
- Notieren Sie sich Ihre API URL, also die Basis-URL Ihrer DV.net-Instanz (z. B. https://api.your-dv-instance.com).

## Schritt 4: Das DV.net-Gateway in OpenCart konfigurieren

Konfigurieren Sie nun die Zahlungsmethode in Ihrem OpenCart-Adminbereich.

- Gehen Sie in Ihrem OpenCart-Dashboard zu Extensions > Extensions.
- Wählen Sie im Dropdown-Menü "Choose the extension type" den Typ Payments aus.
- Scrollen Sie in der Liste nach unten, bis Sie "DV.net Gateway" finden. Klicken Sie auf die grüne Schaltfläche Install (+), falls noch nicht installiert, und anschließend auf die blaue Schaltfläche Edit (Stiftsymbol).
- Es öffnet sich die DV.net-Konfigurationsseite. Füllen Sie die folgenden Angaben aus (basierend auf admin/controller/extension/payment/dv_gateway.php und den zugehörigen Sprach-/Template-Dateien):
- API URL: Fügen Sie die API URL aus Schritt 3 ein.
- API Key: Fügen Sie den API Key aus Schritt 3 ein.
- API Secret: Fügen Sie das API Secret aus Schritt 3 ein.

## Schritt 5: Ihre Integration testen!

- Ihre DV.net-OpenCart-Integration sollte nun abgeschlossen sein! Es ist wichtig, eine Testtransaktion durchzuführen.
- Besuchen Sie die Storefront Ihres OpenCart-Shops.
- Legen Sie ein Produkt in den Warenkorb.
- Durchlaufen Sie den Checkout-Prozess.
- Wählen Sie bei den Zahlungsmethoden "DV.net Gateway" (oder den konfigurierten Titel; bei OpenCart-Erweiterungen ist dieser häufig fest vorgegeben).
- Bestätigen Sie die Bestellung. Sie sollten auf die DV.net-Zahlungsseite weitergeleitet werden.
- Dringend empfohlen: Führen Sie eine kleine, echte Transaktion durch. Kehren Sie nach erfolgreicher Zahlung auf DV.net zu Ihrem OpenCart-Adminbereich zurück: Sales > Orders. Prüfen Sie, ob sich der Bestellstatus der Testbestellung automatisch von Ihrem 'Pending'-Status auf Ihren 'Paid'-Status (z. B. 'Processing' oder 'Complete') aktualisiert hat.
Wenn sich der Bestellstatus korrekt ohne manuelles Eingreifen aktualisiert, ist Ihre Einrichtung erfolgreich! Kundinnen und Kunden können nun in Ihrem OpenCart-Shop mit Kryptowährungen über DV.net bezahlen.