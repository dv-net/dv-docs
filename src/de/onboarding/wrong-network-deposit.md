# Einzahlung im falschen Netzwerk — Mittel wiederherstellen

Hat der Zahler Token an Ihre Wallet-Adresse gesendet, aber ein Netzwerk gewählt, das Ihr Händler nicht unterstützt, sind die Mittel nicht verloren. Dieser Artikel erklärt, was passiert ist und wie Sie sie zurückbekommen.

## Warum das passiert

Die meisten Ethereum-kompatiblen Netzwerke (Base, BNB Chain, Polygon, Arbitrum und andere) nutzen dasselbe Adressformat. Dieselbe Wallet-Adresse existiert in all diesen Netzwerken gleichzeitig.

Beim Senden bittet Börse oder Wallet den Zahler, ein Netzwerk zu wählen. Wurde eines gewählt, das Ihr Händler nicht überwacht, war die Transaktion on-chain erfolgreich — Ihr System hat sie aber nicht verbucht.

> **Die Mittel sind sicher.** Sie liegen auf der richtigen Adresse, nur in einem anderen Netzwerk. Zugriff erhalten Sie über den Private Key dieser Adresse oder die Seed-Phrase des Händlers.

## So stellen Sie die Mittel wieder her

### Schritt 1 — Transaktion prüfen

Bitten Sie den Zahler um den Transaktions-Hash. Öffnen Sie einen Block-Explorer für das betreffende Netzwerk und prüfen Sie:

- Empfängeradresse entspricht der Adresse Ihres Shops
- Status der Transaktion ist **Success**
-  Token und Betrag stimmen

Block-Explorer: [ChainApi](https://chainapi.org/).

### Schritt 2 — Adresse in Hot Wallets finden

1. Öffnen Sie **Transfers → Hot Wallets** im Control Panel
2. Geben Sie die Empfängeradresse aus der Transaktion in die Suche ein
3. Stellen Sie sicher, dass die Adresse in der Liste erscheint

> Wird die Adresse nicht angezeigt, deaktivieren Sie den Filter **Hide addresses with low balance**.

### Schritt 3 — Zugriff auf die Adresse

Sie benötigen ein **Geheimnis**, um die Adresse zu steuern, auf die im anderen Netzwerk eingezahlt wurde: den **Private Key** dieser Adresse oder die **Seed-Phrase** Ihres Händlers.

- Arbeiten Sie mit **einer Adresse**, reicht meist der **Private Key**. Siehe [Privatschlüssel exportieren](./export-keys.md).
- Möchten Sie Zugriff über **alle Adressen** und ggf. die richtige per Index finden, nutzen Sie die **Seed-Phrase**. Siehe [Seed-Phrase: Export, Import und Adresssuche](./seed-phrase.md).

> ⚠️ **Private Key und Seed-Phrase gewähren vollen Zugriff auf die Mittel.** Geben Sie sie niemals weiter und lagern Sie sie nicht an unsicheren Orten.

### Schritt 4 — In eine Wallet importieren

Importieren Sie in eine Drittanbieter-Wallet, was Sie im vorigen Schritt erhalten haben:

- **Private Key** exportiert — Private Key importieren
- **Seed-Phrase** exportiert — Seed-Phrase importieren

Danach prüfen Sie die richtige Adresse, wechseln Sie in das Netzwerk der Token und kontrollieren Sie den Saldo.

Schritt-für-Schritt für MetaMask und OKX Wallet finden Sie unter [Import in eine Krypto-Wallet](./wallets-import.md).
