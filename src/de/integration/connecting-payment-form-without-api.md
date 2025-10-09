# Einbindung des Zahlungsformulars ohne API-Nutzung

Sie können das Zahlungsformular ohne API-Integration einbinden, indem Sie die folgenden einfachen Schritte ausführen:

## 1. Finden Sie die UUID Ihres Shops

Loggen Sie sich in das persönliche Konto Ihres Projekts ein und gehen Sie zum Abschnitt **Einstellungen**.
Dort finden Sie die **UUID** (eindeutige Kennung) Ihres Shops.

## 2. Erstellen Sie den Zahlungslink

Verwenden Sie das folgende Format, um einen Zahlungslink zu generieren:

### Wo:

- `{your-domain-or-subdomain}` — Ihre registrierte Domain oder Subdomain.
- `{store-uuid}` — die UUID Ihres Shops (im persönlichen Konto angegeben).
- `{client-id}` — die eindeutige Kennung des Kunden, die Sie bei der Linkgenerierung vergeben. Sie wird benötigt, um die
  Zahlung zu verfolgen und sie dem entsprechenden Kunden-Wallet zuzuordnen.

> ⚠️ **Wichtig:** Die `client-id` muss für jede Kunden-Session eindeutig sein, um eine korrekte Verfolgung und
> Identifizierung zu gewährleisten.

---

Nach der Generierung des Links können Sie den Kunden entweder darauf weiterleiten oder ihn in eine Schaltfläche auf
Ihrer Website einbetten.