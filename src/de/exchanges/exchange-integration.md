# Integration der Börse

### In diesem Abschnitt finden Sie Informationen zur Integration Ihrer Börse in unsere Lösung.

Dies ist notwendig, damit ein Händler:

- die aktuellen Wechselkurse der Währungen anfragen kann,
- seinen aktuellen Saldo an der Börse abfragen kann,
- seine Währung gemäß den festgelegten Umtauschregeln umtauschen kann,
- Währung gemäß den festgelegten Auszahlungsregeln abheben kann.

Wir erklären auch, wie die Funktion der Währungsauszahlung von der Börse funktioniert.  
Sie legen im Auszahlungsinterface den „Mindestbetrag für Auszahlungen“ – „X“ fest, und basierend auf dieser Einstellung
fordert der Händler die Börse auf, Währung ab einem Wert von X auszuzahlen. Dabei muss der Prozess der Blockbestätigung
berücksichtigt werden, und der auf der Börse angezeigte Saldo bedeutet nicht immer, dass alle angezeigten Mittel
abgehoben werden können. Manchmal muss die Bestätigung der Blöcke abgewartet werden. Unsere Funktion reduziert, wenn ein
Saldo sichtbar ist, aber nicht abgehoben werden kann, den Auszahlungsbetrag um 10 $ und versucht erneut, die Auszahlung
durchzuführen. Dieser Schritt wird fortgesetzt, bis die Mittel ausgezahlt werden können.  
*Daraus folgt, dass der Betrag der ausgezahlten Mittel nicht immer der Mindestauszahlungsregel entspricht.