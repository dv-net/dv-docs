# Depósito en red no admitida — recuperar fondos

Si un pagador envió tokens a la dirección de su monedero pero eligió una red que su comercio no admite, los fondos no se pierden. Aquí explicamos qué ocurrió y cómo recuperarlos.

## Por qué ocurre

La mayoría de redes compatibles con Ethereum (Base, BNB Chain, Polygon, Arbitrum, etc.) usan el mismo formato de dirección. La misma dirección existe en todas esas redes a la vez.

Al enviar, el exchange o monedero hace elegir la red al pagador. Si eligió una red que su comercio no supervisa, la transacción tuvo éxito en la cadena — pero su sistema no la registró.

> **Los fondos están seguros.** Están en la dirección correcta, solo en otra red. Puede acceder con la clave privada de esa dirección o con la frase semilla del comercio.

## Cómo recuperar los fondos

### Paso 1 — Verifique la transacción

Pida al pagador el hash de la transacción. Abra un explorador de bloques de esa red y confirme:

- la dirección del destinatario coincide con la de su tienda
- el estado es **Success**
- el token y el importe son los esperados

Explorador: [ChainApi](https://chainapi.org/).

### Paso 2 — Busque la dirección en Hot Wallets

1. Vaya a **Transfers → Hot Wallets** en el panel
2. Busque la dirección del destinatario de la transacción
3. Confirme que aparece en la lista

> Si no aparece, desactive el filtro **Hide addresses with low balance**.

### Paso 3 — Obtenga acceso a la dirección

Necesita un **secreto** para controlar la dirección que recibió el depósito en la otra red: la **clave privada** de esa dirección o la **frase semilla** del comercio.

- Si trabaja con **una sola dirección**, normalmente basta la **clave privada**. Vea [Exportar claves privadas](./export-keys.md).
- Si necesita **todas las direcciones** y quizá el índice correcto, use la **frase semilla**. Vea [Frase semilla: exportar, importar y buscar direcciones](./seed-phrase.md).

> ⚠️ **La clave privada y la frase semilla dan acceso total a los fondos.** No las comparta ni las guarde en lugares inseguros.

### Paso 4 — Importar en un monedero

Importe en un monedero de terceros el método que obtuvo:

- **clave privada** — importar clave privada
- **frase semilla** — importar frase semilla

Confirme la dirección, cambie a la red de los tokens y revise el saldo.

Pasos detallados para MetaMask y OKX Wallet están en [Importar claves a una billetera cripto](./wallets-import.md).
