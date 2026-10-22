// ====== CONFIGURAZIONE ======
// Cambia questi dati con i tuoi.
const CONFIG = {
  shopName: "VYRON X",
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
// icon = emoji piccola, art = emoji grande (o "image": "img/cat.png"), color = colore del riquadro
const CATEGORIES = [
  { name: "T-shirts", desc: "Look freschi. Ogni giorno.",  icon: "👕", art: "👕", color: "#ffe08a" },
  { name: "Sweatshirts",     desc: "Comfort e stile.",            icon: "🧥", art: "🧥", color: "#a9d8ff" },
  { name: "Pants", desc: "Per ogni occasione.",         icon: "👖", art: "👖", color: "#ff8a7a" },
  { name: "Jackets",   desc: "Caldo e di tendenza.",        icon: "🧥", art: "🧥", color: "#9be8a8" },
  { name: "Shoes",    desc: "Fai il passo giusto.",        icon: "👟", art: "👟", color: "#b794ff" },
  { name: "Electronic devices", desc: "Piccoli dettagli. Grande effetto.", icon: "🧢", art: "", color: "#ffb27a" }
];

// ====== CATALOGO ======
// tags: "new" = appare in Novità, "best" = appare in Prodotti in evidenza (puoi metterli entrambi)
// "image": link o file nella cartella "img/" (es. "img/prodotto1.jpg"). Vuoto = segnaposto.
const PRODUCTS = [
  { id: 1,  name: "Prodotto 1",  brand: "NIKE ", category: "Magliette", price: 25,  tags: ["new"],         image: "", description: "Descrizione del prodotto 1." },
  { id: 2,  name: "Prodotto 2",  brand: "SP5DER ", category: "Felpe",     price: 45,  tags: ["best"],        image: "", description: "Descrizione del prodotto 2." },
  { id: 3,  name: "Prodotto 3",  brand: "SUPREME", category: "Pantaloni", price: 55,  tags: ["new","best"],  image: "", description: "Descrizione del prodotto 3." },
  { id: 4,  name: "Prodotto 4",  brand: "CHROME HEARTS", category: "Magliette", price: 30,  tags: ["best"],        image: "", description: "Descrizione del prodotto 4." },
  { id: 5,  name: "Prodotto 5",  brand: "PURPLE BRAND", category: "Giacche",   price: 90,  tags: ["new"],         image: "", description: "Descrizione del prodotto 5." },
  { id: 6,  name: "Prodotto 6",  brand: "EMOTION", category: "Felpe",     price: 48,  tags: [],              image: "", description: "Descrizione del prodotto 6." },
  { id: 7,  name: "Prodotto 7",  brand: "GALLERY", category: "Accessori", price: 15,  tags: ["best"],        image: "", description: "Descrizione del prodotto 7." },
  { id: 8,  name: "Prodotto 8",  brand: "LIFE HUSTLERS", category: "Magliette", price: 28,  tags: ["new"],         image: "", description: "Descrizione del prodotto 8." },
  { id: 9,  name: "Prodotto 9",  brand: "CP COMPANY", category: "Scarpe",    price: 80,  tags: ["best"],        image: "", description: "Descrizione del prodotto 9." },
  { id: 10, name: "Prodotto 10", brand: "JORDAN", category: "Pantaloni", price: 60,  tags: [],              image: "", description: "Descrizione del prodotto 10." },
  { id: 11, name: "Prodotto 11", brand: "STUSSY", category: "Giacche",   price: 110, tags: ["new"],         image: "", description: "Descrizione del prodotto 11." },
  { id: 12, name: "Prodotto 12", brand: "DENIM TEARS", category: "Accessori", price: 20,  tags: ["best"],        image: "", description: "Descrizione del prodotto 12." },
  { id: 13, name: "Prodotto 13", brand: "CORTEIZ", category: "Scarpe",    price: 75,  tags: ["new"],         image: "", description: "Descrizione del prodotto 13." },
  { id: 14, name: "Prodotto 14", brand: "ESSENTIALS", category: "Accessori", price: 18,  tags: [],              image: "", description: "Descrizione del prodotto 14." },
  { id: 15, name: "Prodotto 15", brand: "CARHARTT", category: "Felpe",     price: 52,  tags: ["best"],        image: "", description: "Descrizione del prodotto 15." },
  { id: 16, name: "Prodotto 16", brand: "ROUGHPLAY", category: "Magliette", price: 27,  tags: [],              image: "", description: "Descrizione del prodotto 16." },
  { id: 17, name: "Prodotto 17", brand: "STONE ISLAND", category: "Magliette", price: 27,  tags: [],              image: "", description: "Descrizione del prodotto 17." },
  { id: 17, name: "Prodotto 18", brand: "PALM ANGELS", category: "Magliette", price: 27,  tags: [],              image: "", description: "Descrizione del prodotto 18." },
];
