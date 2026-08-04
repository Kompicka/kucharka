const CATEGORY_LABELS = {
  polevky: "Polévky",
  papinak: "Papiňák",
  trouba: "Do trouby",
  asie: "Asie",
  testoviny: "Těstoviny",
  ryby: "Ryby",
  ostatni: "Ostatní",
};

const REPO = "Kompicka/kucharka";
const DATA_FILE = "recipes.json";

let RECIPES = [];
let activeCategory = "all";

const grid = document.getElementById("grid");
const emptyMsg = document.getElementById("empty");
const searchInput = document.getElementById("search");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

function cardMedia(r) {
  return r.image
    ? `<img class="card-img" src="${r.image}" alt="${r.name}" loading="lazy">`
    : `<div class="card-emoji">${r.emoji}</div>`;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = RECIPES.filter((r) => {
    const inCategory = activeCategory === "all" || r.category === activeCategory;
    const matches =
      !query ||
      r.name.toLowerCase().includes(query) ||
      (r.ingredients ?? []).some((i) => i.toLowerCase().includes(query));
    return inCategory && matches;
  });

  grid.innerHTML = visible
    .map(
      (r) => `
      <article class="card" data-id="${r.id}">
        ${cardMedia(r)}
        <div class="card-body">
          <span class="card-tag">${CATEGORY_LABELS[r.category] ?? r.category}</span>
          <h2 class="card-title">${r.name}</h2>
          <p class="card-desc">${r.desc ?? ""}</p>
          <div class="card-meta">
            ${r.time ? `<span>⏱ ${r.time}</span>` : ""}
            ${r.servings ? `<span>🍽 ${r.servings}</span>` : ""}
          </div>
        </div>
      </article>`
    )
    .join("");

  emptyMsg.hidden = visible.length > 0;
}

/* ===== Přepočet porcí ===== */

