const PAGE_SIZE = 8;
const state = { brand: "Tutte", category: "Tutte", query: "", sort: "default", shown: PAGE_SIZE, cart: [], wish: [] };

const $ = (id) => document.getElementById(id);
const fmt = (n) => CONFIG.currency + n.toFixed(2);
const catInfo = (name) => CATEGORIES.find(c => c.name === name) || { icon: "🛍️", art: "🛍️", color: "#2a2a38" };

try { state.cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) {}
try { state.wish = JSON.parse(localStorage.getItem("wish") || "[]"); } catch (e) {}

function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(state.cart)); } catch (e) {}
  $("cartCount").textContent = state.cart.reduce((s, i) => s + i.qty, 0);
}
function saveWish() {
  try { localStorage.setItem("wish", JSON.stringify(state.wish)); } catch (e) {}
}

function placeholder(p) {
  const c = catInfo(p.category);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#26263a'/><stop offset='1' stop-color='#14141f'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='60%' font-size='140' text-anchor='middle'>${c.art || c.icon}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Card prodotto ---------- */
function makeCard(p) {
  const card = document.createElement("article");
  card.className = "card";
  const badge = p.tags && p.tags.includes("new") ? '<span class="tag">Novità</span>' : "";
  const liked = state.wish.includes(p.id);
  card.innerHTML = `
    ${badge}
    <button class="heart${liked ? " on" : ""}" aria-label="Preferito">${liked ? "♥" : "♡"}</button>
    <img src="${p.image || placeholder(p)}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <small>${p.brand} · ${p.category}</small>
      <h4>${p.name}</h4>
      <strong>${fmt(p.price)}</strong>
      <button class="btn btn-purple btn-sm add">Aggiungi</button>
    </div>`;
  card.onclick = () => openProduct(p.id);
  card.querySelector(".add").onclick = (e) => { e.stopPropagation(); addToCart(p.id); flashCart(); };
  const h = card.querySelector(".heart");
  h.onclick = (e) => {
    e.stopPropagation();
    state.wish = state.wish.includes(p.id) ? state.wish.filter(x => x !== p.id) : [...state.wish, p.id];
    saveWish();
    const on = state.wish.includes(p.id);
    h.classList.toggle("on", on); h.textContent = on ? "♥" : "♡";
  };
  return card;
}

/* ---------- Sezioni home ---------- */
function renderHome() {
  $("shopName").textContent = CONFIG.shopName;
  $("footName").textContent = CONFIG.shopName;
  document.title = CONFIG.shopName;
  $("heroEyebrow").textContent = CONFIG.heroEyebrow;
  $("heroTitle").textContent = CONFIG.heroTitle;
  $("heroAccent").textContent = CONFIG.heroAccent;
  $("heroText").textContent = CONFIG.heroText;
  if (CONFIG.heroImage) $("hero").style.setProperty("--hero-img", `url("${CONFIG.heroImage}")`);
  $("footWhatsapp").innerHTML = `<a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp +${CONFIG.whatsapp}</a>`;
  $("footEmail").innerHTML = `<a href="mailto:${CONFIG.email}">${CONFIG.email}</a>`;
  $("year").textContent = new Date().getFullYear();

  // menu categorie + footer
  $("catMenu").innerHTML = "";
  $("footCats").innerHTML = "";
  CATEGORIES.forEach(c => {
    const a = document.createElement("a");
    a.href = "#catalogo"; a.textContent = c.name;
    a.onclick = () => setCategory(c.name);
    $("catMenu").appendChild(a);
    const li = document.createElement("li");
    const b = document.createElement("a");
    b.href = "#catalogo"; b.textContent = c.name; b.onclick = () => setCategory(c.name);
    li.appendChild(b); $("footCats").appendChild(li);
  });

  // riquadri categorie
  $("tiles").innerHTML = "";
  CATEGORIES.forEach(c => {
    const t = document.createElement("a");
    t.className = "tile"; t.href = "#catalogo";
    t.style.background = c.color;
    const art = c.image ? `<img src="${c.image}" alt="${c.name}">` : `<span>${c.art || c.icon}</span>`;
    t.innerHTML = `
      <span class="tile-icon">${c.icon}</span>
      <h3>${c.name}</h3>
      <p>${c.desc || ""}</p>
      <div class="tile-art">${art}</div>
      <span class="tile-arrow">→</span>`;
    t.onclick = () => setCategory(c.name);
    $("tiles").appendChild(t);
  });

  // caroselli
  fillTrack("newTrack", PRODUCTS.filter(p => p.tags && p.tags.includes("new")));
  fillTrack("bestTrack", PRODUCTS.filter(p => p.tags && p.tags.includes("best")));

  // marche
  $("brands").innerHTML = "";
  [...new Set(PRODUCTS.map(p => p.brand))].forEach(b => {
    const a = document.createElement("a");
    a.className = "brand"; a.href = "#catalogo"; a.textContent = b;
    a.onclick = () => { state.brand = b; state.category = "Tutte"; resetShown(); renderToolbar(); renderGrid(); };
    $("brands").appendChild(a);
  });
}

function fillTrack(id, list) {
  const el = $(id); el.innerHTML = "";
  list.forEach(p => el.appendChild(makeCard(p)));
}

/* ---------- Catalogo ---------- */
function setCategory(name) {
  state.category = name; state.brand = "Tutte"; resetShown();
  renderToolbar(); renderGrid();
}
function resetShown() { state.shown = PAGE_SIZE; }

function renderToolbar() {
  const chips = $("chips"); chips.innerHTML = "";
  ["Tutte", ...CATEGORIES.map(c => c.name)].forEach(name => {
    const b = document.createElement("button");
    b.className = "chip" + (state.category === name ? " active" : "");
    b.textContent = name;
    b.onclick = () => { state.category = name; resetShown(); renderToolbar(); renderGrid(); };
    chips.appendChild(b);
  });
  const sel = $("brandSelect");
  sel.innerHTML = "";
  ["Tutte", ...new Set(PRODUCTS.map(p => p.brand))].forEach(b => {
    const o = document.createElement("option");
    o.value = b; o.textContent = b === "Tutte" ? "Tutte le marche" : b;
    if (state.brand === b) o.selected = true;
    sel.appendChild(o);
  });
}

function filtered() {
  const q = state.query.toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.brand === "Tutte" || p.brand === state.brand) &&
    (state.category === "Tutte" || p.category === state.category) &&
    (p.name + " " + p.brand + " " + p.category).toLowerCase().includes(q)
  );
  if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "desc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderGrid() {
  const list = filtered();
  $("resultInfo").textContent = list.length + " prodotti";
  $("grid").innerHTML = "";
  list.slice(0, state.shown).forEach(p => $("grid").appendChild(makeCard(p)));
  $("moreBtn").style.display = list.length > state.shown ? "inline-block" : "none";
}

