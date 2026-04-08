# Seed-Phrase: Export, Import und Adresssuche

Die Seed-Phrase ist der Master-Schlüssel Ihres Händlers. Alle Hot-Wallet-Adressen werden daraus mathematisch abgeleitet. Mit der Seed-Phrase können Sie jede Adresse wiederherstellen und alle jemals erzeugten Einzahlungsadressen finden.

> ⚠️ **Die Seed-Phrase ist das sensibelste Geheimnis.** Wer sie kennt, hat Zugriff auf alle Wallets. Offline und sicher aufbewahren; niemals weitergeben.

## Seed-Phrase exportieren

1. **Transfers → Hot Wallets**
2. **Download seed phrases** oben rechts klicken
3. Zwei-Faktor-Authentifizierung
4. Datei sicher speichern

> Auf Papier oder auf einem offline-Gerät ohne Internet speichern.

## Seed-Phrase in eine Wallet importieren

Der Import ermöglicht Zugriff auf alle Händler-Adressen über eine Standard-Krypto-Wallet.

### MetaMask (EVM)

1. [MetaMask](https://metamask.io) installieren
2. **Import an existing wallet** wählen
3. Seed-Phrase (12 oder 24 Wörter) in Reihenfolge eingeben
4. Passwort setzen und Setup abschließen
5. Netzwerk oben auswählen

> MetaMask unterstützt alle EVM-Netzwerke: Ethereum, Base, BNB Chain, Polygon, Arbitrum u. a.

### OKX Wallet (EVM + BTC u. a.)

1. [OKX Wallet](https://www.okx.com/web3) installieren
2. **Import wallet → Seed phrase**
3. Seed-Phrase in Reihenfolge eingeben
4. Passwort setzen
5. Gewünschtes Netzwerk bzw. Coin wählen

> OKX bietet EVM, Bitcoin, Bitcoin Cash u. v. m.

## Einzahlungsadressen aus der Seed-Phrase finden

DV.net nutzt standardisierte Ableitungspfade (derivation paths).

### Standard-Pfade

| Netzwerk | Ableitungspfad |
|---|---|
| Ethereum und alle EVM | `m/44'/60'/0'/0/N` |
| Bitcoin (Legacy) | `m/44'/0'/0'/0/N` |
| Bitcoin (SegWit) | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N` ist der Index (0, 1, 2, …).

### Konkrete Adresse finden

Am einfachsten mit einem Tool, das alle abgeleiteten Adressen mit Indizes und Private Keys listet.

#### Tool: iancoleman BIP39

[iancoleman.io/bip39](https://iancoleman.io/bip39/) — Open-Source im Browser; Seite speichern und offline öffnen.

> ⚠️ **Seed-Phrase nur offline eingeben.** Seite per „Speichern unter“ speichern, Internet trennen, dann eingeben. Niemals auf fremden Geräten und nicht online eingeben.

**Vorgehen:**

1. Seite öffnen und offline speichern (Strg+S / Cmd+S)
2. Offline die gespeicherte Datei im Browser öffnen
3. In **BIP39 Mnemonic** die Seed-Phrase eintragen
4. Unter **Coin** wählen:
   - `ETH — Ethereum` für alle EVM-Ketten
   - `BTC — Bitcoin` für Legacy/SegWit
   - `BCH — Bitcoin Cash`
5. Unter **Derivation Path** den passenden Tab (**BIP44** / **BIP84**)
6. Tabelle **Derived Addresses** nutzen
7. Adresse mit der Transaktion abgleichen
8. Passenden Private Key kopieren und in Wallet importieren

Standard: Indizes 0–19; mehr über **Show more rows** oder **starting from index**.

> Die meisten Adressen liegen zwischen 0 und 1000; Bereich schrittweise erweitern (z. B. je 20).
