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

## Backend API Routen
:white_check_mark: = fertig implementiert<br>
:warning: = in Arbeit<br>
:x: = noch nicht implementiert.
#### User (/users/...)
| Status             | Route              | Beschreibung            | Produktiv |
|--------------------|--------------------|-------------------------|-----------|
| :warning:          | `GET&nbsp;/`       | Gibt alle User zurück   | Ja        |
| :white_check_mark: | `GET&nbsp;/:id`    | Gibt einen User zurück  | Ja        |
| :x:                | `POST&nbsp;/`      | Erstellt einen User     | Ja        |
| :x:                | `PUT&nbsp;/:id`    | Aktualisiert einen User | Ja        |
| :x:                | `DELETE&nbsp;/:id` | Entfernt einen User     | Ja        |

#### Fragen (/questions/...)
| Status                          | Route                | Beschreibung                                | Produktiv |
|---------------------------------|----------------------|---------------------------------------------|-----------|
| :x:                            | `GET&nbsp;/`   | Gibt eine Liste aller Fragen zurück         | nein      |
| :x:                           | `GET&nbsp;/:id` | Gibt eine Frage zurück                      | ja        |
| :x:                             | `POST&nbsp;/` | Erstellt eine neue Frage                    | ja        |
| :x:                             | `PUT&nbsp;/:id` | Aktualisiert eine Frage                     | ja        |
| :x:                             | `DELETE&nbsp;/:id` | Löscht eine Frage                           | ja        |
|:x:  | `GET&nbsp;/user/:user_id` |Gibt alle Fragen eines Users zurück| ja        |

#### Antworten (/answers/...)
| Status | Route                     | Beschreibung                                | Produktiv |
|--|---------------------------|---------------------------------------------|-----------|
| :x:   | `GET&nbsp;/`      | Gibt eine Liste aller Antworten zurück      | Nein      |
| :x:   | `GET&nbsp;/:question_id` | Gibt eine alle Antworten einer Frage zurück | Ja        |
| :x:   | `POST&nbsp;/`           | Erstellt eine neue Antwort                  | Ja        |
| :x:   | `PUT&nbsp;/:id`         | Aktualisiert eine Antwort                   | Ja        |
| :x:   | `DELETE&nbsp;/:id`      | Löscht eine Antwort                         | Ja        |


#### Kategorien (/categories/...)
| Status | Route                                              | Beschreibung     | Produktiv |
|--------|----------------------------------------------------|------------------|-----------|
| :x:    | `GET&nbsp;/`                                       | Gibt eine Liste aller Kategorien zurück |nein|
| :x:    | `GET&nbsp;/:id`                                    | Gibt eine Kategorie zurück | |
| :x:    | `POST&nbsp;/`                                      | Erstellt eine neue Kategorie | |
| :x:    | `PUT&nbsp;/:id`                                    | Aktualisiert eine Kategorie | |
| :x:    | `DELETE&nbsp;/:id`                                 |Löscht eine Kategorie||
| :x:    | `GET&nbsp;/questions/`                             | Gibt eine Liste aller Fragen-Kategorien Verknüpfungen zurück | nein |
| :x:    | `GET&nbsp;/questions/:question_id`                 | Gibt alle Kategorien einer Frage zurück ||
| :x:    | `POST&nbsp;/questions/`                            | Erstellt eine neue Fragen-Kategorien Verknüpfung||
| :x:  | `DELETE&nbsp;/questions/:question_id/:category_id` | Löscht eine Fragen-Kategorien Verknüpfung     ||

#### Authentifizierung (/auth/...)
| Status | Route                                              | Beschreibung     | Produktiv |
|--------|----------------------------------------------------|------------------|-----------|
| :x:    | `POST&nbsp;/login`                                 | Loggt einen User ein | ja |
| :x:    | `POST&nbsp;/logout`                                | Loggt einen User aus | ja |
| :x:    | `POST&nbsp;/register`                              | Registriert einen neuen User | ja |
