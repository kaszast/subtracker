# Tanulságok és minták (Lessons Learned)

- [2026-10-05/CSS] Tailwind CSS változóknál HEX értékek esetén az opacity utility-k (/50, /40) érvénytelen CSS-t eredményeznek, ami natív fehér háttérhez vezet -> Form inputoknál kötelező a tiszta háttérosztály és explicit globális input/select stílusok alkalmazása.
- [2026-10-05/PDF] A jsPDF alapértelmezett standard fontjai (Helvetica) WinAnsi kódolásúak és nem tartalmazzák az 'ő'/'ű' karaktereket ('Q'-ként renderelődnek) -> Kötelező ékezet-normalizáló függvényt (cleanText) alkalmazni a PDF szövegmezőkre.
