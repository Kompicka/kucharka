# 🍳 Moje kuchařka

Osobní sbírka oblíbených receptů.

**Kategorie:** Papiňák · Do trouby · Asie · Těstoviny · Ostatní

## Jak přidat recept

Otevři `recipes.js` a přidej nový objekt do seznamu `RECIPES`:

```js
{
  id: "unikatni-nazev",
  name: "Název receptu",
  category: "papinak", // papinak | trouba | asie | testoviny | ostatni
  emoji: "🍲",
  desc: "Krátký popis.",
  time: "45 min",
  servings: "4 porce",
  ingredients: ["surovina 1", "surovina 2"],
  steps: ["krok 1", "krok 2"],
},
```

Web běží na GitHub Pages — po pushnutí změn se sám aktualizuje.
