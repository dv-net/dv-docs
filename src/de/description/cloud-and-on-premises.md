# Einrichtung des DV.net Crypto Merchant: Cloud vs. On-Premise-Server

Die Entscheidung, wie ein Dienst zur Annahme von Kryptowährungszahlungen (Crypto Merchant) integriert wird, gehört zu den wichtigsten Fragen beim Aufbau eines Online-Geschäfts. Die Wahl zwischen **Bereitstellung auf dem eigenen Server (On-Premise)** und **Nutzung der Cloud-Version** bestimmt nicht nur die Anfangskosten, sondern auch den Grad an Kontrolle, Sicherheit und Skalierbarkeit Ihres Projekts.

Dieser Leitfaden hilft Ihnen, beide Ansätze umfassend zu vergleichen, damit Sie eine fundierte Entscheidung auf Basis der Anforderungen und Möglichkeiten Ihres Unternehmens treffen können.


## 📊 Vergleichstabelle: On-Premise-Server vs. Cloud

Die folgende Tabelle verdeutlicht die wichtigsten Unterschiede zwischen den beiden Ansätzen:

| Kriterium | Installation auf eigenem Server (On-Premise) | Cloud-Version |
|:---|:---|:---|
| **Kosten** | Kosten für Servermiete/-kauf, Miete des Internetzugangskanals, Servereinrichtung, Updates und Wartung sowie Blockchain-Transaktionsgebühren. | Es fallen nur Blockchain-Transaktionsgebühren an. |
| **Kontrolle** | Volle Kontrolle über Umgebung und Daten. | Eingeschränkte Kontrolle über Ihre Daten. |
| **Sicherheit** | Die volle Verantwortung liegt bei Ihnen: Sie müssen physische Sicherheit und Cybersicherheit selbst gewährleisten und Updates installieren. | Die Verantwortung wird mit uns geteilt; wir stellen Schutz der Infrastruktur bereit, einschließlich DDoS-Schutz. |
| **Verfügbarkeit & Zuverlässigkeit** | Risiko von Ausfällen durch Gerätestörungen; der Aufbau einer fehlertoleranten Infrastruktur ist teuer. | Hohe Zuverlässigkeit und Verfügbarkeit werden von uns gewährleistet. |
| **Merchant-Updates** | Die Verwaltung von Updates ist einfach, und Sie steuern die Updates. | Updates werden von uns automatisch durchgeführt. |


## 💻 DV.net On-Premise-Installation: Volle Kontrolle und Verantwortung

Dieser Ansatz setzt voraus, dass Sie die Crypto-Merchant-Software eigenständig auf Ihrem physischen oder virtuellen Server installieren und konfigurieren, für den Sie die volle Verantwortung tragen. Die Basisinstallation ist sehr einfach, automatisiert und dauert nicht mehr als 3 Minuten. Die erweiterte Konfiguration ist ausführlich dokumentiert.

### Vorteile des Ansatzes
- **Absolute Kontrolle**: Sie haben die vollständige Kontrolle über jeden Aspekt des Systems – von Betriebssystem- und Softwareversionen bis hin zur Firewall-Konfiguration und Sicherheitsrichtlinien. So können Sie das System perfekt an Ihre individuellen Anforderungen anpassen.
- **Datensicherheit**: Alle Daten, einschließlich verschlüsselter Seed-Phrasen und Transaktionshistorie, werden auf Ihren eigenen Datenträgern gespeichert und nicht an Dritte übertragen. Dies ist besonders wichtig für Unternehmen, die mit Daten arbeiten, die strengen regulatorischen Anforderungen unterliegen.
- **Performance**: Mit geeigneter Hardwarekonfiguration erreichen Sie konsistent niedrige **Latenz** und hohe **Performance**, da Serverressourcen nicht mit anderen Nutzern geteilt werden.

### Komplexität und Risiken
- **Laufende Betriebskosten**: Dazu zählen Kosten für Strom, Kühlung, Raummiete (falls zutreffend) und insbesondere das Gehalt qualifizierter Systemadministratoren.
- **Backup**: Nur Sie haben Zugriff auf Ihre Daten, daher liegt die Sicherstellung des **Backups** vollständig in Ihrer Verantwortung.

## ☁️ DV.net Cloud-Version: Flexibilität und Ressourceneinsparungen

Die Cloud-Lösung beinhaltet die Nutzung eines von uns bereitgestellten, einsatzbereiten Dienstes. Sie verwenden die Plattform über eine **`API`** oder eine Weboberfläche, ohne sich um die zugrunde liegende Infrastruktur zu kümmern.

### Zentrale Vorteile
- **Zuverlässigkeit und Verfügbarkeit**: Unsere Rechenzentren verfügen über Redundanz auf allen Ebenen. Dies garantiert eine hohe
- Service-**Verfügbarkeit** (oft 99,9 % und höher), die eigenständig nur schwer und teuer zu realisieren ist.
- Bei Störungen übernimmt unser Team die Problembehebung.
- **Fokus aufs Geschäft**: Sie müssen keine Ressourcen für die Wartung und Aktualisierung der Serverinfrastruktur abziehen.
- Dadurch kann sich Ihr Team auf die Geschäftsentwicklung und die Verbesserung der User Experience konzentrieren.

### Mögliche Nachteile
- **Eingeschränkte Kontrolle**: Ihre Seed-Phrasen sind verschlüsselt, werden jedoch auf unseren Servern gespeichert.