const UNI_FRACTIONS = { "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75, "⅕": 0.2, "⅛": 0.125 };
const NUM_RE = /(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?|[½⅓⅔¼¾⅕⅛])/g;

function parseNum(tok) {
  if (UNI_FRACTIONS[tok] != null) return UNI_FRACTIONS[tok];
  if (tok.includes("/")) {
    const parts = tok.split(/\s+/);
    let whole = 0, frac = parts.length === 2 ? parts[1] : parts[0];
    if (parts.length === 2) whole = parseFloat(parts[0]);
    const [a, b] = frac.split("/").map(Number);
    return whole + a / b;
  }
  return parseFloat(tok.replace(",", "."));
}

function fmtNum(x) {
  const fracs = [[0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"], [2 / 3, "⅔"], [0.75, "¾"]];
  const whole = Math.floor(x + 1e-9);
  const rest = x - whole;
  for (const [v, sym] of fracs) {
    if (Math.abs(rest - v) < 0.02) return whole ? `${whole} ${sym}` : sym;
  }
  if (Math.abs(rest) < 0.02 || Math.abs(rest - 1) < 0.02) return String(Math.round(x));
  return String(Math.round(x * 100) / 100).replace(".", ",");
}

function scaleText(text, factor) {
  if (factor === 1) return text;
  return text.replace(NUM_RE, (tok) => fmtNum(parseNum(tok) * factor));
}

function porceLabel(n, unitWord) {
  if (/porc/i.test(unitWord)) {
    if (n === 1) return "1 porce";
    if (n >= 2 && n <= 4) return `${n} porce`;
    return `${n} porcí`;
  }
  return `${n} ${unitWord}`.trim();
}

let servState = null; // { base, current, unitWord, multiplierMode }

function initServings(r) {
  const m = (r.servings ?? "").match(/\d+/);
  if (m) {
    const base = parseInt(m[0], 10);
    const unitWord = r.servings.replace(/[\d\s]+/, "").trim() || "porcí";
    servState = { base, current: base, unitWord, multiplierMode: false };
  } else {
    servState = { base: 1, current: 1, unitWord: "×", multiplierMode: true };
  }
}

function servingsFactor() {
  return servState.current / servState.base;
}

function servingsLabel() {
  return servState.multiplierMode ? `${servState.current}×` : porceLabel(servState.current, servState.unitWord);
}

function renderIngredients(r) {
  const f = servingsFactor();
  return r.ingredients.map((i) => `<li>${scaleText(i, f)}</li>`).join("");
}

function updateServingsUI(r) {
  document.getElementById("servLabel").textContent = servingsLabel();
  document.getElementById("ingList").innerHTML = renderIngredients(r);
  const label = document.getElementById("servLabel");
  label.classList.toggle("scaled", servingsFactor() !== 1);
}

function openRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;
  initServings(r);

  modalBody.innerHTML = `
    ${r.image ? `<img class="modal-img" src="${r.image}" alt="${r.name}">` : `<div class="modal-emoji">${r.emoji}</div>`}
    <h2 class="modal-title">${r.name}</h2>
    <p class="modal-desc">${r.desc ?? ""}</p>
    <div class="modal-meta">
      <span>📂 ${CATEGORY_LABELS[r.category] ?? r.category}</span>
      ${r.time ? `<span>⏱ ${r.time}</span>` : ""}
      ${r.servings ? `<span>🍽 ${r.servings}</span>` : ""}
    </div>
    ${
      r.ingredients?.length
        ? `<div class="ing-header">
             <h3>Suroviny</h3>
             <div class="servings-ctl">
               <button id="servMinus" aria-label="Méně porcí">−</button>
               <span id="servLabel">${servingsLabel()}</span>
               <button id="servPlus" aria-label="Více porcí">+</button>
             </div>
           </div>
           <ul id="ingList">${renderIngredients(r)}</ul>`
        : ""
    }
    ${
      r.steps?.length
        ? `<h3>Postup</h3><ol>${r.steps.map((s) => `<li>${s}</li>`).join("")}</ol>`
        : ""
    }
    <div class="modal-actions">
      ${r.source ? `<a class="btn-source" href="${r.source}" target="_blank" rel="noopener">Původní recept ↗</a>` : ""}
      <button class="btn-delete" data-id="${r.id}">🗑 Smazat recept</button>
    </div>
  `;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const minus = document.getElementById("servMinus");
  const plus = document.getElementById("servPlus");
  if (minus && plus) {
    minus.addEventListener("click", () => {
      if (servState.current > 1) { servState.current--; updateServingsUI(r); }
    });
    plus.addEventListener("click", () => {
      if (servState.current < 99) { servState.current++; updateServingsUI(r); }
    });
  }
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

/* ===== Mazání přes GitHub API ===== */

function getToken() {
  let token = localStorage.getItem("gh_token");
  if (!token) {
    token = prompt(
      "Pro mazání receptů je potřeba GitHub token (zadává se jen jednou).\n\n" +
        "1. Otevři: github.com → Settings → Developer settings → Fine-grained tokens → Generate new token\n" +
        "2. Repository access: Only select repositories → kucharka\n" +
        "3. Permissions → Contents: Read and write\n" +
        "4. Vygenerovaný token vlož sem:"
    );
    if (token) localStorage.setItem("gh_token", token.trim());
  }
  return token ? token.trim() : null;
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function ghRequest(path, options = {}, token) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("gh_token");
    throw new Error("Token je neplatný nebo nemá oprávnění — zkus to znovu, zeptá se tě na nový.");
  }
  if (!res.ok && res.status !== 404) {
    throw new Error(`GitHub API: ${res.status}`);
  }
  return res;
}

async function deleteRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;
  if (!confirm(`Opravdu smazat „${r.name}"? Smaže se přímo z webu.`)) return;

  const token = getToken();
  if (!token) return;

  const btn = document.querySelector(".btn-delete");
  if (btn) { btn.disabled = true; btn.textContent = "Mažu…"; }

  try {
    // update recipes.json
    const cur = await ghRequest(DATA_FILE, {}, token);
    const meta = await cur.json();
    const updated = RECIPES.filter((x) => x.id !== id);
    await ghRequest(DATA_FILE, {
      method: "PUT",
      body: JSON.stringify({
        message: `Smazat recept: ${r.name}`,
        content: toBase64(JSON.stringify(updated, null, 2)),
        sha: meta.sha,
      }),
    }, token);

    // best-effort: delete its image too
    if (r.image) {
      try {
        const imgRes = await ghRequest(r.image, {}, token);
        if (imgRes.ok) {
          const imgMeta = await imgRes.json();
          await ghRequest(r.image, {
            method: "DELETE",
            body: JSON.stringify({ message: `Smazat obrázek: ${r.name}`, sha: imgMeta.sha }),
          }, token);
        }
      } catch (_) { /* obrázek nevadí */ }
    }

    RECIPES = updated;
    closeModal();
    render();
    showToast(`„${r.name}" smazáno. Web se přegeneruje během minuty.`);
  } catch (e) {
    alert("Smazání se nepovedlo: " + e.message);
    if (btn) { btn.disabled = false; btn.textContent = "🗑 Smazat recept"; }
  }
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

/* ===== Události ===== */

document.getElementById("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  activeCategory = tab.dataset.category;
  render();
});

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openRecipe(card.dataset.id);
});

modalBody.addEventListener("click", (e) => {
  const del = e.target.closest(".btn-delete");
  if (del) deleteRecipe(del.dataset.id);
});

document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

searchInput.addEventListener("input", render);

document.getElementById("year").textContent = new Date().getFullYear();

fetch(DATA_FILE + "?v=" + Date.now())
  .then((res) => res.json())
  .then((data) => {
    RECIPES = data;
    render();
  })
  .catch(() => {
    emptyMsg.textContent = "Recepty se nepodařilo načíst. 😕";
    emptyMsg.hidden = false;
  });
