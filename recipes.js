// ============================================================
// RECEPTY — každý recept je jeden objekt v tomto seznamu.
// Kategorie: "papinak" | "trouba" | "asie" | "testoviny" | "ostatni"
// ============================================================

const RECIPES = [
  {
    id: "gulas-z-papinaku",
    name: "Guláš z papiňáku",
    category: "papinak",
    emoji: "🍲",
    desc: "Ukázkový recept — pošli mi své recepty a nahradím je.",
    time: "45 min",
    servings: "4 porce",
    ingredients: [
      "600 g hovězí kližky",
      "3 velké cibule",
      "2 lžíce sladké papriky",
      "2 stroužky česneku",
      "sůl, pepř, majoránka",
    ],
    steps: [
      "Cibuli osmahni dozlatova na sádle.",
      "Přidej maso a opeč ze všech stran.",
      "Zasyp paprikou, zalij vodou a zavři papiňák.",
      "Vař 30 minut od syčení, nech odtlakovat.",
      "Dochuť česnekem, majoránkou, solí a pepřem.",
    ],
  },
  {
    id: "kure-do-trouby",
    name: "Pečené kuře",
    category: "trouba",
    emoji: "🍗",
    desc: "Ukázkový recept — pošli mi své recepty a nahradím je.",
    time: "90 min",
    servings: "4 porce",
    ingredients: ["1 celé kuře", "máslo", "sůl, pepř, paprika"],
    steps: [
      "Kuře osol, opepři a potři máslem.",
      "Peč v troubě na 180 °C asi 80 minut.",
      "Průběžně přelévej výpekem.",
    ],
  },
  {
    id: "kureci-nudle-asie",
    name: "Kuřecí nudle po asijsku",
    category: "asie",
    emoji: "🍜",
    desc: "Ukázkový recept — pošli mi své recepty a nahradím je.",
    time: "25 min",
    servings: "2 porce",
    ingredients: ["kuřecí prsa", "rýžové nudle", "sójová omáčka", "zelenina"],
    steps: [
      "Nudle uvař podle návodu.",
      "Maso a zeleninu orestuj ve woku.",
      "Smíchej s nudlemi a sójovkou.",
    ],
  },
  {
    id: "spagety-aglio-olio",
    name: "Špagety aglio e olio",
    category: "testoviny",
    emoji: "🍝",
    desc: "Ukázkový recept — pošli mi své recepty a nahradím je.",
    time: "20 min",
    servings: "2 porce",
    ingredients: ["250 g špaget", "4 stroužky česneku", "olivový olej", "chilli", "petržel"],
    steps: [
      "Špagety uvař al dente.",
      "Na oleji zpěň plátky česneku s chilli.",
      "Vmíchej špagety s trochou vody z těstovin, posyp petrželí.",
    ],
  },
  {
    id: "palacinky",
    name: "Palačinky",
    category: "ostatni",
    emoji: "🥞",
    desc: "Ukázkový recept — pošli mi své recepty a nahradím je.",
    time: "30 min",
    servings: "10 ks",
    ingredients: ["250 g hladké mouky", "500 ml mléka", "2 vejce", "špetka soli"],
    steps: [
      "Vyšlehej těsto a nech 15 minut odpočinout.",
      "Smaž tenké palačinky na pánvi.",
      "Podávej s marmeládou nebo tvarohem.",
    ],
  },
];
