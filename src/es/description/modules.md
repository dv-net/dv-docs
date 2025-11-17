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

El ecosistema proporciona paquetes y herramientas adicionales que pueden utilizarse para instalar y configurar servicios auxiliares (PostgreSQL, Redis, etc.). Su composición y métodos de instalación pueden variar según el sistema operativo y la compilación específica de la aplicación.

## Ubicación de la aplicación y derechos de usuario

Todos los módulos de la aplicación se instalan en el directorio `/home/dv`.
El sistema crea automáticamente el usuario `dv:dv`, que se utiliza para ejecutar los servicios de la aplicación y gestionar los archivos de configuración.

Servicios como PostgreSQL y Redis se instalan mediante las herramientas estándar del sistema operativo o mediante herramientas de automatización proporcionadas con la aplicación. Utilizan cuentas del sistema y puertos estándar (a menos que se especifique lo contrario en la configuración).
El inicio automático de los servicios está gestionado por `systemd`.
