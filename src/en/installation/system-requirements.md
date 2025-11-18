# System requirements

The application architecture allows installing the `dv-merchant` and `dv-processing` modules on different servers; the system requirements are specified for the option where everything is installed on a single server with a clean operating system.
 

- 4GB RAM
- 4 Core CPU
- 30GB NVMe SSD

## Operating system requirements

Supported operating system versions:

- CentOS 8, 9, 10
- Debian 11, 12, 13
- Ubuntu 22.04, 24.04
- Unused ports 80, 8080, 9000 (can be overridden by the configuration file)
- Open port 80

## Software requirements

For separate installation, the following are required:

- Postgres 16+
- Redis 6.2+

