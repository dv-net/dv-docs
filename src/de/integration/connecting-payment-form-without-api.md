# Ein Zahlungsformular ohne API-Integration anbinden

Sie können ein Zahlungsformular ohne API-Integration anbinden, indem Sie diese einfachen Schritte befolgen.

Ein Beispiel für die Integration finden Sie auch [in diesem Repository](https://github.com/dv-net/simple-payment-form)

## 1. Zahlungslink Ihres Shops finden

Melden Sie sich in Ihrem Projektkonto an und gehen Sie zu **Projekte**, **Bearbeiten**, **Erweiterte Einstellungen**.

Dort finden Sie den **Link zum Zahlungsformular ohne API**, in dem die **UUID** (eindeutige Kennung) Ihres Shops enthalten ist.

## 2. Zahlungslink anpassen

Verwenden Sie das folgende Format, um einen Zahlungslink zu erzeugen:

### Dabei gilt:

- `{your-domain-or-subdomain}` ist Ihre registrierte Domain oder Subdomain.
- `{store-uuid}` ist die UUID Ihres Shops (im Shop-Link angegeben).
- `{client-id}` ist eine eindeutige Kundenkennung, die Sie bei der Link-Generierung vergeben. Sie wird benötigt, um die Zahlung nachzuverfolgen und sie dem gewünschten Kunden-Wallet zuzuordnen.

> ⚠️ **Wichtig:** `client-id` muss für jede Kundensitzung eindeutig sein, um eine korrekte Nachverfolgung und Identifizierung sicherzustellen.

---

Sobald der Link erzeugt wurde, können Sie den Kunden entweder darauf weiterleiten oder ihn als Button auf Ihrer Website einbinden.