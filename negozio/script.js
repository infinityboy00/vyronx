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

/* ---------- Taglie, colori, immagini ---------- */
const DEFAULT_SIZES = {
  clothes: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
};
// Taglie: usa p.sizes se presente (anche [] = nessuna taglia), altrimenti default per categoria
function sizesOf(p) {
  if (Array.isArray(p.sizes)) return p.sizes;
  const c = (p.category || "").toLowerCase();
  if (/scarpe|shoes/.test(c)) return DEFAULT_SIZES.shoes;
  if (/accessori|electronic/.test(c)) return [];
  return DEFAULT_SIZES.clothes;
}
function colorsOf(p) { return Array.isArray(p.colors) ? p.colors : []; }
// Immagini da mostrare: quelle del colore scelto, oppure p.images / p.image
function imagesOf(p, colorIdx = 0) {
  const col = colorsOf(p)[colorIdx];
  let list = [];
  if (col) list = col.images || (col.image ? [col.image] : []);
  if (!list.length && Array.isArray(p.images)) list = p.images;
  if (!list.length && p.image) list = [p.image];
  return list.length ? list : [placeholder(p)];
}
function fallbackImg(img, p) {
  img.addEventListener("error", () => { img.onerror = null; img.src = placeholder(p); }, { once: true });
}

/* ---------- Card prodotto ---------- */
function makeCard(p) {
  const card = document.createElement("article");
  card.className = "card";
  const badge = p.tags && p.tags.includes("new") ? '<span class="tag">Novità</span>' : "";
  const liked = state.wish.includes(p.id);
  const colors = colorsOf(p);
  const needsChoice = sizesOf(p).length > 0 || colors.length > 0;
  const dots = colors.length > 1
    ? `<div class="card-colors">${colors.map(c => `<i style="--c:${c.hex || "#888"}" title="${c.name}"></i>`).join("")}</div>`
    : "";
  card.innerHTML = `
    ${badge}
    <button class="heart${liked ? " on" : ""}" aria-label="Preferito">${liked ? "♥" : "♡"}</button>
    <img src="${imagesOf(p, 0)[0]}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <small>${p.brand} · ${p.category}</small>
      <h4>${p.name}</h4>
      ${dots}
      <strong>${fmt(p.price)}</strong>
      <button class="btn btn-purple btn-sm add">${needsChoice ? "Scegli opzioni" : "Aggiungi"}</button>
    </div>`;
  fallbackImg(card.querySelector("img"), p);
  card.onclick = () => openProduct(p.id);
  card.querySelector(".add").onclick = (e) => {
    e.stopPropagation();
    if (needsChoice) openProduct(p.id); else { addToCart(p.id); flashCart(); }
  };
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
    if (c.soon) {
      const sp = document.createElement("span");
      sp.className = "soon-item"; sp.textContent = c.name + " · in arrivo";
      $("catMenu").appendChild(sp);
      const li0 = document.createElement("li");
      li0.textContent = c.name + " · in arrivo";
      $("footCats").appendChild(li0);
      return;
    }
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
    const t = document.createElement(c.soon ? "div" : "a");
    t.className = "tile" + (c.soon ? " soon" : "");
    if (!c.soon) t.href = "#catalogo";
    t.style.background = c.color;
    const art = c.image ? `<img src="${c.image}" alt="${c.name}">` : `<span>${c.art || c.icon}</span>`;
    t.innerHTML = `
      <span class="tile-icon">${c.icon}</span>
      <h3>${c.name}</h3>
      <p>${c.desc || ""}</p>
      <div class="tile-art">${art}</div>
      ${c.soon ? '<span class="soon-badge">IN ARRIVO</span>' : '<span class="tile-arrow">→</span>'}`;
    if (!c.soon) t.onclick = () => setCategory(c.name);
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
  [{ name: "Tutte" }, ...CATEGORIES].forEach(c => {
    const name = c.name;
    const b = document.createElement("button");
    b.className = "chip" + (state.category === name ? " active" : "");
    if (c.soon) { b.textContent = name + " · in arrivo"; b.disabled = true; b.classList.add("soon-chip"); }
    else { b.textContent = name; b.onclick = () => { state.category = name; resetShown(); renderToolbar(); renderGrid(); }; }
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
let galleryNav = null;

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const colors = colorsOf(p), sizes = sizesOf(p);
  const sel = { color: colors.length ? 0 : -1, size: null, img: 0 };
  const box = $("productDetail");

  box.innerHTML = `
    <div class="gallery">
      <div class="gallery-main">
        <img id="galImg" alt="${p.name}">
        <button class="gal-btn prev" aria-label="Immagine precedente">‹</button>
        <button class="gal-btn next" aria-label="Immagine successiva">›</button>
        <span class="gal-count" id="galCount"></span>
      </div>
      <div class="gal-thumbs" id="galThumbs"></div>
    </div>
    <small>${p.brand} · ${p.category}</small>
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <p class="price">${fmt(p.price)}</p>
    ${colors.length ? `<div class="opt"><div class="opt-label">Colore: <b id="colorName"></b></div><div class="swatches" id="swatches"></div></div>` : ""}
    ${sizes.length ? `<div class="opt"><div class="opt-label">Taglia: <b id="sizeName">—</b></div><div class="sizes" id="sizes"></div></div>` : ""}
    <p class="opt-error" id="optError"></p>
    <button class="btn btn-purple" id="addBtn">Aggiungi alla richiesta</button>`;

  const mainImg = $("galImg");
  const renderGallery = () => {
    const imgs = imagesOf(p, Math.max(sel.color, 0));
    if (sel.img >= imgs.length) sel.img = 0;
    mainImg.src = imgs[sel.img];
    fallbackImg(mainImg, p);
    const multi = imgs.length > 1;
    box.querySelector(".prev").style.display = multi ? "" : "none";
    box.querySelector(".next").style.display = multi ? "" : "none";
    $("galCount").style.display = multi ? "" : "none";
    $("galCount").textContent = `${sel.img + 1} / ${imgs.length}`;
    const th = $("galThumbs"); th.innerHTML = "";
    if (multi) imgs.forEach((src, i) => {
      const b = document.createElement("button");
      b.className = "thumb" + (i === sel.img ? " active" : "");
      b.setAttribute("aria-label", "Immagine " + (i + 1));
      const im = document.createElement("img");
      im.src = src; im.alt = ""; fallbackImg(im, p);
      b.appendChild(im);
      b.onclick = () => { sel.img = i; renderGallery(); };
      th.appendChild(b);
    });
  };
  const go = (d) => {
    const n = imagesOf(p, Math.max(sel.color, 0)).length;
    sel.img = (sel.img + d + n) % n;
    renderGallery();
  };
  galleryNav = go;
  box.querySelector(".prev").onclick = () => go(-1);
  box.querySelector(".next").onclick = () => go(1);

  // swipe su mobile
  let startX = null;
  const gm = box.querySelector(".gallery-main");
  gm.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  gm.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX = null;
  });

  // colori
  if (colors.length) {
    const sw = $("swatches");
    const renderColors = () => {
      sw.innerHTML = "";
      colors.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "swatch" + (i === sel.color ? " active" : "");
        b.style.setProperty("--c", c.hex || "#888");
        b.title = c.name; b.setAttribute("aria-label", c.name);
        b.onclick = () => { sel.color = i; sel.img = 0; renderColors(); renderGallery(); };
        sw.appendChild(b);
      });
      $("colorName").textContent = colors[sel.color].name;
    };
    renderColors();
  }

  // taglie
  if (sizes.length) {
    const wrap = $("sizes");
    sizes.forEach(s => {
      const b = document.createElement("button");
      b.className = "size"; b.textContent = s;
      b.onclick = () => {
        sel.size = s;
        wrap.querySelectorAll(".size").forEach(x => x.classList.toggle("active", x === b));
        $("sizeName").textContent = s;
        $("optError").textContent = "";
      };
      wrap.appendChild(b);
    });
  }

  renderGallery();
  $("addBtn").onclick = () => {
    if (sizes.length && !sel.size) { $("optError").textContent = "Seleziona una taglia."; return; }
    addToCart(id, colors.length ? colors[sel.color].name : null, sel.size);
    closeAll(); flashCart();
  };
  $("productModal").classList.remove("hidden");
}

