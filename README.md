# Babylon Community
Offizielles Repository zur Semesterarbeit NDS HF Applikationsentwickler im dritten Semester von Claudia Martinez &amp; Marco Rensch.

## Voraussetzungen
- Node Version 18.x
- NPM Version 7.x
- MariaDB min. Version 10.10.x oder MySQL min. Version 5.7.x

## Installation Datenbank
### Windows
Unter Windows kann die MariaDB oder MySQL Datenbank einfach über den offiziellen Installer installiert werden.
Zum Installer für [MariaDB](https://downloads.mariadb.org/mariadb/) oder [MySQL](https://dev.mysql.com/downloads/mysql/).

### macOS
Unter macOS wird exemplarisch die Installation von MariaDB mittels Homebrew beschrieben.
Homebrew ist ein Package Manager für macOS. Er kann über die [Brew Homepage](https://brew.sh/) installiert werden.
Für MySQL kann Homebrew ebenfalls verwendet werden, es kann aber auch der offizielle Installer [hier](https://dev.mysql.com/downloads/mysql/) verwendet werden.

#### Installation MariaDB
```
brew install mariadb
```
#### Start MariaDB
```
brew services start mariadb
```
#### Stop MariaDB
```
brew services stop mariadb
```



## Installation
- Datenbanksystem starten
- `npm install` im Projektverzeichnis ausführen
    - Installiert alle benötigten Abhängigkeiten in Server <i>( Client folgt nach implementierung CLODOS )</i>
    - Startet Konfigurationsskript (überschreibt existierende Konfiguration!)
    - Startet Optional Konfigurationsskript für Datenbank

## Konfiguration
Der Konfigurationsprozess wird beim Ausführen von `npm install` gestartet.
Alternativ kann das Konfigurationsskript auch manuell gestartet werden.
```
npm run setup
```

## Start
- Datenbanksystem starten
- `npm start` im Projektverzeichnis ausführen
    - Startet den Server
    - Startet den Client
