# Akzeptieren Sie Krypto-Zahlungen auf WordPress mit dem DV.net WooCommerce-Plugin

Die Integration eines Krypto-Zahlungsgateways in Ihren E-Commerce-Shop ist eine hervorragende Möglichkeit, Ihre Kundenbasis zu erweitern und moderne, sichere Zahlungsoptionen anzubieten. DV.net bietet eine leistungsstarke Lösung für die Abwicklung dieser Transaktionen, und das dedizierte WooCommerce-Plugin macht den Integrationsprozess unkompliziert.
Diese Anleitung führt Sie Schritt für Schritt durch die Installation und Konfiguration des DV.net WooCommerce-Plugins auf Ihrer WordPress-Website.

## Voraussetzungen:

- Eine aktive WordPress-Website.
- Das WooCommerce-Plugin ist installiert und aktiviert.
- Ein aktives DV.net-Konto.

## Schritt 1: Holen Sie sich das DV.net WooCommerce-Plugin

Der erste Schritt besteht darin, die Plugin-Dateien herunterzuladen. Anders als Plugins im offiziellen WordPress-Repository erhalten Sie dieses von der DV.net GitHub-Seite.

Navigieren Sie zum offiziellen DV.net WooCommerce-Plugin-Repository: https://github.com/dv-net/dv-woocommerce (Dies wurde in Ihren Dateien bereitgestellt).
- Klicken Sie im rechten Menü auf den Bereich „Releases“.
- Wählen Sie „Source code (zip)“ aus dem Menü der neuesten Version.
- Speichern Sie die .zip-Datei auf Ihrem Computer. Entpacken Sie sie nicht.

## Schritt 2: Installieren Sie das Plugin auf Ihrer WordPress-Website

Jetzt laden Sie die heruntergeladene ZIP-Datei in Ihr WordPress-Admin-Dashboard hoch.
1. Melden Sie sich in Ihrem WordPress-Adminbereich an (z. B. yourdomain.com/wp-admin).
2. Navigieren Sie im linken Menü zu Plugins > Add New.
3. Klicken Sie oben auf der Seite „Add Plugins“ auf die Schaltfläche Upload Plugin.
4. Klicken Sie auf „Choose File“ und wählen Sie die soeben heruntergeladene Datei dv-woocommerce-main.zip aus.
5. Klicken Sie auf Install Now.
6. Nachdem WordPress die Installation abgeschlossen hat, klicken Sie auf Activate Plugin.
Sie sehen nun „DV.net WooCommerce Plugin“ in Ihrer Liste der aktiven Plugins.

## Schritt 3: Beschaffen Sie Ihre DV.net API-Zugangsdaten

Um Ihren Shop mit DV.net zu verbinden, benötigen Sie Ihren API Key, API Secret und die API URL.

- Melden Sie sich in Ihrem DV.net-Kontodashboard an.
- Suchen Sie Ihr Projekt oder erstellen Sie ein neues.
- Navigieren Sie zum Bereich API Keys über Projects -> Edit für das spezifische Projekt (siehe obtaining-api-key-and-secret.md aus den Dokumentationsdateien).
- Sie sehen den API key und secret key. Sie können diese bei Bedarf neu generieren.
- Geben Sie im darunterliegenden Abschnitt die URLs für Webhooks an. Im Grunde benötigen Sie nur den Webhook für erfolgreiche Zahlungen.

## Schritt 4: Konfigurieren Sie das DV.net-Gateway in WooCommerce

Mit Ihren API-Schlüsseln können Sie nun die Plugin-Einstellungen in WooCommerce konfigurieren.

1. Gehen Sie in Ihrem WordPress-Dashboard zu WooCommerce > Settings.
2. Klicken Sie oben auf die Registerkarte Payments.
3. In der Liste der Zahlungsmethoden sehen Sie „DV.net“. Klicken Sie ganz rechts auf die Schaltfläche Manage.
4. Es öffnet sich die DV.net-Einstellungsseite. Füllen Sie die folgenden Felder aus:
   1. Enable/Disable: Aktivieren Sie „Enable DV.net“, um diese Zahlungsmethode an der Kasse verfügbar zu machen.
   2. Title: Dieser Text wird Kunden bei der Auswahl der Zahlungsmethode angezeigt. Zum Beispiel: „Mit Krypto über DV.net bezahlen“.
   3. Description: Dies ist der kurze Text unter dem Titel. Zum Beispiel: „Sicher mit Kryptowährung bezahlen.“
   4. API URL: Fügen Sie die API URL ein.
   5. API Key: Fügen Sie den API Key aus Schritt 3 ein.
   6. API Secret: Fügen Sie das API Secret aus Schritt 3 ein.
5. Klicken Sie unten auf der Seite auf Save changes.

## Schritt 5: Konfigurieren Sie den Webhook in Ihrem DV.net-Konto

Ihr Shop ist nun eingerichtet, um Zahlungsanfragen an DV.net zu senden. Der letzte Schritt ist das Einrichten eines Webhooks, damit DV.net Zahlungsstatus-Updates (wie „Paid“ oder „Failed“) an Ihren Shop zurücksenden kann.

1. Gehen Sie zurück zu Ihrem DV.net-Kontodashboard.
2. Navigieren Sie zum Bereich Webhooks oder Developer.
3. Erstellen Sie einen neuen Webhook.
4. Payload URL: Dies ist der wichtigste Teil. Die eindeutige Webhook-URL Ihres Shops lautet: `https://example.com/wc-api/dv_gateway/` (Denken Sie daran, example.com durch Ihre tatsächliche Website-Adresse zu ersetzen. Stellen Sie sicher, dass https:// verwendet wird).
5. Platzieren Sie hier die Adresse für Ihren Webhook (für Woo sieht sie etwa so aus: `https://example.com/?wc-api=dv_gateway`)
6. Events: Falls abgefragt, wählen Sie die Ereignisse, auf die dieser Webhook hören soll. Sie sollten alle zahlungsbezogenen Ereignisse aktivieren, wie:
   1. Confirmed payment
   2. Unconfirmed payment (z. B. wenn der Kunde seine Zahlung via BTC sendet und ...)
   3. Processing withdrawal (derzeit von dieser Integration nicht unterstützt)
7. Speichern und aktivieren Sie den Webhook in Ihrem DV.net-Dashboard.

## Schritt 6: Alles eingerichtet! (Vergessen Sie den Test nicht)

Glückwunsch! Das DV.net-Zahlungsgateway ist nun vollständig in Ihren WooCommerce-Shop integriert.

Als Letztes sollten Sie einen Live-Test durchführen. Am besten gehen Sie so vor:
1. Besuchen Sie Ihren Shop wie ein normaler Kunde.
2. Legen Sie ein echtes Produkt in den Warenkorb.
3. Gehen Sie zur Checkout-Seite.
4. Wählen Sie „Mit Krypto über DV.net bezahlen“ (oder den von Ihnen festgelegten Titel).
5. Schließen Sie die Bestellung ab und stellen Sie sicher, dass Sie korrekt zur DV.net-Zahlungsseite weitergeleitet werden.
6. Wir empfehlen dringend, eine kleine Testtransaktion durchzuführen, um zu bestätigen, dass sich der Bestellstatus in Ihrem WooCommerce-Bereich Orders nach erfolgreicher Zahlung automatisch von „Pending payment“ zu „Processing“ oder „Completed“ ändert.

Wenn sich der Bestellstatus automatisch aktualisiert, war Ihre Integration erfolgreich!