/* ---------- Richiesta (carrello) ---------- */
function optsText(item) {
  const parts = [];
  if (item.color) parts.push("Colore: " + item.color);
  if (item.size) parts.push("Taglia: " + item.size);
  return parts.join(" · ");
}
function addToCart(id, color = null, size = null) {
  const item = state.cart.find(i => i.id === id && (i.color || null) === color && (i.size || null) === size);
  if (item) item.qty++; else state.cart.push({ id, qty: 1, color, size });
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
      <span>${p.name} <small>(${p.brand})</small>${optsText(item) ? `<br><small class="opts">${optsText(item)}</small>` : ""}</span>
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
    const o = [i.color ? "colore " + i.color : "", i.size ? "taglia " + i.size : ""].filter(Boolean).join(", ");
    return `- ${p.name} (${p.brand})${o ? " - " + o : ""} x${i.qty}`;
  });
  const total = state.cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
  return `Ciao, sono ${name} e vorrei questi articoli:\n${lines.join("\n")}\nTotale indicativo: ${fmt(total)}`;
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
document.addEventListener("keydown", e => {
  if ($("productModal").classList.contains("hidden")) return;
  if (e.key === "ArrowLeft" && galleryNav) galleryNav(-1);
  if (e.key === "ArrowRight" && galleryNav) galleryNav(1);
  if (e.key === "Escape") closeAll();
});
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
