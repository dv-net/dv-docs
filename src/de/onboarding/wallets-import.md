# Import in eine Krypto-Wallet

Nach dem Download eines Private Keys oder einer Seed-Phrase aus DV.net brauchen Sie eine Wallet eines Drittanbieters. Hier: MetaMask und OKX Wallet.

## Welche Wallet?

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum und EVM | ✅ | ✅ |
| Base, BNB Chain, Polygon, Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

Nur EVM: beides möglich. Für BTC/BCH: OKX Wallet.

## MetaMask

### Installation

- **Browser:** [metamask.io](https://metamask.io) → Download
- **Mobil:** App Store / Play Store, „MetaMask“

Nur von der offiziellen Website installieren.

### Private Key importieren

1. MetaMask öffnen
2. Kontosymbol oben rechts
3. **Import account**
4. Private Key einfügen (beginnt mit `0x`)
5. **Import**

> Nur diese eine Adresse wird importiert.

### Seed-Phrase importieren

> ⚠️ Ersetzt das aktuelle MetaMask-Wallet. Vorher andere Seed-Phrase sichern.

1. **Import an existing wallet**
2. 12 oder 24 Wörter in Reihenfolge
3. Passwort setzen

Erste Adresse automatisch; weitere mit **Add account**.

### Netzwerk hinzufügen

Standard: Ethereum. Sonst [chainlist.org](https://chainlist.org) → **Add to MetaMask**.

Manuell:

| Netzwerk | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### Account entfernen

1. Kontomenü
2. **⋮** am Account
3. **Remove account**

## OKX Wallet

### Installation

- [okx.com/web3](https://www.okx.com/web3) → Erweiterung
- Mobil: „OKX Wallet“

### Private Key importieren

1. OKX Wallet öffnen
2. **+** → **Import wallet → Private key**
3. **EVM**, **Bitcoin** oder **Bitcoin Cash**
4. Private Key einfügen
5. Passwort setzen

Danach Netzwerk oben wählen.

### Seed-Phrase importieren

1. **Import wallet → Seed phrase**
2. 12 oder 24 Wörter
3. Ggf. Ableitungspfad (siehe Tabelle)
4. Passwort setzen

**Pfade (DV.net):**

| Netzwerk | Pfad |
|---|---|
| Ethereum und EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### Index / Adresse

Nach Seed-Import **Add account** drücken — Indizes steigen. Mit Transaktion abgleichen.

### Wallet löschen

1. Wallet-Verwaltung
2. **⋮**
3. **Delete wallet**

> Löschen in der App entfernt keine On-Chain-Mittel, nur den lokalen Zugriff.
