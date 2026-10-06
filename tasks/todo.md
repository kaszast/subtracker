# Subscription Manager - Teendők

- [x] Követelmények és architektúra tisztázása (Grill-me)
- [x] Rendszerspecifikáció rögzítése (`tasks/spec.md`)
- [x] Csomagfüggőségek jóváhagyatása és projekt inicializálás
- [x] SQLite adatmodell és backend adatbázis réteg kialakítása
- [x] Preset katalógus kidolgozása (40+ szolgáltatás ikonnal, színnel, alapértelmezett adatokkal)
- [x] CRUD API és üzleti logika (valuta konverzió, havi számítások, értesítések)
- [x] 10 modern dizájn téma CSS változók és ThemeProvider implementációja
- [x] UI Komponensek és Főoldal Dashboard (Összesítők, Gyorsműveletek)
- [x] Előfizetés kezelő űrlapok (Kézi felvitel + Preset választó)
- [x] Naptár nézet megvalósítása (Havi rács, esedékességi események)
- [x] Statisztikák, diagramok és pénzügyi elemzések (Recharts)
- [x] Professzionális PDF kimutatás generáló (jsPDF + autotable)
- [x] Adat Export és Import (JSON biztonsági mentés / visszaállítás + CSV)
- [x] Multi-stage Dockerfile és docker-compose.yml konfiguráció
- [x] Működés validálása és tesztelése Dockerben és helyben

## V2 Fejlesztések (Történeti adatok, Archiválás, PWA, Logók)
- [x] Adatbázis séma frissítése (status, domain oszlopok a subscriptions táblában, price_history tábla)
- [x] Ártörténet logika (beszúrás létrehozáskor és módosításkor) és API endpoint (`/api/subscriptions/[id]/history`)
- [x] Presets frissítése `domain` adattal
- [x] UI: Logók megjelenítése a `ServiceIcon` komponensben (Clearbit API), egységes méretezéssel (fallback: meglévő Lucide ikonok)
- [x] UI: Archiválás funkció (Gomb a módosító/törlő mellett, új tab a listában)
- [x] UI: Ártörténet vizualizáció az előfizetés részleteinél
- [x] PWA: manifest.json, sw.js, és ikonok generálása/bekötése
- [x] Validáció (Tesztek futtatása)
