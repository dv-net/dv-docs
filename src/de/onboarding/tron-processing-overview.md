# TRON-Netzwerk - Überblick

Um zu verstehen, wie USDT-Prozessing auf TRON funktioniert und warum verschiedene Modi zur Gebührenzahlung sinnvoll sind, hilft es, die Grundlagen des Netzwerks zu kennen. Diese Seite ist optional, erleichtert aber fundierte Entscheidungen bei der Wallet-Konfiguration.

## TRON-Ressourcenmodell

Im Gegensatz zu Ethereum, wo für jede Transaktion eine Gebühr in ETH bezahlt wird, nutzt TRON ein zweistufiges Ressourcensystem. Jede Aktion im Netzwerk verbraucht eine oder beide Ressourcen: **Bandwidth** und **Energy**.

### Bandwidth

Bandwidth wird bei **jeder** Transaktion verbraucht - vereinfacht gesagt die "Größe" der Transaktion in Bytes.

- Jedes Konto erhält **600 Bandwidth Points pro Tag** kostenlos.
- Wenn das Limit überschritten ist, wird die Transaktion trotzdem ausgeführt, aber TRX wird abgezogen (verbrannt).
- Burn-Rate: **1 Bandwidth Point = 0.001 TRX**.

### Energy

Energy wird beim Ausführen von **Smart Contracts** verbraucht. Alle TRC-20-Token-Transfers (USDT, USDC usw.) sind Smart-Contract-Aufrufe und benötigen Energy.

- Es gibt kein kostenloses Energy-Limit - man erhält sie durch TRX-Freeze oder Miete.
- Wenn nicht genug Energy vorhanden ist, verbrennt das Netzwerk TRX, um den Bedarf zu decken.
- Burn-Rate: **1 Energy ~= 0.00021 TRX**.
- Ein typischer USDT-Transfer verbraucht ca. **30.000-65.000 Energy**, was beim Verbrennen von TRX etwa **$1-2** kosten kann.

### Ressourcenvergleich

| | Bandwidth | Energy |
|---|---|---|
| Wird genutzt für | Alle Transaktionen | Smart-Contract-Aktionen (TRC-20) |
| Kostenloses Kontingent | 600 Points/Tag | Keins |
| Auffüllung | Alle 24 Stunden | Alle 24 Stunden (bei vorhandenem Stake) |
| Erhalt | Kostenloses Kontingent oder TRX-Freeze | TRX-Freeze oder Miete |
| Burn-Preis | 0.001 TRX / Point | 0.00021 TRX / Energy |
| Delegation | Ja | Ja |

### Auffüllung von Ressourcen

Ressourcen aus TRX-Freeze werden kontinuierlich aufgefüllt - ungefähr alle ~3 Sekunden (ein Block) wird ein proportionaler Anteil der Tagesmenge wieder verfügbar. Praktisch bedeutet das: Mit ausreichendem Stake können Transaktionen nahezu kostenlos sein, solange der Verbrauch die Auffüllrate nicht überschreitet.

## TRX einfrieren (Stake 2.0)

Das Einfrieren von TRX ist der zentrale Mechanismus, um Ressourcen zu erhalten. Sie sperren TRX und erhalten dafür Energy oder Bandwidth sowie TRON Power (Stimmrechte für Validatoren).

Das aktuelle Modell ist **Stake 2.0** (seit 2023):

- Freeze wirkt sofort - Ressourcen werden direkt gutgeschrieben.
- Unfreeze dauert **14 Tage** (Unstaking).
- TRX kann getrennt "für Energy" und "für Bandwidth" eingefroren werden.
- Ressourcen können an andere Adressen **delegiert** werden.

Energy ist proportional zu Ihrem Anteil am gesamten eingefrorenen TRX im Netzwerk:

> **Ihre Energy** = (Ihr eingefrorenes TRX / Gesamtes eingefrorenes TRX im Netzwerk) x Tägliches Energy-Limit des Netzwerks

## Ressourcendelegation

Delegation ermöglicht das Übertragen von Energy oder Bandwidth von einem Konto auf ein anderes, ohne Tokens zu übertragen. Delegierte Ressourcen funktionieren beim Empfänger wie eigene.

Darauf basiert der **Delegate**-Modus in den DV-Merchant-Prozessing-Einstellungen: Sie frieren TRX auf Ihrer Haupt-Wallet ein und delegieren Energy an die Prozessing-Wallet-Adresse.

::: tip Mehr dazu
Wie Sie den Prozessing-Modus auswählen, steht in [TRON-Prozessing-Einstellungen](/de/onboarding/tron-processing-settings).
:::
