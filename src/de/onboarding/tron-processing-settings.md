# TRON-Prozessing-Einstellungen

Auf der Seite **TRON-Prozessing-Einstellungen** wählen Sie, über welche Ressourcen die Netzwerkgebühren beim Abheben von USDT aus Einzahlungs-Wallets auf Ihre Haupt-Wallet oder eine Börse bezahlt werden. Diese Wahl beeinflusst die Kosten jeder ausgehenden Überweisung.

## Warum überhaupt Kosten entstehen

Wenn Sie USDT (TRC-20) aus einer Einzahlungs-Wallet abheben, ist das ein Smart-Contract-Aufruf im TRON-Netzwerk. Dafür wird **Energy** benötigt. Wenn auf der Wallet keine Energy verfügbar ist, deckt das Netzwerk den Bedarf durch das Verbrennen von TRX - ungefähr **$2-5 pro Transaktion** (ca. **65.000-130.000 Energy**).

Diese Kosten können Sie vermeiden oder deutlich reduzieren, indem Sie den passenden Modus wählen.

::: info Details verstehen?
Was Energy und Bandwidth sind und wie Delegation in TRON funktioniert, steht im Artikel [TRON-Netzwerk - Überblick](/de/onboarding/tron-processing-overview).
:::

## Modus 1 - Burn TRX

Bei jeder USDT-Abhebung aus einer Einzahlungs-Wallet wird automatisch TRX vom Prozessing-Wallet-Guthaben verbrannt.

**Kosten:** ~$2-5 pro Überweisung.

**Was Sie tun müssen:** halten Sie genügend TRX auf der Wallet - alles andere passiert automatisch.

**Wann wählen:** gut für schnellen Start oder Tests. Keine Einrichtung erforderlich. Bei regelmäßigem Volumen ist dieser Modus am teuersten.

## Modus 2 - Delegate cloud from DV.net

Energy wird automatisch beim DaVinci-Merchant-Provider gemietet und vor jeder Transaktion an Ihre Prozessing-Wallet delegiert.

**Kosten:** **etwa 2x günstiger** als Burn TRX.

**Was Sie tun müssen:** nichts. Derzeit teilen wir überschüssige Energy kostenlos, aber Überweisungen können manchmal einige Stunden dauern.

**Wann wählen:** Standardempfehlung für die meisten Merchants. Keine technischen Kenntnisse nötig, funktioniert sofort und ist deutlich günstiger als TRX zu verbrennen.

## Modus 3 - Delegate

Sie frieren (staken) TRX auf Ihrer eigenen Wallet ein und delegieren die erhaltene Energy an die Prozessing-Wallet. Überweisungen laufen über Ihre eigenen Ressourcen.

**Kosten:** ~$0 pro Überweisung. Eingefrorene TRX werden nicht verbraucht; Energy wird alle 24 Stunden automatisch aufgefüllt.

**Was Sie tun müssen:**

1. Frieren Sie TRX auf Ihrer Haupt-Wallet ein. Sie erhalten Energy proportional zum eingefrorenen Betrag.
2. Delegieren Sie Energy an die Adresse Ihrer Prozessing-Wallet. Die Adresse wird oben auf der Einstellungsseite angezeigt.

**Wann wählen:** wenn Sie einen stabilen Abhebungs-Flow haben und Betriebskosten minimieren möchten. Bei ca. 20-30 Transaktionen pro Tag amortisiert sich das schnell.
