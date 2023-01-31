# Babylon Community

Offizielles Repository zur Semesterarbeit NDS HF Applikationsentwickler im dritten Semester von Claudia Martinez &amp;
Marco Rensch.

## Voraussetzungen

- Node Version 18.x
- NPM Version 7.x
- MariaDB min. Version 10.10.x oder MySQL min. Version 5.7.x
- Eigenes Zertifikat für HTTPS (optional) -
  siehe [Self signed Zertifikat generieren](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/)
    - Hinweis: Unter MacOS muss das Zertifikat in den Keychain importiert werden und anschliessend als vertrauenswürdig
      markiert werden.
    - Hinweis: Wenn der Client sich nicht mit dem Server verbinden kann muss du zunächst das Zertifikat im Browser
      akzeptieren. Öffne hierzu die Adresse https://localhost:3000 (wobei 3000 deinem Server Port entsprechen muss).

## Installation Datenbank

### Windows

Unter Windows kann die MariaDB oder MySQL Datenbank einfach über den offiziellen Installer installiert werden.
Zum Installer für [MariaDB](https://downloads.mariadb.org/mariadb/)
oder [MySQL](https://dev.mysql.com/downloads/mysql/).

### macOS

Unter macOS wird exemplarisch die Installation von MariaDB mittels Homebrew beschrieben.
Homebrew ist ein Package Manager für macOS. Er kann über die [Brew Homepage](https://brew.sh/) installiert werden.
Für MySQL kann Homebrew ebenfalls verwendet werden, es kann aber auch der offizielle
Installer [hier](https://dev.mysql.com/downloads/mysql/) verwendet werden.

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

## Konfiguration

Der Konfigurationsprozess kann nach dem Ausführen von `npm install` im Projektverzeichnis gestartet werden.
Die Konfiguration unterstützt dich dabei die benötigten Datenbanktabellen und einen Administrator-Account einzurichten.

```
npm run setup
```

## Start (devStart)

- Datenbanksystem starten
- `npm run devStart` im Projektverzeichnis ausführen
    - Startet den Server
    - Startet den Client

Hinweis: Wird SSL verwendet muss im Browser die URL des API-Servers aufgerufen werden und das Zertifikat muss akzeptiert
werden. Mit den Basiseinstellungen ist dies über die URL "https://localhost:3000" möglich.

## E2E Test Ausführung

- Applikation mit Testdatenbank starten
    - `npm run test:e2e` im Projektverzeichnis ausführen
- Start E2E Test
    - cd client
    - `npm run test` im Clientverzeichnis ausführen

-------------------------------------------------------

# API Dokumentation

## API Routen

:white_check_mark: = fertig implementiert & getestet<br>
:warning: = in Arbeit / kann funktionieren - kann aber Fehler werfen<br>
:x: = noch nicht implementiert.

#### User (/users/...)

| Status             | Type   | Route    | Beschreibung                              | Request                           | Response        |
|--------------------|--------|----------|-------------------------------------------|-----------------------------------|-----------------|
| :white_check_mark: | GET    | `/`      | Gibt alle User zurück                     | header.token, header.refreshToken |                 |
| :white_check_mark: | GET    | `/me`    | Gibt einen User zurück                    | Ja                                |                 |
| :white_check_mark: | PUT    | `/me`    | Aktualisiert einen User                   | Ja                                |                 |
| :white_check_mark: | DELETE | `/:id`   | Löscht einen User                         | header.token, body.user_id        |                 |
| :white_check_mark: | POST   | `/check` | Gibt zurück ob username / email existiert | body.username oder body.email     | true oder false |

Hinweis: Benutzerregistration & Login siehe Authentifizierungs-Routen.

#### Fragen (/questions/...)

| Status             | Type   | Route         | Beschreibung                         | Request                                                                               | Response                                                                      |
|--------------------|--------|---------------|--------------------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| :white_check_mark: | GET    | `/`           | Gibt eine Liste aller Fragen zurück  | header.token, body.count, body.offset, body.user_id, body.category_id, body.direction | success:bool, data: [{...},...], userId: int / null*, isAdmin:bool/null*      |
| :white_check_mark: | GET    | `/:id`        | Gibt eine Frage & Antworten zurück   | header.token, params.id                                                               | question:{...}, answers: [{...},...], userId: int / null*, isAdmin:bool/null* |
| :white_check_mark: | POST   | `/create`     | Erstellt eine neue Frage             | header.token, body.refreshToken, body.content, body.category_id, body.anonymous       |                                                                               |
| :white_check_mark: | PUT    | `/:id`        | Aktualisiert eine Frage              | header.token, body.refreshToken, body.content, body.category_id, body.anonymous       | success:bool, message: ... , userId: int / null*, isAdmin:bool/null*          |
| :white_check_mark: | DELETE | `/:id`        | Löscht eine Frage                    | ja                                                                                    |                                                                               |
| :white_check_mark: | POST   | `/:id/vote`   | Setzt ein Voting für eine Frage ab   | header.token, body.type (INT (1 / 0 / -1))                                            |                                                                               |
| :white_check_mark: | PUT    | `/:id/answer` | Definiert korrekte Antwort auf Frage | header.token, body.accepted_id                                                        |                                                                               |

*: Nur wenn Token vorhanden & valide ist sonst NULL

#### Antworten (/answers/...)

| Status             | Type   | Route       | Beschreibung                         | Request                                                         | Response                           |
|--------------------|--------|-------------|--------------------------------------|-----------------------------------------------------------------|------------------------------------|
| :white_check_mark: | POST   | `/create`   | Erstellt eine neue Antwort           | header.token, body.refreshToken, body.question_id, body.content | {message, userId, isAdmin, token*} |
| :white_check_mark: | PUT    | `/:id`      | Aktualisiert eine Antwort            | header.token, header.refreshToken, body.content                 | true / false                       |
| :white_check_mark: | DELETE | `/:id`      | Löscht eine Antwort                  | Ja                                                              |                                    |
| :white_check_mark: | POST   | `/:id/vote` | Setzt ein Voting für eine Antwort ab | header.token, body.type (INT (1 / 0 / -1))                      |                                    |

*: Nur wenn neuer Token generiert wurde

#### Tags (/tags/...)

| Status             | Type   | Secured | Route     | Beschreibung                      | Request    | Response                        |
|--------------------|--------|---------|-----------|-----------------------------------|------------|---------------------------------|
| :white_check_mark: | GET    |         | `/`       | Gibt eine Liste aller Tags zurück | -          | response.data [{id,title}, ...] |
| :white_check_mark: | POST   |         | `/create` | Erstellt eine neuen Tag           | body.title |                                 |
| :white_check_mark: | PUT    |         | `/:id`    | Aktualisiert einen Tag            | body.title | true oder DB Error              |
| :white_check_mark: | DELETE |         | `/:id`    | Löscht einen Tag                  |            |                                 |

#### Kategorien (/categories/...)

| Status             | Type   | Secured | Route     | Beschreibung                            | Request    | Response                        |
|--------------------|--------|---------|-----------|-----------------------------------------|------------|---------------------------------|
| :white_check_mark: | GET    |         | `/`       | Gibt eine Liste aller Kategorien zurück | -          | response.data [{id,title}, ...] |
| :white_check_mark: | GET    |         | `/:id`    | Gibt eine Kategorie zurück              | query.id   | response.data {id,title}        |
| :white_check_mark: | POST   |         | `/create` | Erstellt eine neue Kategorie            | body.title |                                 |
| :white_check_mark: | PUT    |         | `/:id`    | Aktualisiert eine Kategorie             | body.title | true oder DB Error              |
| :white_check_mark: | DELETE |         | `/:id`    | Löscht eine Kategorie                   |            |                                 |

#### Authentifizierung (/auth/...)

| Status             | type   | Route       | Beschreibung                                                 | Request                                                                 | Return                            |
|--------------------|--------|-------------|--------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------|
| :white_check_mark: | POST   | `/login`    | Loggt einen User ein                                         | body.username, body.password                                            | {token:"...", refreshToken:"..."} |
| :white_check_mark: | DELETE | `/logout`   | Loggt einen User aus                                         | auth.token (>> Refreshtoken)                                            | {}                                |
| :white_check_mark: | POST   | `/register` | Registriert einen neuen User                                 | body.firstname, body.lastname, body.username, body.password, body.email | {message} oder ApiError           |
| :white_check_mark: | POST   | `/token`    | Erstellung neuer Tokens unter Zuhilfenahme des Refresh Token | auth.token (>> RefreshToken)                                            | {token:"..."}                     |

## Richtlinien für Benutzerdaten

### Benutzername

- Benutzername muss mindestens 3 Zeichen lang sein
- Benutzername darf maximal 20 Zeichen lang sein
- Benutzername darf nur aus Buchstaben, Zahlen, Punkten, Bindestriche und Unterstrichen bestehen (a-zA-Z0-9_-.)
- Benutzername darf nicht mit einem Punkt, Bindestrich oder Unterstrich beginnen oder enden
- Benutzername darf nicht bereits vergeben sein
- Benutzername darf nicht leer sein

### Passwort

- Passwort muss mindestens 8 Zeichen lang sein
- Passwort darf maximal 20 Zeichen lang sein
- Passwort darf nur aus Buchstaben, Zahlen, Punkte, Bindestriche, Ausrufezeichen, Fragezeichen und Unterstrichen
  bestehen (a-zA-Z0-9_-.?!)

### Vorname / Nachname

- Vorname / Nachname darf maximal 20 Zeichen lang sein
- Vorname / Nachname darf nur aus Buchstaben, Bindestriche oder Spaces bestehen (a-zA-Z- )
- Vorname / Nachname darf nicht mit einem Bindestrich beginnen oder enden
- Vorname / Nachname darf nicht leer sein

## Fehler

Im Falle eines Fehlers wird eine Fehlermeldung im JSON Format zurückgegeben (ApiError Objekt).

```
{
    "errorCode": "Fehlercode",                    // z.B. "u-318" oder "u-321"
    "message":"Fehlermeldung",                    // z.B. "User already exists" oder "User not found"
    "relatedColumn":"Betroffene Spalte (DB)"      // z.B. "email" oder "username" (sofern nötig)
    "data":"Weiterführende Informationen"         // z.B. "Fehlermeldung der Datenbank"
}
```

## Übersicht der API Fehlercodes

### User related

- Error Code u-317: Form Validierungsfehler - Feld wurde nicht übermittelt (null / undefined)
- Error Code u-318: Form Validierungsfehler - Ungültige E-Mail Adresse
- Error Code u-319: Form Validierungsfehler - Ungültige Zeichenanzahl
- Error Code u-320: Form Validierungsfehler - Ungültige Zeichen
- Error Code u-321: Form Validierungsfehler - Verbotene Zeichenfolge
- Error Code u-322: Datenbankfehler - existiert bereits
- Error Code u-331: Loginfehler - User nicht gefunden
- Error Code u-332: Loginfehler - Passwort falsch
- Error Code u-341: Tokenfehler - Refresh Token nicht gefunden
- Error Code u-342: Tokenfehler - Refresh Token ist nicht valide

### Kategorien

- Error Code c-331: Kategoriefehler - Kategorie mit dieser ID existiert nicht
- Error Code c-318: Kategoriefehler - Kategorie ID fehlt
- Error Code c-322: Kategoriefehler - Kategorie existiert bereits
- Error Code c-331: Kategoriefehler - Kategorie mit dieser ID existiert nicht

### Fragen

- Error Code q-316: Fragenfehler - Fragetext Länge ungültig
- Error Code q-317: Fragenfehler - Fragetext darf nicht leer / zu kurz sein
- Error Code q-318: Fragenfehler - Kategorie ID fehlt
- Error Code q-331: Fragenfehler - Frage nicht gefunden

### Antworten

- Error Code a-316: Antwortfehler - Länge des Antworttexts ungültig
- Error Code a-316: Antwortfehler - Antworttext zu kurz oder leer

### Tags

- Error Code t-317: Tagfehler - Tag Titel fehlt
- Error Code t-318: Tagfehler - Tag ID fehlt
- Error Code t-322: Tagfehler - Tag existiert bereits
- Error Code t-331: Tagfehler - Tag nicht gefunden

### Generisch

- Error Code e-999: Allgemein - Ein Fehler ist aufgetreten, weitere Details im Serverlog
- Error Code e-100: Forbidden - Der User verfügt nicht über die entsprechende Berechtigung diese Aktion durchzuführen
- Error Code e-101: Authentication - Token invalid
