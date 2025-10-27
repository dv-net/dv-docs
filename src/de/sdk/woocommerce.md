# Krypto­zahlungen in WordPress mit dem DV.net WooCommerce-Plugin akzeptieren

Die Integration eines Krypto-Zahlungsgateways in Ihren E‑Commerce‑Shop ist eine hervorragende Möglichkeit, Ihre Kundschaft zu erweitern und moderne, sichere Zahlungsoptionen anzubieten. DV.net stellt eine leistungsstarke Lösung für die Abwicklung dieser Transaktionen bereit, und das dedizierte WooCommerce-Plugin macht die Integration einfach.
Diese Anleitung führt Sie Schritt für Schritt durch die Installation und Konfiguration des DV.net WooCommerce-Plugins auf Ihrer WordPress-Website.

## Voraussetzungen:

- Eine aktive WordPress-Website.
- Das WooCommerce-Plugin ist installiert und aktiviert.
- Ein aktives DV.net-Konto.

## Schritt 1: DV.net WooCommerce-Plugin beziehen

Zuerst laden Sie die Plugin-Dateien herunter. Anders als Plugins aus dem offiziellen WordPress-Repository erhalten Sie dieses von der DV.net GitHub-Seite.

Navigieren Sie zum offiziellen DV.net WooCommerce-Plugin-Repository: https://github.com/dv-net/dv-woocommerce (Dies wurde Ihnen in Ihren Dateien bereitgestellt).
- Klicken Sie im rechten Menü auf den Bereich Releases.
- Wählen Sie „Source code (zip)“ aus dem Menü der neuesten Version.
- Speichern Sie die .zip-Datei auf Ihrem Computer. Entpacken Sie sie nicht.

## Schritt 2: Plugin auf Ihrer WordPress-Website installieren

Jetzt laden Sie die heruntergeladene ZIP-Datei in Ihr WordPress-Admin-Dashboard hoch.
1. Melden Sie sich in Ihrem WordPress-Administrationsbereich an (z. B. yourdomain.com/wp-admin).
2. Navigieren Sie im linken Menü zu Plugins > Add New.
3. Klicken Sie oben auf der Seite „Add Plugins“ auf die Schaltfläche Upload Plugin.
4. Klicken Sie auf „Choose File“ und wählen Sie die soeben heruntergeladene Datei dv-woocommerce-main.zip aus.
5. Klicken Sie auf Install Now.
6. Nachdem WordPress die Installation des Plugins abgeschlossen hat, klicken Sie auf Activate Plugin.
Nun sehen Sie „DV.net WooCommerce Plugin“ in Ihrer Liste aktiver Plugins.

## Schritt 3: Ihre DV.net API-Zugangsdaten abrufen

Bevor das Plugin arbeiten kann, müssen Sie es über API-Schlüssel mit Ihrem DV.net-Konto verbinden.

