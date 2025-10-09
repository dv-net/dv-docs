# Anwendungsmodule

## Hauptmodule

Die Anwendung besteht aus drei Modulen:

- `dv-merchant` - Dieses Modul beinhaltet den Webserver, das Frontend zur Anzeige des Zahlungsformulars und des
  Admin-Panels, den Code für die Interaktion mit externen Börsen sowie die gesamte Geschäftslogik zur Erstellung von
  Projekten, Kunden-Wallets, dem Versenden von Webhooks an den Shop und die Regeln für die Weiterleitung der erhaltenen
  Kryptowährung.
- `dv-processing` - Dieses Modul speichert mnemonische Phrasen und signiert Transaktionen im Auftrag von `dv-merchant`.
- `dv-updater` - Dieses Modul ist für die automatische Aktualisierung zuständig und wird von `dv-merchant` gesteuert.

## Zusätzliche Pakete

Im Ökosystem existieren auch `dv-env`-Pakete für verschiedene Betriebssysteme, welche `postgres` und `redis` in einer
speziell kompilierten und automatisch konfigurierbaren Weise enthalten.

## Anwendungsbereitstellung und Benutzerrechte

Alle Module werden im Verzeichnis „/home/dv“ installiert und der Benutzer „dv:dv“ wird im Betriebssystem erstellt. Für
`postgres` und `redis`, die mit dem Paket `dv-env` installiert wurden, behalten ihre ursprünglichen Benutzer, laufen
aber auf nicht standardmäßigen
Ports: „postgres“: „5433“, „redis“: „6380“. Der Autostart der Dienste erfolgt über „systemd“.