# Integrationsbeispiele

In diesem Leitfaden zeigen wir praktische Beispiele für die Integration von Krypto­zahlungen in gängige E‑Commerce‑Plattformen und Webanwendungen. Wir zeigen, wie einfach Sie Krypto­zahlungen auf Ihrer Website akzeptieren können – unabhängig von der verwendeten Technologie.

## Überblick über die Integrationsmöglichkeiten

Unser Payment-Gateway bietet flexible Lösungen für verschiedene Plattformen:

- **WooCommerce (WordPress)** — einsatzbereites Plugin für Onlineshops
- **Express.js** — RESTful-API-Integration für Node.js-Anwendungen
- **Universal API** — für jede Plattform oder Programmiersprache

## Integration mit WooCommerce

WooCommerce ist eine der beliebtesten Plattformen zur Erstellung von Onlineshops auf WordPress. Die Integration von Krypto­zahlungen in WooCommerce ermöglicht es Ihnen, Bitcoin, Ethereum und andere Kryptowährungen ohne komplexe Einrichtung zu akzeptieren.

### Vorteile der Verwendung von WooCommerce

- ✅ **Einfache Installation** — Installation über den WordPress‑Admin‑Bereich in nur wenigen Minuten
- ✅ **Automatische Umrechnung** — berechnet den Krypto‑Betrag automatisch anhand des aktuellen Wechselkurses
- ✅ **Sicherheit** — alle Transaktionen sind durch die Blockchain geschützt und verifiziert
- ✅ **Unterstützung mehrerer Kryptowährungen** — Bitcoin, Ethereum, USDT, USDC und mehr
- ✅ **Sofortige Benachrichtigungen** — Webhook-System zur Nachverfolgung des Zahlungsstatus

### Demo-Beispiel

Sie können die Funktionen des Plugins auf unserer Demo-Website testen:

🔗 **[WooCommerce-Demo](https://woocommerce.dv-net.store/)**

### So funktioniert es

Beim Aufgeben einer Bestellung:
- Wählt der Kunde auf der Checkout-Seite die Krypto-Zahlung aus
- Erhält eine eindeutige Wallet-Adresse für die Überweisung
- Sieht einen QR-Code für die schnelle mobile Zahlung
- Erhält den genauen Betrag in der ausgewählten Kryptowährung

Nachdem die Blockchain die Transaktion bestätigt hat, wird der Bestellstatus über das Webhook-System automatisch aktualisiert.

## Integration mit Express.js

Express.js ist ein beliebtes Webframework für Node.js, das häufig zum Erstellen von Webanwendungen und APIs eingesetzt wird. Die Integration von Krypto‑Zahlungen über eine RESTful API ermöglicht flexible und skalierbare Lösungen.

### Vorteile der Verwendung von Express.js

- ✅ **Volle Kontrolle** — vollständig anpassbare Logik der Zahlungsabwicklung
- ✅ **RESTful API** — moderner Integrationsansatz
- ✅ **Asynchrone Verarbeitung** — nutzen Sie async/await zur Zahlungsabwicklung
- ✅ **Flexibilität** — lässt sich in jede Geschäftslogik integrieren
- ✅ **Skalierbarkeit** — geeignet für Projekte jeder Größe

### Demo-Beispiel

Testen Sie die Integration in einem realen Beispiel:

🔗 **[Express.js-Demo](https://express.dv-net.store/)**

## Quellcode und Beispiele

Alle Integrationsbeispiele sind Open Source:

- 🛒 **[WooCommerce-Plugin](https://github.com/dv-net/dv-woocommerce)** — einsatzbereites WordPress-Plugin
- 🚀 **[Express.js-Demo](https://github.com/dv-net/dv-net-js-client-demo)** — voll funktionsfähige Node.js-Demo