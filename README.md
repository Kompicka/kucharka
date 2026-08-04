# 🍳 Kuchařka pro Zůníky

Osobní sbírka oblíbených receptů.

**Kategorie:** Papiňák · Do trouby · Asie · Těstoviny · Ryby · Ostatní

## Jak přidat recept

Otevři `recipes.json` a přidej nový objekt do seznamu:

```json
{
  "id": "unikatni-nazev",
  "name": "Název receptu",
  "category": "papinak",
  "emoji": "🍲",
  "desc": "Krátký popis.",
  "time": "45 min",
  "servings": "4 porce",
  "ingredients": ["surovina 1", "surovina 2"],
  "steps": ["krok 1", "krok 2"],
  "image": "images/unikatni-nazev.jpg",
  "source": "https://..."
}
```

Kategorie: `papinak` | `trouba` | `asie` | `testoviny` | `ryby` | `ostatni`. Obrázek (volitelný) patří do složky `images/`.

## Mazání z webu

Tlačítko „Smazat recept" v detailu receptu maže přímo přes GitHub API — při prvním použití si vyžádá fine-grained token (Contents: Read and write, jen pro tento repozitář).

Web běží na GitHub Pages — po pushnutí změn se sám aktualizuje.
