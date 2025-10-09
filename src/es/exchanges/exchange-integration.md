# Integración de la Bolsa

### En esta sección se recopila información sobre la integración de su bolsa con nuestra solución.

Esto es necesario para que un comerciante pueda:

- solicitar los tipos de cambio actuales de las monedas,
- consultar su saldo actual en la bolsa,
- cambiar su moneda según las reglas de cambio establecidas,
- retirar moneda según las reglas de retiro establecidas.

También explicaremos cómo funciona la funcionalidad de retiro de moneda desde la bolsa.  
Usted configura en la interfaz de retiro la "Cantidad mínima de retiro" - "X", y según esta configuración, el
comerciante solicita a la bolsa retirar moneda solo a partir del valor X. Es necesario tener en cuenta el proceso de
confirmación de bloques, y que el saldo mostrado en la bolsa no siempre significa la posibilidad de retirar todos los
fondos mostrados. A veces, es necesario esperar la confirmación de los bloques. Nuestra funcionalidad, cuando ve un
saldo pero no puede retirarlo, reduce el valor del monto de retiro en 10 dólares e intenta nuevamente realizar el
retiro, y continúa con este paso hacia abajo hasta que los fondos se retiren.  
*De esto se deduce que el monto de los fondos retirados no siempre corresponde a la regla de retiro mínimo.