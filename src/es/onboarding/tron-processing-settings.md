# Configuración del procesamiento TRON

En la página **Configuración del procesamiento TRON**, eliges qué recursos se usarán para pagar las comisiones de red al retirar USDT desde los monederos de depósito hacia tu monedero principal o hacia un exchange. Esta elección afecta el coste de cada transferencia saliente.

## Por qué existen costes

Cuando retiras USDT (TRC-20) desde un monedero de depósito, es una llamada a un smart contract en la red TRON. Para ejecutarla se necesita **Energy**. Si el monedero no tiene Energy disponible, la red cubre el déficit quemando TRX: aproximadamente **$2-5 por transacción** (alrededor de **65.000-130.000 Energy**).

Puedes evitar estos costes o reducirlos notablemente eligiendo el modo adecuado.

::: info ¿Quieres los detalles?
Qué son Energy y Bandwidth y cómo funciona la delegación en TRON: [Red TRON: descripción general](/es/onboarding/tron-processing-overview).
:::

## Modo 1 - Burn TRX

En cada retiro de USDT desde un monedero de depósito, se quema automáticamente TRX del balance del monedero de procesamiento.

**Coste:** ~$2-5 por transferencia.

**Qué debes hacer:** mantener suficiente TRX en el monedero; el resto ocurre automáticamente.

**Cuándo elegirlo:** ideal para empezar rápido o para pruebas. No requiere configuración. Con volumen constante, es el modo más caro.

## Modo 2 - Delegate cloud from DV.net

La Energy se alquila automáticamente al proveedor DaVinci Merchant y se delega a tu monedero de procesamiento antes de cada transacción.

**Coste:** **aprox. 2x más barato** que Burn TRX.

**Qué debes hacer:** nada. Por ahora compartimos gratuitamente el excedente de Energy, pero algunas transferencias pueden tardar varias horas.

**Cuándo elegirlo:** la mejor opción por defecto para la mayoría de merchants. No requiere conocimientos técnicos, funciona out of the box y es notablemente más barato que quemar TRX.

## Modo 3 - Delegate

Congelas (stake) TRX en tu propio monedero y delegas la Energy obtenida al monedero de procesamiento. Las transferencias se realizan usando tus propios recursos.

**Coste:** ~$0 por transferencia. El TRX congelado no se gasta; la Energy se repone automáticamente cada 24 horas.

**Qué debes hacer:**

1. Congela TRX en tu monedero principal. Recibirás Energy proporcionalmente a la cantidad congelada.
2. Delega Energy a la dirección de tu monedero de procesamiento. La dirección se muestra en la parte superior de la página de configuración.

**Cuándo elegirlo:** si tienes un flujo estable de retiros y quieres minimizar costes operativos. Con ~20-30 transacciones al día, se amortiza muy rápido.
