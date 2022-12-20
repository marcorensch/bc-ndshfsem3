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
    - Installiert alle benötigten Abhängigkeiten in Server & Client Verzeichnis
    - Startet Konfigurationsskript (überschreibt ggf. existierende Konfiguration!)
    - Startet Optional Konfigurationsskript für Datenbank

## Konfiguration
Der Konfigurationsprozess wird nach dem Ausführen von `npm install` im Projektverzeichnis automatisch gestartet.
Alternativ kann das Konfigurationsskript auch manuell vom Projektverzeichnis aus gestartet werden.
```
npm run setup
```

## Start (devStart)
- Datenbanksystem starten
- `npm run devStart` im Projektverzeichnis ausführen
    - Startet den Server
    - Startet den Client

## Backend API Routen
:white_check_mark: = fertig implementiert<br>
:warning: = in Arbeit<br>
:x: = noch nicht implementiert.
#### User (/users/...)
| Status    | Route              | Beschreibung            | Produktiv |
|-----------|--------------------|-------------------------|-----------|
| :warning: | `GET /`       | Gibt alle User zurück   | Ja        |
| :warning: | `GET /:id`    | Gibt einen User zurück  | Ja        |
| :x:       | `PUT /:id`    | Aktualisiert einen User | Ja        |
| :x:       | `DELETE /:id` | Entfernt einen User     | Ja        |

Hinweis: Benutzer erstellen ist nicht möglich, da dies über die Authentifizierung erfolgt.

#### Fragen (/questions/...)
| Status                          | Route                | Beschreibung                                | Produktiv |
|---------------------------------|----------------------|---------------------------------------------|-----------|
| :x:                            | `GET /`   | Gibt eine Liste aller Fragen zurück         | nein      |
| :x:                           | `GET /:id` | Gibt eine Frage zurück                      | ja        |
| :x:                             | `POST /` | Erstellt eine neue Frage                    | ja        |
| :x:                             | `PUT /:id` | Aktualisiert eine Frage                     | ja        |
| :x:                             | `DELETE /:id` | Löscht eine Frage                           | ja        |
|:x:  | `GET /user/:user_id` |Gibt alle Fragen eines Users zurück| ja        |

#### Antworten (/answers/...)
| Status    | Route                     | Beschreibung                                | Produktiv |
|-----------|--------------------------|---------------------------------------------|-----------|
| :x:       | `GET /`             | Gibt eine Liste aller Antworten zurück      | Nein      |
| :x:       | `GET /:question_id` | Gibt eine alle Antworten einer Frage zurück | Ja        |
| :x:       | `POST /`            | Erstellt eine neue Antwort                  | Ja        |
| :x:       | `PUT /:id`          | Aktualisiert eine Antwort                   | Ja        |
| :x:       | `DELETE /:id`       | Löscht eine Antwort                         | Ja        |


#### Kategorien (/categories/...)
| Status | Route                                              | Beschreibung     | Produktiv |
|--------|----------------------------------------------------|------------------|-----------|
| :x:    | `GET /`                                       | Gibt eine Liste aller Kategorien zurück | nein      |
| :x:    | `GET /:id`                                    | Gibt eine Kategorie zurück | ja        |
| :x:    | `POST /`                                      | Erstellt eine neue Kategorie | ja        |
| :x:    | `PUT /:id`                                    | Aktualisiert eine Kategorie | ja        |
| :x:    | `DELETE /:id`                                 |Löscht eine Kategorie| ja        |
| :x:    | `GET /questions/`                             | Gibt eine Liste aller Fragen-Kategorien Verknüpfungen zurück | nein      |
| :x:    | `GET /questions/:question_id`                 | Gibt alle Kategorien einer Frage zurück | ja        |
| :x:    | `POST /questions/`                            | Erstellt eine neue Fragen-Kategorien Verknüpfung| ja        |
| :x:  | `DELETE /questions/:question_id/:category_id` | Löscht eine Fragen-Kategorien Verknüpfung     | ja        |

#### Authentifizierung (/auth/...)
| Status | Route                                              | Beschreibung                 | Produktiv |
|-------|----------------------------------------------------|------------------------------|-----------|
| :x:   | `POST /login`                                 | Loggt einen User ein         | ja |
| :x:   | `POST /logout`                                | Loggt einen User aus         | ja |
| :white_check_mark:    | `POST /register`                              | Registriert einen neuen User | ja |


# API Dokumentation
## Fehler
Im Falle eines Fehlers wird eine Fehlermeldung im JSON Format zurückgegeben (ApiError Objekt).
```
{
    "code": "Fehlercode",                    // z.B. "u-318" oder "u-321"
    "message":"Fehlermeldung",               // z.B. "User already exists" oder "User not found"
    "relatedColumn":"Betroffene Spalte (DB)" // z.B. "email" oder "username"
}
```
## Übersicht der Fehlercodes
### User related
- Error Code u-318: Form Validierungsfehler - Ungültige E-Mail Adresse
- Error Code u-319: Form Validierungsfehler - Ungültige Zeichenanzahl
- Error Code u-320: Form Validierungsfehler - Ungültige Zeichen
- Error Code u-321: Datenbankfehler - existiert bereits