/* ---------- Dettaglio prodotto ---------- */
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  $("productDetail").innerHTML = `
    <img src="${p.image || placeholder(p)}" alt="${p.name}">
    <small>${p.brand} · ${p.category}</small>
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <p class="price">${fmt(p.price)}</p>
    <button class="btn btn-purple" id="addBtn">Aggiungi alla richiesta</button>`;
  $("addBtn").onclick = () => { addToCart(id); closeAll(); flashCart(); };
  $("productModal").classList.remove("hidden");
}

/* ---------- Richiesta (carrello) ---------- */
function addToCart(id) {
  const item = state.cart.find(i => i.id === id);
  if (item) item.qty++; else state.cart.push({ id, qty: 1 });
  saveCart();
}
function flashCart() {
  const b = $("cartBtn"); b.classList.add("pop");
  setTimeout(() => b.classList.remove("pop"), 300);
}

function renderCart() {
  const box = $("cartItems");
  if (!state.cart.length) { box.innerHTML = "<p>La richiesta è vuota.</p>"; updateLinks(); return; }
  box.innerHTML = "";
  state.cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${p.name} <small>(${p.brand})</small></span>
      <span>
        <button data-a="minus">−</button> ${item.qty}
        <button data-a="plus">+</button>
        <button data-a="del">✕</button>
      </span>`;
    row.querySelectorAll("button").forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === "plus") item.qty++;
      if (a === "minus") item.qty = Math.max(1, item.qty - 1);
      if (a === "del") state.cart = state.cart.filter(i => i !== item);
      saveCart(); renderCart();
    });
    box.appendChild(row);
  });
  updateLinks();
}

function buildMessage() {
  const name = $("customerName").value.trim() || "(nome)";
  const lines = state.cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `- ${p.name} (${p.brand}) x${i.qty}`;
  });
  const total = state.cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
  return `Ciao, sono ${name} e vorrei questi articolui:\n${lines.join("\n")}\nTotale indicativo: ${fmt(total)}`;
}

function updateLinks() {
  const msg = encodeURIComponent(buildMessage());
  $("whatsappBtn").href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  $("emailBtn").href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Richiesta prodotti")}&body=${msg}`;
}

function closeAll() {
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

/* ---------- Eventi ---------- */
$("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  state.query = $("search").value; state.category = "Tutte"; state.brand = "Tutte"; resetShown();
  renderToolbar(); renderGrid();
  $("catalogo").scrollIntoView({ behavior: "smooth" });
});
$("search").addEventListener("input", e => { state.query = e.target.value; resetShown(); renderGrid(); });
$("brandSelect").onchange = e => { state.brand = e.target.value; resetShown(); renderGrid(); };
$("sortSelect").onchange = e => { state.sort = e.target.value; renderGrid(); };
$("moreBtn").onclick = () => { state.shown += PAGE_SIZE; renderGrid(); };
$("cartBtn").onclick = () => { renderCart(); $("cartModal").classList.remove("hidden"); };
$("customerName").addEventListener("input", updateLinks);
$("burger").onclick = () => $("mainNav").classList.toggle("open");
$("mainNav").addEventListener("click", () => $("mainNav").classList.remove("open"));
document.querySelectorAll("[data-close]").forEach(b => b.onclick = closeAll);
document.querySelectorAll(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m) closeAll(); }));
document.querySelectorAll(".arrow").forEach(a => a.onclick = () => {
  const t = $(a.dataset.target);
  t.scrollBy({ left: a.dataset.dir * t.clientWidth * 0.8, behavior: "smooth" });
});

/* ---------- Avvio ---------- */
saveCart();
renderHome();
renderToolbar();
renderGrid();
