# Módulos de la aplicación

## Módulos básicos

La aplicación consta de tres módulos:

- `dv-merchant` - el módulo incluye un servidor web, una interfaz para mostrar el formulario de pago y el panel de
  control, el código de
  interacción con intercambios de terceros, así como toda la lógica de negocio para la creación de proyectos, monederos
  para clientes, envío de
  webhooks a la tienda y reglas para el envío de la criptomoneda recibida.
- `dv-processing` - el módulo almacena la frase mnemotécnica y firma transacciones en nombre de `dv-merchant`.
- `dv-updater` - el módulo es responsable de la actualización automática. Se gestiona desde `dv-merchant`.

## Paquetes adicionales

En el ecosistema también existen paquetes `dv-env` para diferentes sistemas operativos, que incluyen `postgres` y
`redis` empaquetados de forma especial y configurados automáticamente.

## Ubicación de la aplicación y derechos de usuario

Todos los módulos se instalan en el directorio `/home/dv`, y se crea el usuario `dv:dv` en el sistema operativo. Para
`postgres` y `redis` instalados mediante el paquete `dv-env`, se conservan sus usuarios originales, pero se ejecutan en
puertos no estándar:
`postgres`: `5433`, `redis`: `6380`. El inicio automático de los servicios se gestiona mediante `systemd`.
