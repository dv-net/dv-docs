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

Im Ökosystem stehen zusätzliche Pakete und Werkzeuge zur Verfügung, die zur Installation und Konfiguration von zusätzlichen Diensten (PostgreSQL, Redis usw.) verwendet werden können. Ihre Zusammensetzung und Installationsmethoden können je nach Betriebssystem und spezifischem Build der Anwendung variieren.

## Anwendungsbereitstellung und Benutzerrechte

Alle Anwendungsmodule werden im Verzeichnis `/home/dv` installiert.
Das Betriebssystem erstellt automatisch den Systembenutzer `dv:dv`, der zum Ausführen der Anwendungsdienste und zur Verwaltung der Konfigurationsdateien verwendet wird.

Dienste wie PostgreSQL und Redis werden mit den Standardwerkzeugen des Betriebssystems oder mit den im Lieferumfang der Anwendung enthaltenen Automatisierungswerkzeugen installiert. Sie verwenden normale Systemkonten und Standardports (sofern in der Konfiguration nicht anders angegeben).
Der automatische Start der Dienste erfolgt über `systemd`.