# Frase semilla: exportar, importar y buscar direcciones de depósito

La frase semilla es la clave maestra de su comercio. Todas las direcciones de monederos calientes se derivan de ella. Con ella puede restaurar cualquier dirección y listar todas las direcciones de depósito generadas.

> ⚠️ **Es el secreto más sensible.** Quien la conoce accede a todos los monederos. Guárdela offline y en lugar seguro; nunca la comparta.

## Exportar la frase semilla

1. **Transfers → Hot Wallets**
2. **Download seed phrases** arriba a la derecha
3. Autenticación de dos factores
4. Guarde el archivo de forma segura

> Preferible en papel o dispositivo sin conexión.

## Importar la frase semilla en un monedero

Permite acceder a todas las direcciones del comercio desde un monedero estándar.

### MetaMask (EVM)

1. Instale [MetaMask](https://metamask.io)
2. **Import an existing wallet**
3. Escriba la frase (12 o 24 palabras) en orden
4. Contraseña y finalizar
5. Elija la red en el menú superior

> MetaMask admite todas las cadenas EVM: Ethereum, Base, BNB Chain, Polygon, Arbitrum, etc.

### OKX Wallet (EVM + BTC y más)

1. Instale [OKX Wallet](https://www.okx.com/web3)
2. **Import wallet → Seed phrase**
3. Frase en orden
4. Contraseña y finalizar
5. Elija red o moneda

> OKX admite EVM, Bitcoin, Bitcoin Cash y otras.

## Buscar direcciones de depósito

DV.net usa rutas de derivación estándar.

### Rutas estándar

| Red | Ruta |
|---|---|
| Ethereum y todas las EVM | `m/44'/60'/0'/0/N` |
| Bitcoin (Legacy) | `m/44'/0'/0'/0/N` |
| Bitcoin (SegWit) | `m/84'/0'/0'/0/N` |
| Bitcoin Cash | `m/44'/145'/0'/0/N` |

`N` es el índice (0, 1, 2, …).

### Encontrar una dirección concreta

Lo más cómodo es una herramienta que liste direcciones derivadas con índices y claves privadas.

#### Herramienta: iancoleman BIP39

[iancoleman.io/bip39](https://iancoleman.io/bip39/) — código abierto; guarde la página y úsela sin internet.

> ⚠️ **Introduzca la frase semilla solo sin conexión.** Guarde la página, desconecte internet y luego escríbala. No en equipos ajenos ni en línea.

**Pasos:**

1. Abra el sitio y guarde la página (Ctrl+S / Cmd+S)
2. Sin internet, abra el archivo guardado
3. En **BIP39 Mnemonic**, la frase
4. En **Coin**: `ETH — Ethereum` para EVM; `BTC` o `BCH` según corresponda
5. En **Derivation Path**, pestaña **BIP44** o **BIP84** (SegWit)
6. Tabla **Derived Addresses**
7. Localice la dirección de la transacción
8. Copie la clave privada para importarla

Por defecto índices 0–19; use **Show more rows** o **starting from index**.

> Muchas direcciones están entre 0 y 1000; amplié el rango de 20 en 20 si no aparece.
