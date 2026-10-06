# Rendszerspecifikáció: Subscription Manager Web Alkalmazás

## 1. Cél és Architektúra
- **Típus:** Monolitikus modern webalkalmazás, önálló Docker konténerbe csomagolva.
- **Tech Stack:**
  - Frontend & Backend: Next.js 15 (App Router, React 19, TypeScript)
  - Stílus & UI: Tailwind CSS v4, Lucide React ikonok
  - Adattárolás: SQLite helyi adatbázis (better-sqlite3 vagy sql.js / drizzle) volume perzisztenciával (`/data/subscriptions.db`)
  - Diagramok: Recharts / Chart.js
  - PDF export: jspdf + jspdf-autotable (ügyféldisztributált, stabil, stílusos vektoros PDF kimutatás)
  - Konténerizáció: Multi-stage Dockerfile (Node Alpine), `docker-compose.yml`

## 2. Funkcionális Követelmények
1. **Előfizetések kezelése:**
   - Kézi felvitel (név, összeg, deviza: HUF/EUR/USD, ciklus: havi/éves/negyedéves/egyedi, következő levonási dátum, kategória, leírás, fizetési mód, státusz: aktív/szüneteltetve/lemondva, próbaidőszak jelölés).
   - Preset katalógus (40+ népszerű szolgáltatás: Netflix, YouTube Premium, Spotify, Apple TV+, Disney+, HBO Max, ChatGPT Plus, Claude Pro, Google AI / One, GitHub Copilot, Amazon Prime, Adobe, Canva, stb. logóval/színnel/alapértelmezett kategóriával).
   - Szerkesztés, törlés, státuszváltás (aktív/inaktív).
2. **Költség összesítő & Pénzügyi modul:**
   - Havi és éves összesített kiadás valós időben számolva.
   - Bázisdeviza konverzió (HUF / EUR / USD) beállítható vagy automatikus árfolyammal.
   - Napi átlagos költés és lejárati riasztások (pl. következő 7 napban esedékes levonások).
3. **Naptár nézet:**
   - Interaktív havi és heti naptár rács, ahol látható az adott napokon esedékes előfizetések összege és ikonja.
   - Rákattintva részletes adatlap, gyors szerkesztés.
4. **Statisztikák & Elemzések:**
   - Kategória szerinti bontás (pie / doughnut chart).
   - Havi idővonal költési trendek.
   - Szolgáltatás típusok és fizetési módok szerinti megoszlás.
5. **PDF Kimutatás letöltése:**
   - Professzionális A4-es pénzügyi jelentés (összesítő kártyák, kategória bontás, részletes előfizetési táblázat, esedékességi lista).
6. **Backup & Restore (Adat Export / Import):**
   - Teljes JSON export (minden beállítás, előfizetés, előzmény).
   - JSON visszaállítás validációval és felülírási/összefésülési védelemmel.
   - CSV export táblázatkezelőkhöz (Excel, Google Sheets).
7. **10 Beépített Dizájn Téma (nem túlzó, profi):**
   1. `obsidian` - Obsidian Slate (Alapértelmezett sötét, elegáns grafitszürke)
   2. `porcelain` - Minimal Porcelain (Világos, letisztult prémium editorial stílus)
   3. `nord` - Nord Frost (Sarkvidéki kékesszürke és jégkék)
   4. `tokyo` - Tokyo Night (Mély éjszakai kék, diszkrét levendula kiemeléssel)
   5. `catppuccin` - Catppuccin Mocha (Bársonyos sötét, meleg pasztell)
   6. `forest` - Emerald Forest (Mély erdőzöld, organikus smaragd)
   7. `monochrome` - Swiss Monochrome (Szigorú fekete-fehér minimalizmus)
   8. `solarized` - Solarized Dark (Klasszikus borostyán és cián tónusok)
   9. `sand` - Warm Sand (Meleg pergamen és terrakotta világos téma)
   10. `indigo` - Midnight Indigo (Fintech mélykék és diszkrét kobalt)
   - Valós idejű azonnali témaváltás a felületen a `data-theme` HTML attribútumon és CSS változókon keresztül, a kiválasztott téma perzisztálásával (`localStorage`).

## 3. Adatmodell (SQLite Schema)
- `subscriptions`:
  - `id` (TEXT PRIMARY KEY / UUID)
  - `name` (TEXT NOT NULL)
  - `amount` (REAL NOT NULL)
  - `currency` (TEXT DEFAULT 'HUF')
  - `billing_cycle` (TEXT NOT NULL: 'monthly', 'yearly', 'quarterly', 'weekly')
  - `next_billing_date` (TEXT NOT NULL: ISO YYYY-MM-DD)
  - `category` (TEXT NOT NULL)
  - `payment_method` (TEXT)
  - `is_active` (INTEGER DEFAULT 1)
  - `is_trial` (INTEGER DEFAULT 0)
  - `trial_end_date` (TEXT)
  - `notes` (TEXT)
  - `icon` (TEXT)
  - `color` (TEXT)
  - `created_at` (TEXT)
  - `updated_at` (TEXT)
- `settings`:
  - `key` (TEXT PRIMARY KEY)
  - `value` (TEXT)
