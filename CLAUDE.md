# Kuchařka pro Zůníky — pravidla

Osobní kuchařka na GitHub Pages: https://kompicka.github.io/kucharka/ (repo Kompicka/kucharka, branch main, root).

## Struktura

- `recipes.json` — všechna data receptů (pole objektů), načítá je `app.js`
- `images/<id>.jpg` — fotka receptu, zmenšená na max 720 px, JPEG quality ~78
- Mazání z webu: tlačítko v detailu commituje přes GitHub API (fine-grained PAT v localStorage)

## Pravidla kategorií (priorita shora dolů)

1. Těstovinové jídlo → `testoviny` (i s mořskými plody — krevety na špagetách jsou pasta)
2. Ryba jako hlavní surovina → `ryby` (bez ohledu na způsob přípravy)
3. Asijská kuchyně → `asie`
4. Tlakový hrnec (papiňák / Instant Pot) → `papinak`
5. Pečené v troubě → `trouba`
6. Ostatní → `ostatni`

Když je zařazení nejednoznačné, zeptat se uživatele — nehádat.

## Pravidlo obrázků

Každý recept má mít fotku. Když ji zdrojová stránka nemá, najít ilustrační fotku na internetu (preferovat Wikipedii/Wikimedia — volné licence), zmenšit a uložit do `images/`.

## Workflow

Po každé změně: commit + push (Pages se přegeneruje samo, ~1 min). Před pushem `git pull --rebase` — uživatel maže recepty přímo z webu, takže remote může být napřed.
