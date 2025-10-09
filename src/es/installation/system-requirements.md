# Requisitos del sistema

La arquitectura de la aplicación permite instalar los módulos `dv-merchant` y `dv-processing` en servidores diferentes.
Los requisitos del sistema que se especifican a continuación son para la instalación en un solo servidor con un sistema
operativo limpio utilizando el paquete
`dv-env`.

- 4GB de RAM
- CPU de 4 núcleos
- SSD NVMe de 30GB

## Requisitos del sistema operativo

Versiones del sistema operativo compatibles:

- CentOS 9
- Debian 12
- Ubuntu 22.04
- Ubuntu 24.04
- Puertos no utilizados: 80, 8080, 9000 (pueden ser modificados por el archivo de configuración)
- Puerto 80 abierto

## Requisitos de software

Si el sistema se instala sin el paquete dv-env, entonces el sistema debe tener:

- Postgres en versión no inferior a 16
- Redis en versión no inferior a 6.2  