1. Melden Sie sich in Ihrem DV.net-Kontodashboard an.
2. Navigieren Sie zum Bereich API Keys (basierend auf der Datei obtaining-api-key-and-secret.md).
3. Klicken Sie auf die Schaltfläche „Create New Key“.
4. Geben Sie Ihrem Schlüssel einen aussagekräftigen Namen (z. B. „WooCommerce Store“).
5. Das System generiert einen API Key und ein API Secret.
6. Wichtig: Kopieren Sie sowohl den API Key als auch das API Secret und speichern Sie sie an einem sicheren Ort, z. B. in einem Passwortmanager. Sie können das Secret nicht erneut einsehen, nachdem Sie die Seite verlassen haben.
7. Notieren Sie sich außerdem Ihre API URL. Dies ist die Haupt-URL Ihrer DV.net-Instanz (z. B. https://api.your-dv-instance.com).

## Schritt 4: Das DV.net-Gateway in WooCommerce konfigurieren

Mit Ihren API-Schlüsseln können Sie nun die Plugin-Einstellungen in WooCommerce vornehmen.

1. Gehen Sie in Ihrem WordPress-Dashboard zu WooCommerce > Settings.
2. Klicken Sie oben auf den Tab Payments.
3. In der Liste der Zahlungsmethoden sehen Sie „DV.net“. Klicken Sie ganz rechts auf die Schaltfläche Manage.
4. Es öffnet sich die DV.net-Einstellungsseite. Füllen Sie die folgenden Felder aus (wie in der Datei class-dv-gateway.php zu finden):
   1. Enable/Disable: Aktivieren Sie das Kontrollkästchen „Enable DV.net“, um diese Zahlungsmethode im Checkout verfügbar zu machen.
   2. Title: Dieser Text wird Kundinnen und Kunden bei der Auswahl der Zahlungsmethode angezeigt. Zum Beispiel: „Pay with Crypto via DV.net“.
   3. Description: Kurzer Text unter dem Titel. Zum Beispiel: „Securely pay with cryptocurrency.“
   4. API URL: Fügen Sie die in Schritt 3 notierte API URL ein.
   5. API Key: Fügen Sie den in Schritt 3 generierten API Key ein.
   6. API Secret: Fügen Sie das in Schritt 3 gespeicherte API Secret ein.
   7. Webhook Secret: Dies ist ein entscheidendes Feld für die Sicherheit. Sie müssen eine starke, eindeutige geheime Phrase erstellen (z. B. mit einem Passwortgenerator). Betrachten Sie sie als ein Passwort, das DV.net und Ihr Shop gemeinsam verwenden. Speichern Sie dieses Secret, da Sie es im nächsten Schritt benötigen.
5. Klicken Sie unten auf Save changes.

## Schritt 5: Den Webhook in Ihrem DV.net-Konto konfigurieren

Ihr Shop ist nun so eingerichtet, dass Zahlungsanfragen an DV.net gesendet werden. Der letzte Schritt ist die Einrichtung eines Webhooks, damit DV.net Zahlungsstatus-Updates (wie „Paid“ oder „Failed“) an Ihren Shop zurücksenden kann.

1. Gehen Sie zurück zu Ihrem DV.net-Kontodashboard.
2. Navigieren Sie zum Bereich Webhooks oder Developer.
3. Erstellen Sie einen neuen Webhook.
4. Payload URL: Dies ist der wichtigste Teil. Die eindeutige Webhook-URL Ihres Shops lautet: https://yourdomain.com/wc-api/dv_gateway/ (Denken Sie daran, yourdomain.com durch Ihre tatsächliche Website-Adresse zu ersetzen. Stellen Sie sicher, dass https:// verwendet wird).
5. Secret: Fügen Sie genau dasselbe Webhook Secret ein, das Sie in Schritt 4 erstellt und gespeichert haben. Dies dient dazu zu verifizieren, dass die eingehenden Anfragen wirklich von DV.net stammen (wie in webhook-signature-verification.md erwähnt).
6. Events: Falls Sie dazu aufgefordert werden, wählen Sie die Events aus, die dieser Webhook empfangen soll. Sie sollten alle zahlungsbezogenen Events aktivieren, wie:
   1. payment.completed
   2. payment.failed
   3. invoice.paid (Hinweis: Die genauen Event-Namen können variieren. Wählen Sie alle aus, die sich auf Änderungen des Zahlungsstatus beziehen.)
7. Speichern und aktivieren Sie den Webhook in Ihrem DV.net-Dashboard.

## Schritt 6: Alles bereit! (Vergessen Sie den Test nicht)

Glückwunsch! Das DV.net-Zahlungsgateway ist nun vollständig in Ihren WooCommerce-Shop integriert.

Zum Schluss sollten Sie einen Live-Test durchführen. Am besten gehen Sie so vor:
1. Besuchen Sie Ihren Shop wie eine Kundin/ein Kunde.
2. Legen Sie ein echtes Produkt in den Warenkorb.
3. Gehen Sie zur Kassenseite.
4. Wählen Sie „Pay with Crypto via DV.net“ (oder den von Ihnen festgelegten Titel).
5. Geben Sie die Bestellung auf und stellen Sie sicher, dass Sie korrekt zur DV.net-Zahlungsseite weitergeleitet werden.
6. Wir empfehlen dringend, eine kleine Testtransaktion abzuschließen, um zu bestätigen, dass sich der Bestellstatus in Ihrem WooCommerce-Bereich Orders nach erfolgreicher Zahlung automatisch von „Pending payment“ zu „Processing“ oder „Completed“ ändert.

Wenn sich der Bestellstatus automatisch aktualisiert, war Ihre Integration erfolgreich!