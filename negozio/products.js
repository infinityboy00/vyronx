// ====== CONFIGURAZIONE ======
// Cambia questi dati con i tuoi.
const CONFIG = {
  shopName: " Vyron X",
  whatsapp: "3715464615",          // numero con prefisso, senza + e senza spazi
  email: "Baderloumaissi@gmail.com",
  currency: "€",
  heroEyebrow: "FASHION / TECH / LIFESTYLE",
  heroTitle: "OWN YOUR STYLE",
  heroAccent: "BREAK THE RULES",       // seconda riga, con sfumatura viola
  heroText: "Abbigliamento, scarpe, accessori e altro. Tutto in un unico posto.",
  heroImage: ""                      // foto grande a destra, es. "img/hero.jpg" (vuoto = solo sfondo)
};

// ====== CATEGORIE ======
// soon: true = categoria "in arrivo" (non cliccabile, nessun prodotto)
// icon = emoji piccola, art = emoji grande (o "image": "img/cat.png"), color = colore del riquadro
const CATEGORIES = [
  { name: "T-shirts", soon: true, desc: "Look freschi. Ogni giorno.",  icon: "",image: "img/nike.png" , color: "#ffe08a" },
  { name: "Hoodie", soon: true,     desc: "Comfort e stile.",            icon: "", image: "img/nike1.png" , color: "#a9d8ff" },
  { name: "Pants", soon: true, desc: "Per ogni occasione.",         icon: "", image: "img/nike2.png" , color: "#ff8a7a" },
  { name: "Jackets", soon: true,   desc: "Caldo e di tendenza.",        icon: "", image: "img/nike3.png" , color: "#9be8a8" },
  { name: "Shoes", soon: true,    desc: "Fai il passo giusto.",        icon: "",image:  "img/nike4.png", color: "#b794ff" },
  { name: "Profumi", desc: "Fragranze iconiche.", icon: "", art: "🧴", color: "#f5b7d0" },
  { name: "Electronic devices", desc: "Piccoli dettagli. Grande effetto.", icon: "", image:  "img/acces.png", color: "#ffb27a" }
];

