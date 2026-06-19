# Ablenkungsstudie – Eye-Tracking Web-App

Wissenschaftliches Studien-Tool zur Untersuchung von Ablenkungseffekten auf einem zweiten Bildschirm. Probanden lösen 18 Logikaufgaben auf einem Split-Screen, während rechts unterschiedliche Ablenkreize erscheinen (TikTok-Videos, Filmausschnitte, simuliertes iPhone mit Benachrichtigungen – jeweils mit/ohne Ton). Ein externes Eye-Tracking-System zeichnet Blickwechsel auf; diese App misst Antwortrichtigkeit, Antwortzeit und Kategorie.

## Inhaltsverzeichnis

- [Setup & Start](#setup--start)
- [Studienablauf](#studienablauf)
- [Kategorien](#kategorien)
- [Aufgaben](#aufgaben)
- [Datenexport](#datenexport)
- [Assets einbinden](#assets-einbinden)
- [Tech-Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Wichtige Implementierungsdetails](#wichtige-implementierungsdetails)
- [Anpassungen](#anpassungen)
- [Deployment auf GitHub Pages](#deployment-auf-github-pages)

## Setup & Start

```bash
npm install
npm run dev      # Dev-Server (http://localhost:5173)
npm run build    # Production-Build → dist/
npm run preview  # Production-Preview lokal
```

**Empfohlene Auflösung:** 1920 × 1080 (typisches Eye-Tracking-Setup). Der Task-Screen nutzt `100dvh` und ist exakt 50/50 geteilt – Scrollbars sind unterdrückt.

## Studienablauf

1. **Titelseite** – Erklärung der Studie, Auflistung der 6 Abschnitte und der Regeln. Klick auf „Studie starten" beginnt die Messung.
2. **18 Aufgaben** – aufgeteilt in 6 Abschnitte à 3 Aufgaben. Pro Abschnitt aufsteigende Schwierigkeit: leicht → mittel → schwer.
3. **Pro Aufgabe:**
   - 15 Sekunden Zeitlimit (Countdown-Ring unten; Farbe und Pulsieren signalisieren die verbleibende Zeit)
   - Eine von 5 Antwortoptionen (A–E) wählen
   - 1500 ms Feedback-Animation (✓ + Konfetti / ✗ + Shake / ⏱ Timeout)
   - **Bei abgelaufener Zeit wird automatisch weitergeschaltet** und die Antwort als „nicht beantwortet" gewertet
4. **Kategorie-Banner** – zwischen den Abschnitten kurze Slide-in-Anzeige (2 s) mit Abschnittsnummer.
5. **Auswertung** – Ergebnis pro Kategorie und pro Schwierigkeit, plus JSON-Export aller Antworten.

## Kategorien

Fest definiert in [src/data/categories.ts](src/data/categories.ts):

| #  | Label                  | Video | Ton | Rechtes Panel                        |
|----|------------------------|-------|-----|--------------------------------------|
| 01 | Nur Aufgaben           | –     | –   | Leer                                 |
| 02 | TikTok – ohne Ton      | ✓     | –   | Video                                |
| 03 | TikTok – mit Ton       | ✓     | ✓   | Video mit Ton                        |
| 04 | Film – ohne Ton        | ✓     | –   | Video                                |
| 05 | Film – mit Ton         | ✓     | ✓   | Video mit Ton                        |
| 06 | iPhone                 | –     | ✓   | Simuliertes iPhone mit Benachrichtigung |

Reihenfolge ist fix, damit alle Probanden identische Bedingungen haben.

### iPhone-Kategorie

Die iPhone-Kategorie zeigt einen skalierten, animierten iPhone-15-Pro-Rahmen (Dynamic Island, Statusleiste, Seitenknöpfe). Das angezeigte Szenario variiert je nach Schwierigkeit:

| Schwierigkeit | Szenario                                             | Ton                       |
|---------------|------------------------------------------------------|---------------------------|
| Leicht        | **Sperrbildschirm** – Teams-Benachrichtigungen erscheinen nacheinander | Notification-Sound        |
| Mittel        | **iMessage-Verlauf** – Nachrichten erscheinen im Chat | iPhone-Nachrichtenton     |
| Schwer        | **Anrufbildschirm** – eingehender Teams-Anruf klingelt | Teams-Klingelton          |

## Aufgaben

18 **unterschiedliche** Multiplikations- und Logikaufgaben in [src/data/questions.ts](src/data/questions.ts) – kein Item wiederholt sich. Jede Kategorie bekommt 1 Aufgabe pro Schwierigkeitsstufe:

- **Easy** (einfache Multiplikation): Einmaleins, zweistellige Faktoren
- **Medium** (mittlere Multiplikation): Dreistellige Faktoren, Kopfrechenaufgaben
- **Hard** (anspruchsvolle Multiplikation): Komplexere Rechenoperationen, höhere Zahlen

Jede Aufgabe ist als `Question` typisiert (Typdefinition in [src/types.ts](src/types.ts)) und enthält genau 5 Optionen sowie einen `correctIndex`.

## Datenexport

Auf der Auswertungsseite kopiert „Daten kopieren (JSON)" alle Antworten ins Clipboard. Format:

```json
[
  {
    "questionId": "e1_mult_8x7",
    "category": "no_distraction",
    "difficulty": "easy",
    "selectedIndex": 1,
    "correct": true,
    "timeSpent": 4.7
  }
]
```

- `selectedIndex` = `null` bei Timeout
- `timeSpent` in Sekunden, max. 15
- Es wird kein localStorage / sessionStorage / Backend genutzt – nach „Neu starten" sind die Daten gelöscht. Daten also vor Neustart exportieren.

Fallback: Falls `navigator.clipboard` nicht verfügbar ist, wird `document.execCommand('copy')` benutzt.

## Assets einbinden

### Videos

Videos werden lokal aus [public/videos/](public/videos/) geladen. Pro Schwierigkeitsgrad (easy/medium/hard) wird eine eigene Datei verwendet – Index 0 = easy, 1 = medium, 2 = hard:

```
public/videos/
├── tiktok-1.mov   # easy
├── tiktok-2.mov   # medium
├── tiktok-3.mov   # hard
├── movie-1.mov    # easy
├── movie-2.mov    # medium
└── movie-3.mov    # hard
```

Empfehlungen:
- H.264 in `.mov`-Container, max. ~1080p, max. ~10 MB pro Datei
- Länge ≥ 1 Minute (Videos werden geloopt; pro Aufgabe ≈ 15 s aktiv)
- Inhaltlich realistisch und ablenkend (keine Stille-Cuts, keine Schwarzbilder)

**Fehlt eine Datei**, zeigt das Video-Panel statt eines Crashes einen neutralen Platzhalter – die Studie läuft trotzdem durch.

### Sounds (iPhone-Kategorie)

Sounddateien liegen in [public/sounds/](public/sounds/):

```
public/sounds/
├── Notification_Teams.mov       # Benachrichtigungston (LockScreen)
├── Notification_iPhone.mov      # Nachrichtenton (MessagesApp)
├── Notification_iPhone_2.mov    # Zweiter Nachrichtenton (MessagesApp)
├── Notification_Teams_Anruf.mov # Klingelton (CallScreen)
└── Sound_Check_Song.mov         # Optionaler Sound-Check vor der Studie
```

## Tech-Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Framer Motion** für Screen-Übergänge, Banner, Feedback-Animationen, Konfetti
- **Lucide React** für Icons
- Kein Backend, kein localStorage, kein sessionStorage – komplett State-basiert

## Projektstruktur

```
eye-tracking-study/
├── public/
│   ├── videos/             # .mov-Videodateien (tiktok-1–3, movie-1–3)
│   └── sounds/             # .mov-Sounddateien für iPhone-Benachrichtigungen
├── src/
│   ├── main.tsx            # Einstiegspunkt
│   ├── App.tsx             # Screen-Router (title / task / result), Antwort-Logik
│   ├── types.ts            # Question, Answer, CategoryConfig, NotificationType, …
│   ├── utils/
│   │   └── assetUrl.ts     # Hilfsfunktion für GitHub-Pages-kompatible Asset-Pfade
│   ├── data/
│   │   ├── categories.ts   # 6 Kategorien (fixe Reihenfolge)
│   │   └── questions.ts    # 18 Aufgaben + buildQuestionSequence()
│   ├── components/
│   │   ├── TitleScreen.tsx     # Erklärung der Regeln + 6 Abschnitte
│   │   ├── CategoryBanner.tsx  # Slide-in zwischen Abschnitten (Abschnittsnummer)
│   │   ├── TaskScreen.tsx      # 50/50 Split-Screen, Antwortbuttons, Panel-Auswahl
│   │   ├── Timer.tsx           # SVG-Countdown-Ring 15 → 0 s
│   │   ├── ProgressBar.tsx     # Frage X / 18
│   │   ├── VideoPanel.tsx      # Video oder leeres Panel oder Fehler-Placeholder
│   │   ├── IPhonePanel.tsx     # Simuliertes iPhone-15-Pro-Frame (skaliert per ResizeObserver)
│   │   ├── iphone/
│   │   │   ├── LockScreen.tsx  # Sperrbildschirm mit Teams-Benachrichtigungen
│   │   │   ├── MessagesApp.tsx # iMessage-Verlauf mit eingehenden Nachrichten
│   │   │   └── CallScreen.tsx  # Eingehender Teams-Anruf mit Klingelton
│   │   ├── AnswerFeedback.tsx  # ✓ Konfetti / ✗ Shake / ⏱ Timeout
│   │   └── ResultScreen.tsx    # Auswertung + JSON-Export
│   └── styles/
│       └── index.css       # Design-Tokens + Tailwind-Import
└── index.html
```

## Wichtige Implementierungsdetails

- **Panel-Auswahl:** `TaskScreen` prüft, ob die Kategorie `notificationTypes` enthält – wenn ja, wird `IPhonePanel` gerendert, sonst `VideoPanel`.
- **Video-per-Schwierigkeit:** `videoSrcs[idx]` mapped `easy → 0`, `medium → 1`, `hard → 2` auf verschiedene Videodateien. So sieht jede Aufgabe ein anderes Clip-Segment.
- **IPhonePanel-Skalierung:** `ResizeObserver` berechnet einen CSS-`scale`-Faktor, damit das Gerät immer vollständig in das rechte Panel passt (Basisgröße: 390 × 844 + 14 px Rahmen).
- **Auto-Advance bei Timeout:** Der Timer fired über einen `useRef`-Wrapper exakt einmal `onTimeout()`, das die Aufgabe mit `selectedIndex = null` einreicht.
- **Timer-Reset:** Über `<Timer key={question.id + category.type} … />` wird der Timer bei jedem Frage-Wechsel komplett neu montiert.
- **Feedback-Timing:** 1500 ms Feedback → bei Kategoriewechsel zusätzliche 200 ms Pause → 2000 ms Banner → nächste Aufgabe.
- **Banner-Trigger:** Genau wenn `nextIndex % QUESTIONS_PER_CATEGORY === 0` – der erste Banner erscheint also zwischen Aufgabe 3 und 4.
- **Performance:** `VideoPanel` und `AnswerFeedback` sind via `React.memo` stabilisiert.
- **Accessibility:** Antwortbuttons mit `aria-label="Antwort A: …"`, Timer mit `role="timer"` + `aria-live="polite"`, Feedback mit `role="status"` + `aria-live="assertive"`. `prefers-reduced-motion` reduziert Animationen.

## Anpassungen

| Aufgabe                              | Stelle                                            |
|--------------------------------------|---------------------------------------------------|
| Andere Aufgaben verwenden            | [src/data/questions.ts](src/data/questions.ts) – Arrays `EASY_QUESTIONS`/`MEDIUM_QUESTIONS`/`HARD_QUESTIONS` (jeweils 6 Items) |
| Kategorien ändern / hinzufügen       | [src/data/categories.ts](src/data/categories.ts) – Anzahl muss mit Aufgaben pro Schwierigkeit übereinstimmen, sonst wirft `buildQuestionSequence` einen Fehler |
| Zeitlimit pro Aufgabe                | `TIME_LIMIT` in [src/components/TaskScreen.tsx](src/components/TaskScreen.tsx) |
| Feedback-Dauer                       | `FEEDBACK_DURATION` in [src/components/TaskScreen.tsx](src/components/TaskScreen.tsx) |
| Banner-Dauer                         | `BANNER_DURATION` in [src/App.tsx](src/App.tsx) |
| iPhone-Benachrichtigungstypen        | `notificationTypes` in [src/data/categories.ts](src/data/categories.ts) |
| Farb- und Typo-Tokens                | `:root`-Block in [src/styles/index.css](src/styles/index.css) |

## Lizenz / Hinweis

Interne Verwendung für die wissenschaftliche Studie. Vor dem Einsatz mit Probanden bitte Pilotdurchläufe machen und Videos, Sounds sowie das iPhone-Animationstiming auf Ladezeiten und Loop-Verhalten testen.

## Deployment auf GitHub Pages

Das Projekt ist für **GitHub Pages mit GitHub Actions** vorkonfiguriert. Es gibt **keinen** separaten `gh-pages`-Branch – der Workflow baut bei jedem Push auf `main` und published direkt.

### Einmalige Einrichtung

1. Repo auf GitHub anlegen, Name: **`Eye-Tracking-Website`** (Groß-/Kleinschreibung muss zur `base` in [vite.config.ts](vite.config.ts) passen).
2. In den Repo-**Settings → Pages**:
   - **Source:** *GitHub Actions*
3. Push auf `main` – der Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) startet automatisch und published nach ~1–2 Minuten unter:
   ```
   https://USERNAME.github.io/Eye-Tracking-Website/
   ```

### Workflow

- Trigger: Push auf `main` oder manuell über *Actions → Deploy to GitHub Pages → Run workflow*.
- Build-Verzeichnis: `dist/`.
- Deployment via `actions/deploy-pages@v4` ins `github-pages`-Environment – die URL erscheint im Action-Run.

### Anderer Repo-Name

Falls der Repo anders heißt, müssen `base` in [vite.config.ts](vite.config.ts) und der Pfad in der URL angepasst werden:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/MEIN-REPO-NAME/',
});
```

Bei einem **User-Site-Repo** (`USERNAME.github.io`) oder einer **eigenen Domain** stattdessen `base: '/'` setzen.

### Videos & Sounds beim Deployment

Videos (`public/videos/`) und Sounds (`public/sounds/`) werden mit deployed. Bei großen Dateien lohnt es sich, mit Git LFS zu arbeiten oder die Assets außerhalb des Repos (z. B. CDN) zu hosten und in [src/data/categories.ts](src/data/categories.ts) bzw. [src/components/iphone/](src/components/iphone/) absolute URLs zu setzen.
