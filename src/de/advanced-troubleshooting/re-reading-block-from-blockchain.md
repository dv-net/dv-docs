# Block erneut aus der Blockchain lesen

> ⚠️ **Nur für fortgeschrittene Benutzer.** Alle Aktionen erfolgen auf eigenes Risiko. Falsche Änderungen an der Datenbank können zu Verlust oder Duplizierung von Transaktionen führen. Stellen Sie sicher, dass Sie jeden Schritt verstehen, bevor Sie fortfahren.

## Problem

Aufgrund der Block-Reorganisation im Ethereum-Netzwerk kann eine im Blockchain bestätigte Transaktion im System fehlen. Dies geschieht, wenn die Verarbeitung einen Block aus einem temporären (verworfenen) Chain-Zweig verarbeitet und den entsprechenden Block der Hauptkette übersprungen hat. Um den korrekten Zustand wiederherzustellen, müssen Sie das erneute Lesen des erforderlichen Blocks manuell auslösen.

## Lösung

### 1. Datenbanksicherung erstellen

```bash
sudo -u postgres pg_dump dv-processing > /tmp/dv-processing_backup_$(date +%Y%m%d_%H%M%S).sql
```

Überprüfen Sie, dass die Datei erstellt wurde und nicht leer ist:

```bash
ls -lh /tmp/dv-processing_backup_*.sql
```
### 2. (!WICHTIG — in einem separaten Terminal) Verarbeitung stoppen

```bash
sudo systemctl stop dv-processing
```
### 3. (im Hauptterminal) Zum Datenbankbenutzer wechseln

```bash
sudo su
sudo su - postgres
```
### 4. (im Hauptterminal) psql starten

```bash
psql
```

oder

```bash
/home/dv/embedded/usr/local/pgsql/bin/psql -p 5433
```
### 5. (im Hauptterminal) Mit der dv-processing-Datenbank verbinden

```sql
\c dv-processing
```
### 6. (im Hauptterminal) Aktuellen Parsing-Zustand auslesen

```sql
select number from processed_blocks where blockchain = 'bsc';
```

> !WICHTIG — merken Sie sich das Ergebnis:
> ```
>   number
> ----------
>  81923203
> (1 row)
> ```
### 7. (im Hauptterminal) Wert auf Block -1 Ihrer Transaktion setzen

Beispiel für Transaktion `0xffe238ba2c1e028a8ec1c467cef53fa59112e2ccc922dc64345817f9da0f4e71` — Block `81921203`:

```sql
update processed_blocks set number = 81921203 where blockchain = 'bsc';
```
### 8. (!WICHTIG — in einem separaten Terminal) Verarbeitung starten

```bash
sudo systemctl start dv-processing
```
### 9. (im Hauptterminal) Nach ein paar Minuten prüfen, ob die Blöcke fortgeschritten sind

Der Wert sollte um mehrere Zehner oder Hunderte von `81921203` gestiegen sein — dies zeigt erfolgreiches erneutes Lesen des Blocks an.

```sql
select number from processed_blocks where blockchain = 'bsc';
```
### 10. (!WICHTIG — in einem separaten Terminal) Verarbeitung stoppen

```bash
sudo systemctl stop dv-processing
```
### 11. (im Hauptterminal) Blockwert auf den in Schritt 6 notierten Wert zurücksetzen

```sql
update processed_blocks set number = 81923203 where blockchain = 'bsc';
```
### 12. (!WICHTIG — in einem separaten Terminal) Verarbeitung starten

```bash
sudo systemctl start dv-processing
```

Danach wird die Transaktion mit hoher Wahrscheinlichkeit erfasst.