// ====== CATALOGO ======
// tags: "new" = appare in Novità, "best" = appare in Prodotti in evidenza (puoi metterli entrambi)
// "image": link o file nella cartella "img/" (es. "img/prodotto1.jpg"). Vuoto = segnaposto.
//
// TAGLIE E COLORI (opzionali):
//   sizes: ["S","M","L","XL"]   -> taglie del prodotto. Se non lo scrivi, vengono usate quelle di default
//                                  (abbigliamento XS-XXL, scarpe 36-45, accessori/electronic = nessuna taglia).
//                                  sizes: []  -> nessuna taglia per quel prodotto.
//   colors: [ { name: "Nero", hex: "#111", images: ["img/a.png", "img/b.png", "img/c.png"] }, ... ]
//                                -> ogni colore ha il suo colore (hex) e le sue foto: scorrono con le frecce.
//   images: ["img/1.png","img/2.png"] -> più foto senza colori diversi.
const PRODUCTS = [
  // ---- Nuovi prodotti (foto in img/) ---- cambia i prezzi con i tuoi!
  { id: 101, name: "AirPods Pro 2", brand: "APPLE", category: "Electronic devices", price: 35, tags: ["new","best"],
    sizes: [],
    images: ["img/airpods-pro-mano.jpg", "img/airpods-pro-box.jpg", "img/airpods-pro-2.jpg"],
    description: "Auricolari wireless con custodia di ricarica, cavo e gommini di varie misure inclusi nella confezione." },
  { id: 102, name: "AirPods con custodia MagSafe", brand: "APPLE", category: "Electronic devices", price: 25, tags: ["new"],
    sizes: [],
    images: ["img/airpods-magsafe.jpg"],
    description: "Auricolari wireless con custodia di ricarica MagSafe e cavo di ricarica." },
  { id: 103, name: "AirPods Max", brand: "APPLE", category: "Electronic devices", price: 60, tags: ["best"],
    sizes: [],
    colors: [
      { name: "Beige", hex: "#d9d0c1", images: ["img/airpods-max-beige.jpg"] },
      { name: "Blu notte", hex: "#2b3650", images: ["img/airpods-max-blu.jpg"] }
    ],
    description: "Cuffie over-ear wireless con custodia protettiva inclusa." },
  { id: 104, name: "Smartwatch Serie 9", brand: "APPLE", category: "Electronic devices", price: 45, tags: ["new","best"],
    sizes: [],
    colors: [
      { name: "Beige", hex: "#d9d0c1", images: ["img/watch-beige.jpg"] },
      { name: "Nero (con 3 cinturini)", hex: "#111111", images: ["img/watch-nero.jpg"] }
    ],
    description: "Smartwatch con cinturino in silicone, scatola e caricatore magnetico USB inclusi." },
  { id: 105, name: "JBL Flip 6", brand: "JBL", category: "Electronic devices", price: 30, tags: ["best"],
    sizes: [],
    images: ["img/jbl-flip6.jpg", "img/jbl-flip6-colori.jpg"],
    description: "Speaker Bluetooth portatile e impermeabile. Disponibile in mimetico, blu, verde, nero e rosso: scrivici il colore che preferisci." },
  { id: 106, name: "JBL Clip 5", brand: "JBL", category: "Electronic devices", price: 20, tags: ["new"],
    sizes: [],
    images: ["img/jbl-clip5.jpg", "img/jbl-clip5-nero.jpg"],
    description: "Speaker Bluetooth compatto con moschettone integrato, perfetto da agganciare allo zaino." },
  { id: 107, name: "JBL Charge 6", brand: "JBL", category: "Electronic devices", price: 40, tags: ["new","best"],
    sizes: [],
    colors: [
      { name: "Blu", hex: "#1f4a63", images: ["img/jbl-charge6-blu.jpg"] },
      { name: "Nero", hex: "#111111", images: ["img/jbl-charge6-nero.jpg"] }
    ],
    description: "Speaker Bluetooth portatile e impermeabile con cinghia, per portare la musica ovunque." },
  { id: 108, name: "Bang Blaze 60000 · 4 in 1", brand: "BANG BLAZE", category: "Electronic devices", price: 15, tags: ["new","best"],
    sizes: [],
    images: ["img/bangblaze-60000.jpg", "img/bangblaze-60000-gusti.jpg"],
    description: "Dispositivo 4 in 1 con display digitale, ricarica Type-C e batteria da 650 mAh." },
  { id: 109, name: "Bang Blaze 6 in 1 · 12 gusti", brand: "BANG BLAZE", category: "Electronic devices", price: 15, tags: ["new"],
    sizes: [],
    images: ["img/bangblaze-gusti.jpg", "img/bangblaze-200k.jpg", "img/bangblaze-200k-gusti.jpg"],
    description: "Versione 6 in 1 con display digitale, disponibile in 12 gusti: scrivici quale preferisci." },

  // ---- Ultimi arrivi ---- (prezzi provvisori: cambiali con i tuoi!)
  { id: 110, name: "Apple Pencil Pro", brand: "APPLE", category: "Electronic devices", price: 20, tags: ["new","best"],
    sizes: [],
    images: ["img/pencil-pro-1.jpg", "img/pencil-pro-2.jpg", "img/pencil-pro-3.jpg"],
    description: "Penna digitale per iPad con confezione originale." },
  { id: 111, name: "Power Bank MagSafe", brand: "APPLE", category: "Electronic devices", price: 20, tags: ["new"],
    sizes: [],
    images: ["img/powerbank-magsafe-1.jpg", "img/powerbank-magsafe-2.jpg"],
    description: "Batteria portatile magnetica MagSafe, si aggancia dietro al telefono e ricarica senza cavi." },
  { id: 112, name: "Gucci Bloom 100ml", brand: "GUCCI", category: "Profumi", price: 25, tags: ["new"],
    sizes: [],
    images: ["img/gucci-bloom.jpg"],
    description: "Eau de parfum floreale da donna, flacone da 100 ml con confezione." },
  { id: 113, name: "Versace Eros 100ml", brand: "VERSACE", category: "Profumi", price: 25, tags: ["new","best"],
    sizes: [],
    images: ["img/versace-eros.jpg"],
    description: "Eau de parfum da uomo, flacone da 100 ml con confezione." },
  { id: 114, name: "Dior Hypnotic Poison 100ml", brand: "DIOR", category: "Profumi", price: 25, tags: ["new"],
    sizes: [],
    images: ["img/dior-hypnotic-poison.jpg"],
    description: "Eau de parfum da donna, flacone da 100 ml con confezione." },
  { id: 115, name: "Miss Dior Blooming Bouquet", brand: "DIOR", category: "Profumi", price: 25, tags: ["new","best"],
    sizes: [],
    images: ["img/miss-dior-blooming-bouquet.jpg"],
    description: "Eau de toilette da donna con il fiocco argentato, con confezione." },
];
