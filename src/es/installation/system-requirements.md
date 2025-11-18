# Requisitos del sistema

La arquitectura de la aplicación permite instalar los módulos `dv-merchant` y `dv-processing` en servidores diferentes; los requisitos del sistema se especifican para el escenario en el que todo se instala en un solo servidor con un sistema operativo limpio.


- 4GB de RAM
- CPU de 4 núcleos
- SSD NVMe de 30GB

## Requisitos del sistema operativo

Versiones del sistema operativo compatibles:

- CentOS 8, 9, 10
- Debian 11, 12, 13
- Ubuntu 22.04, 24.04
- Puertos no utilizados: 80, 8080, 9000 (pueden ser modificados por el archivo de configuración)
- Puerto 80 abierto

## Requisitos de software

Para una instalación separada se requiere:

- Postgres 16+
- Redis 6.2+  
