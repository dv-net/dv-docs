# Systemanforderungen

Die Anwendungsarchitektur ermöglicht die Installation der Module `dv-merchant` und `dv-processing` auf verschiedenen
Servern. Die Systemanforderungen sind für die Installationsvariante auf einem einzelnen Server mit einem sauberen
Betriebssystem unter Verwendung des `dv-env`-Pakets angegeben.

- 4GB RAM
- 4 Core CPU
- 30GB NVMe SSD

## Anforderungen an das Betriebssystem

Unterstützte Betriebssystemversionen:

- CentOS 9
- Debian 12
- Ubuntu 22.04
- Ubuntu 24.04
- Freie Ports 80, 8080, 9000 (können durch die Konfigurationsdatei überschrieben werden)
- Offener Port 80

## Softwareanforderungen

Wenn das System ohne das `dv-env`-Paket installiert wird, müssen folgende Komponenten im System installiert sein:

- Postgres Version 16 oder höher
- Redis Version 6.2 oder höher