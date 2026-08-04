const CATEGORY_LABELS = {
  papinak: "Papiňák",
  trouba: "Do trouby",
  asie: "Asie",
  testoviny: "Těstoviny",
  ostatni: "Ostatní",
};

const grid = document.getElementById("grid");
const emptyMsg = document.getElementById("empty");
const searchInput = document.getElementById("search");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

let activeCategory = "all";

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = RECIPES.filter((r) => {
    const inCategory = activeCategory === "all" || r.category === activeCategory;
    const matches =
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.ingredients.some((i) => i.toLowerCase().includes(query));
    return inCategory && matches;
  });

  grid.innerHTML = visible
    .map(
      (r) => `
      <article class="card" data-id="${r.id}">
        <div class="card-emoji">${r.emoji}</div>
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

function openRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;

  modalBody.innerHTML = `
    <div class="modal-emoji">${r.emoji}</div>
    <h2 class="modal-title">${r.name}</h2>
    <p class="modal-desc">${r.desc ?? ""}</p>
    <div class="modal-meta">
      <span>📂 ${CATEGORY_LABELS[r.category] ?? r.category}</span>
      ${r.time ? `<span>⏱ ${r.time}</span>` : ""}
      ${r.servings ? `<span>🍽 ${r.servings}</span>` : ""}
    </div>
    <h3>Suroviny</h3>
    <ul>${r.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <h3>Postup</h3>
    <ol>${r.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
  `;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

// Záložky
document.getElementById("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  activeCategory = tab.dataset.category;
  render();
});

// Karty
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openRecipe(card.dataset.id);
});

// Modal
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// Hledání
searchInput.addEventListener("input", render);

document.getElementById("year").textContent = new Date().getFullYear();

render();
