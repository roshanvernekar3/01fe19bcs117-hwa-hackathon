export type Category = "outerwear" | "tops" | "bottoms" | "accessories";

export type CollectionSlug = "bio-synth" | "circuit-noir" | "zero-form";

export type GarmentKind =
  | "jacket"
  | "bomber"
  | "trench"
  | "hoodie"
  | "knit"
  | "tee"
  | "cargo"
  | "denim"
  | "bag"
  | "cap";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  emoji: string;
  gradient: string;
  image: string;
  features: string[];
  inStock: boolean;
  stock?: number;
  /** Collection this piece belongs to. Optional so older admin-created products stay valid. */
  collection?: CollectionSlug;
  /** Which holographic garment scan to render for this piece. */
  art?: GarmentKind;
  /** Primary circular material story. */
  material?: string;
  /** Estimated kg CO2e avoided versus a conventional equivalent. */
  carbon?: number;
};

export const CATEGORIES: { slug: Category; name: string; index: string; desc: string }[] = [
  {
    slug: "outerwear",
    name: "Outerwear",
    index: "01",
    desc: "Weather-built shells and coats grown from regenerated fibre.",
  },
  {
    slug: "tops",
    name: "Tops",
    index: "02",
    desc: "Second-skin knits and signal-ready layers with zero virgin plastic.",
  },
  {
    slug: "bottoms",
    name: "Bottoms",
    index: "03",
    desc: "Modular trousers engineered for movement and long life.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    index: "04",
    desc: "Closed-loop carry goods made from every last offcut.",
  },
];

