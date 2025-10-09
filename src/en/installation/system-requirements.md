# System requirements

The application architecture allows you to install the `dv-merchant` and `dv-processing` modules on different servers,
system requirements are specified for installation on one server on a clean operating system using the package
`dv-env`

- 4GB RAM
- 4 Core CPU
- 30GB NVMe SSD

## Operating system requirements

Supported operating system versions:

- CentOS 9
- Debian 12
- Ubuntu 22.04
- Ubuntu 24.04
- Unused ports 80, 8080, 9000 (can be overridden by the configuration file)
- Open port 80

## Software requirements

If the system is installed without the dv-env package, then the system must have

- Postgres version no lower than 16
- Redis version no lower than 6.2

Please note that if you have a Firewall on your server, you need to add ports 80, 443 to the exceptions.

