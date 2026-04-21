# Importar claves a una billetera cripto

Tras descargar una clave privada o frase semilla de DV.net necesita un monedero de un tercero. Aquí: MetaMask y OKX Wallet.

## Qué monedero usar

| | MetaMask | OKX Wallet |
|---|---|---|
| Ethereum y EVM | ✅ | ✅ |
| Base, BNB Chain, Polygon, Arbitrum | ✅ | ✅ |
| Bitcoin (BTC) | ❌ | ✅ |
| Bitcoin Cash (BCH) | ❌ | ✅ |

Solo EVM: cualquiera. Para BTC/BCH: OKX Wallet.

## MetaMask

### Instalación

- **Navegador:** [metamask.io](https://metamask.io) → Download
- **Móvil:** App Store / Play Store, «MetaMask»

Instale solo desde el sitio oficial.

### Importar clave privada

1. Abra MetaMask
2. Icono de cuenta arriba a la derecha
3. **Import account**
4. Pegue la clave (empieza con `0x`)
5. **Import**

> Solo desbloquea esa dirección.

### Importar frase semilla

> ⚠️ Sustituye el monedero actual de MetaMask. Respalde antes la frase de otra cuenta si existe.

1. **Import an existing wallet**
2. 12 o 24 palabras en orden
3. Contraseña y finalizar

Primera dirección automática; más con **Add account**.

### Añadir red

Por defecto Ethereum. Para otras use [chainlist.org](https://chainlist.org) → **Add to MetaMask**.

Manual:

| Red | Chain ID | RPC URL |
|---|---|---|
| Base | 8453 | `https://mainnet.base.org` |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum One | 42161 | `https://arb1.arbitrum.io/rpc` |

### Quitar cuenta

1. Menú de cuenta
2. **⋮** junto a la cuenta
3. **Remove account**

## OKX Wallet

### Instalación

- [okx.com/web3](https://www.okx.com/web3) → extensión
- Móvil: «OKX Wallet»

### Importar clave privada

1. Abra OKX Wallet
2. **+** → **Import wallet → Private key**
3. **EVM**, **Bitcoin** o **Bitcoin Cash**
4. Pegue la clave
5. Contraseña

Luego elija la red arriba.

### Importar frase semilla

1. **Import wallet → Seed phrase**
2. 12 o 24 palabras
3. Si pide ruta de derivación, use la tabla
4. Contraseña

**Rutas (DV.net):**

| Red | Ruta |
|---|---|
| Ethereum y EVM | `m/44'/60'/0'/0/N` |
| Bitcoin Legacy | `m/44'/0'/0'/0/N` |
| Bitcoin SegWit | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

### Buscar por índice

Tras importar la frase, pulse **Add account** varias veces y compare con la transacción.

### Eliminar monedero

1. Gestión de monederos
2. **⋮**
3. **Delete wallet**

> Quitar el monedero en la app no borra fondos en la cadena.