export const COLLECTIONS: {
  slug: CollectionSlug;
  name: string;
  index: string;
  statement: string;
  description: string;
  accent: string;
  tone: "violet" | "silver" | "chrome";
  art: GarmentKind;
}[] = [
  {
    slug: "bio-synth",
    name: "Bio-Synth",
    index: "01",
    statement: "Grown, not extracted.",
    description:
      "Outerwear woven from lab-grown cellulose and reclaimed ocean fibre. Weatherproof without the petrochemical cost.",
    accent: "#A855F7",
    tone: "violet",
    art: "trench",
  },
  {
    slug: "circuit-noir",
    name: "Circuit Noir",
    index: "02",
    statement: "Signal in the dark.",
    description:
      "A night-ready uniform of conductive knits, reflective panels and recycled technical jersey. Built to move, made to last.",
    accent: "#C084FC",
    tone: "silver",
    art: "hoodie",
  },
  {
    slug: "zero-form",
    name: "Zero Form",
    index: "03",
    statement: "Every offcut, intentional.",
    description:
      "Modular accessories cut from production remnants. One form, infinite configurations, nothing sent to landfill.",
    accent: "#E8E9EE",
    tone: "chrome",
    art: "bag",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "aegis-shell",
    slug: "aegis-shell",
    name: "Aegis Shell",
    category: "outerwear",
    collection: "bio-synth",
    art: "jacket",
    tagline: "Asymmetric storm shell with a closed-loop membrane",
    description:
      "A weatherproof shell cut from regenerated cellulose and reclaimed marine fibre. The asymmetric zip, storm collar and modular chest pocket are designed for movement, while the fully seam-sealed membrane keeps the elements out without a drop of virgin plastic. Every panel is laser-cut to pattern, so the offcuts return to the fibre pool.",
    price: 18400,
    rating: 4.9,
    reviews: 128,
    badge: "New drop",
    emoji: "◈",
    gradient: "from-violet/20 to-transparent",
    image: "/products/aegis-shell.svg",
    features: [
      "100% regenerated shell",
      "Seam-sealed, PFC-free",
      "Modular chest pocket",
      "Lifetime repair included",
    ],
    inStock: true,
    stock: 18,
    material: "Reclaimed marine fibre + lab-grown cellulose",
    carbon: 12.4,
  },
  {
    id: "halo-bomber",
    slug: "halo-bomber",
    name: "Halo Bomber",
    category: "outerwear",
    collection: "bio-synth",
    art: "bomber",
    tagline: "Liquid-silver bomber with an iridescent bio-nylon shell",
    description:
      "A cropped bomber in recycled bio-nylon with a violet iridescent finish that shifts as you move. Ribbed cuffs are knitted from post-consumer yarn, and the chrome zip is reclaimed and re-polished. Lined in deadstock mesh so no new material enters the system.",
    price: 14900,
    rating: 4.8,
    reviews: 96,
    badge: "Bestseller",
    emoji: "◇",
    gradient: "from-silver/20 to-transparent",
    image: "/products/halo-bomber.svg",
    features: [
      "Recycled bio-nylon shell",
      "Deadstock mesh lining",
      "Reclaimed chrome hardware",
      "Packable into its own pocket",
    ],
    inStock: true,
    stock: 24,
    material: "Recycled bio-nylon + reclaimed chrome",
    carbon: 9.8,
  },
  {
    id: "strata-trench",
    slug: "strata-trench",
    name: "Strata Trench",
    category: "outerwear",
    collection: "bio-synth",
    art: "trench",
    tagline: "Long architectural trench with translucent silver panels",
    description:
      "Our most technical silhouette. A floor-skimming trench built from layered regenerated fibre, with translucent silver panels that reveal the construction beneath. The belt and storm flap are modular, so the coat can be re-cut and repaired rather than replaced.",
    price: 22800,
    rating: 4.9,
    reviews: 54,
    badge: "Limited / 120",
    emoji: "◆",
    gradient: "from-violet/15 to-silver/10",
    image: "/products/strata-trench.svg",
    features: [
      "Architectural zero-waste cut",
      "Translucent silver membrane",
      "Detachable modular belt",
      "Numbered circular passport",
    ],
    inStock: true,
    stock: 9,
    material: "Regenerated cellulose + silver membrane",
    carbon: 16.2,
  },
  {
    id: "circuit-knit",
    slug: "circuit-knit",
    name: "Circuit Knit",
    category: "tops",
    collection: "circuit-noir",
    art: "knit",
    tagline: "Conductive knit with luminous violet thread",
    description:
      "A fitted, high-neck knit engineered with a traceable conductive filament that glows faintly under low light. The yarn is spun from recycled bottles and post-industrial cotton, dyed with a closed-loop violet pigment. Warm, breathable, and endlessly repairable.",
    price: 8600,
    rating: 4.7,
    reviews: 73,
    emoji: "⌁",
    gradient: "from-violet/20 to-transparent",
    image: "/products/circuit-knit.svg",
    features: [
      "Recycled cotton blend",
      "Traceable conductive thread",
      "Closed-loop dye process",
      "Snag-resistant finish",
    ],
    inStock: true,
    stock: 32,
    material: "Recycled cotton + conductive filament",
    carbon: 5.1,
  },
  {
    id: "flux-hoodie",
    slug: "flux-hoodie",
    name: "Flux Hoodie",
    category: "tops",
    collection: "circuit-noir",
    art: "hoodie",
    tagline: "Oversized reflective hoodie in washed organic cotton",
    description:
      "An oversized daily layer in heavyweight organic cotton with a liquid-chrome reflective chest panel. The drawcords and ribbing are made from the same recycled yarn, and the brushed interior is finished without chemical softeners.",
    price: 9800,
    rating: 4.8,
    reviews: 211,
    badge: "Core",
    emoji: "◌",
    gradient: "from-silver/15 to-transparent",
    image: "/products/flux-hoodie.svg",
    features: [
      "Heavyweight organic cotton",
      "Reflective chrome panel",
      "Chemical-free brushed fleece",
      "Unisex oversized fit",
    ],
    inStock: true,
    stock: 41,
    material: "Organic cotton + recycled reflective yarn",
    carbon: 6.4,
  },
  {
    id: "second-skin-tee",
    slug: "second-skin-tee",
    name: "Second Skin Tee",
    category: "tops",
    collection: "circuit-noir",
    art: "tee",
    tagline: "Sculpted jersey tee with violet micro-piping",
    description:
      "A clean, close-cut tee in a recycled jersey that feels like a second skin. Sculpted side seams and a silver sheen give it a quiet technical edge. Designed to be worn, washed and worn again for years.",
    price: 4200,
    rating: 4.6,
    reviews: 167,
    emoji: "·",
    gradient: "from-silver/10 to-transparent",
    image: "/products/second-skin-tee.svg",
    features: [
      "Recycled jersey",
      "Sculpted side seams",
      "Violet micro-piping",
      "Pilling-resistant",
    ],
    inStock: true,
    stock: 56,
    material: "Recycled PET + organic cotton jersey",
    carbon: 2.8,
  },
  {
    id: "cargo-trace",
    slug: "cargo-trace",
    name: "Cargo Trace",
    category: "bottoms",
    collection: "circuit-noir",
    art: "cargo",
    tagline: "Wide-leg technical cargo with traceable seam tape",
    description:
      "Wide-leg cargo trousers built from recycled ripstop with articulated knee panels and a adjustable hem. The violet seam tape carries a scannable fibre identity, so the trousers can be sorted and recycled at end of life instead of discarded.",
    price: 11200,
    rating: 4.8,
    reviews: 89,
    badge: "Trending",
    emoji: "⌇",
    gradient: "from-violet/15 to-transparent",
    image: "/products/cargo-trace.svg",
    features: [
      "Recycled ripstop",
      "Articulated knee panels",
      "Scannable fibre passport",
      "Adjustable hem",
    ],
    inStock: true,
    stock: 27,
    material: "Recycled ripstop nylon",
    carbon: 7.2,
  },
  {
    id: "rift-denim",
    slug: "rift-denim",
    name: "Rift Denim",
    category: "bottoms",
    collection: "circuit-noir",
    art: "denim",
    tagline: "Upcycled patchwork denim with violet repair stitching",
    description:
      "Relaxed denim assembled from post-consumer jeans and deadstock indigo. Every pair is unique: panels are matched by hand and joined with visible violet repair stitching. Softened with ozone washing, which uses a fraction of the water of conventional denim.",
    price: 10400,
    rating: 4.7,
    reviews: 62,
    emoji: "≋",
    gradient: "from-violet/10 to-silver/10",
    image: "/products/rift-denim.svg",
    features: [
      "Post-consumer denim",
      "Hand-matched unique panels",
      "Ozone low-water wash",
      "Free repair stitching for life",
    ],
    inStock: true,
    stock: 15,
    material: "Upcycled denim + deadstock indigo",
    carbon: 18.5,
  },
  {
    id: "orbits-crossbody",
    slug: "orbits-crossbody",
    name: "Orbits Crossbody",
    category: "accessories",
    collection: "zero-form",
    art: "bag",
    tagline: "Modular crossbody cut from reconstructed offcuts",
    description:
      "A compact crossbody built from reclaimed leather offcuts, assembled around a polished chrome orbital ring. The strap is adjustable and detachable, and the interior is lined with repurposed airbag nylon. One bag, three ways to wear it.",
    price: 7600,
    rating: 4.9,
    reviews: 44,
    badge: "New",
    emoji: "◎",
    gradient: "from-violet/20 to-transparent",
    image: "/products/orbits-crossbody.svg",
    features: [
      "Reclaimed leather offcuts",
      "Chrome orbital ring",
      "Detachable strap",
      "Airbag nylon lining",
    ],
    inStock: true,
    stock: 21,
    material: "Reclaimed leather + airbag nylon",
    carbon: 4.6,
  },
  {
    id: "null-cap",
    slug: "null-cap",
    name: "Null Cap",
    category: "accessories",
    collection: "zero-form",
    art: "cap",
    tagline: "Structured six-panel cap in recycled technical canvas",
    description:
      "A clean six-panel cap in recycled technical canvas with a polished chrome brim edge. The embroidered glyph is stitched with the same violet conductive thread used across Circuit Noir. Adjustable, packable, built to outlast trends.",
    price: 3200,
    rating: 4.5,
    reviews: 38,
    emoji: "○",
    gradient: "from-silver/15 to-transparent",
    image: "/products/null-cap.svg",
    features: [
      "Recycled technical canvas",
      "Polished chrome brim",
      "Conductive thread glyph",
      "Adjustable metal clasp",
    ],
    inStock: true,
    stock: 64,
    material: "Recycled technical canvas",
    carbon: 1.9,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const byCategory = (cat: Category) => PRODUCTS.filter((p) => p.category === cat);

export const byCollection = (collection: CollectionSlug) => PRODUCTS.filter((p) => p.collection === collection);

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
