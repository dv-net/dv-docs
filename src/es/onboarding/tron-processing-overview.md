# Red TRON: descripción general

Para entender cómo funciona el procesamiento de USDT en TRON y por qué tienen sentido distintos modos de pago de comisiones, es útil conocer los conceptos básicos de la red. Esta página no es obligatoria, pero ayuda a tomar decisiones informadas al configurar el monedero.

## Modelo de recursos de TRON

A diferencia de Ethereum, donde cada transacción paga una comisión en ETH, TRON utiliza un sistema de recursos de dos capas. Cualquier acción en la red consume uno o ambos recursos: **Bandwidth** y **Energy**.

### Bandwidth

Bandwidth se consume en **cualquier** transacción; es el "tamaño" de la transacción medido en bytes.

- Cada cuenta recibe **600 Bandwidth Points al día** gratis.
- Si se supera el límite, la transacción igualmente se ejecuta, pero se descuenta (quema) TRX.
- Tasa de quema: **1 Bandwidth Point = 0.001 TRX**.

### Energy

Energy se consume al ejecutar **smart contracts**. Todas las transferencias de tokens TRC-20 (USDT, USDC, etc.) son llamadas a smart contracts y requieren Energy.

- No existe un límite gratuito de Energy; se obtiene congelando TRX o alquilándola.
- Si no hay suficiente Energy, la red quema TRX para cubrir el déficit.
- Tasa de quema: **1 Energy ~= 0.00021 TRX**.
- Una transferencia típica de USDT consume alrededor de **30.000-65.000 Energy**, lo que puede costar cerca de **$1-2** si se paga quemando TRX.

### Comparación de recursos

| | Bandwidth | Energy |
|---|---|---|
| Se usa para | Todas las transacciones | Acciones de smart contract (TRC-20) |
| Asignación gratis | 600 Points/día | No |
| Reposición | Cada 24 horas | Cada 24 horas (si hay stake) |
| Cómo obtener | Asignación gratis o congelar TRX | Congelar TRX o alquilar |
| Precio por quema | 0.001 TRX / Point | 0.00021 TRX / Energy |
| Delegación | Sí | Sí |

### Reposición de recursos

Los recursos obtenidos al congelar TRX se reponen de forma continua: aproximadamente cada ~3 segundos (un bloque) vuelve a estar disponible una parte proporcional del total diario. En la práctica, con suficiente stake, puedes enviar transacciones casi gratis mientras el consumo no supere la velocidad de reposición.

## Congelar TRX (Stake 2.0)

Congelar TRX es el mecanismo principal para obtener recursos. Bloqueas TRX y recibes Energy o Bandwidth, además de TRON Power (derecho de voto para validadores).

El modelo actual es **Stake 2.0** (lanzado en 2023):

- La congelación es inmediata: los recursos se acreditan al instante.
- Descongelar tarda **14 días** (unstaking).
- Se puede congelar TRX por separado "para Energy" y "para Bandwidth".
- Se pueden **delegar recursos** a otras direcciones.

La Energy es proporcional a tu participación del total de TRX congelado en la red:

> **Tu Energy** = (Tu TRX congelado / Total de TRX congelado en la red) x Límite diario de Energy de la red

## Delegación de recursos

La delegación permite transferir Energy o Bandwidth de una cuenta a otra sin transferir tokens. Los recursos delegados funcionan para el destinatario igual que los propios.

Esto es la base del modo **Delegate** en la configuración de procesamiento de DV Merchant: congelas TRX en tu monedero principal y delegas Energy a la dirección del monedero de procesamiento.

::: tip Más información
Cómo elegir el modo de procesamiento: [Configuración del procesamiento TRON](/es/onboarding/tron-processing-settings).
:::
