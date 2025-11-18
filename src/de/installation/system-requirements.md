# Systemanforderungen

Die Architektur der Anwendung ermöglicht es, die Module `dv-merchant` und `dv-processing` auf unterschiedlichen Servern zu installieren; die Systemanforderungen beziehen sich auf die Variante, bei der alles auf einem einzigen Server mit einem frischen Betriebssystem installiert wird.


- 4GB RAM
- 4 Core CPU
- 30GB NVMe SSD

## Anforderungen an das Betriebssystem

Unterstützte Betriebssystemversionen:

- CentOS 8, 9, 10
- Debian 11, 12, 13
- Ubuntu 22.04, 24.04
- Freie Ports 80, 8080, 9000 (können durch die Konfigurationsdatei überschrieben werden)
- Offener Port 80

## Softwareanforderungen

Für eine getrennte Installation werden benötigt:

- Postgres 16+
- Redis 6.2+