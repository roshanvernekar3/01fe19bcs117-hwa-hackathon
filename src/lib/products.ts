export type Category = "interactive-toys" | "pet-houses" | "cat-washrooms";

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
};

export const CATEGORIES: { slug: Category; name: string; emoji: string; desc: string }[] = [
  {
    slug: "interactive-toys",
    name: "Interactive Toys",
    emoji: "🎾",
    desc: "Smart, motion-activated play that keeps pets engaged for hours.",
  },
  {
    slug: "pet-houses",
    name: "Pet Houses",
    emoji: "🏠",
    desc: "Cozy, modern dens designed for comfort and style.",
  },
  {
    slug: "cat-washrooms",
    name: "Cat Washrooms",
    emoji: "🛁",
    desc: "Odor-free, easy-clean litter solutions for a happy home.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "t1",
    slug: "treattrek",
    name: "TreatTrek",
    category: "interactive-toys",
    tagline: "Interactive treat-hunting toy for curious pets",
    description: "A fun treat-tracking toy that turns snack time into an adventure. Encourages natural foraging and keeps pets mentally stimulated.",
    price: 299,
    rating: 4.8,
    reviews: 124,
    badge: "New",
    emoji: "🦴",
    gradient: "from-peach to-blush",
    image: "/products/treattrek.jpeg",
    features: ["Treat dispensing", "Durable build", "Easy to clean", "Suitable for dogs & cats"],
    inStock: true,
  },
  {
    id: "t2",
    slug: "snufflesafari",
    name: "SnuffleSafari",
    category: "interactive-toys",
    tagline: "Snuffle mat for foraging fun",
    description: "A soft snuffle mat that hides treats in fabric folds, engaging your pet's natural sniffing instincts and slowing fast eaters.",
    price: 399,
    rating: 4.9,
    reviews: 201,
    badge: "Best Seller",
    emoji: "🌿",
    gradient: "from-sage to-cream",
    image: "/products/snufflesafari.jpeg",
    features: ["Machine washable", "Non-slip base", "Multiple hide spots", "Mental stimulation"],
    inStock: true,
  },
  {
    id: "t3",
    slug: "pawmystery",
    name: "PawMystery",
    category: "interactive-toys",
    tagline: "Puzzle toy with hidden compartments",
    description: "A mystery puzzle toy with sliding compartments that challenge pets to find hidden treats. Great for solo play.",
    price: 349,
    rating: 4.7,
    reviews: 98,
    emoji: "🧩",
    gradient: "from-blush to-peach",
    image: "/products/pawmystery.jpeg",
    features: ["Sliding compartments", "Adjustable difficulty", "Durable ABS", "Non-slip"],
    inStock: true,
  },
  {
    id: "t4",
    slug: "wigglewobble",
    name: "WiggleWobble",
    category: "interactive-toys",
    tagline: "Wobble toy that won't tip over",
    description: "A weighted wobble toy that bounces and rolls unpredictably, keeping pets chasing and batting for hours.",
    price: 449,
    rating: 4.6,
    reviews: 76,
    badge: "Premium",
    emoji: "🎯",
    gradient: "from-peach to-blush",
    image: "/products/wigglewobble.jpeg",
    features: ["Weighted base", "Unpredictable motion", "Durable", "Indoor/outdoor"],
    inStock: true,
  },
  {
    id: "t5",
    slug: "pawsensation",
    name: "PawSensation",
    category: "interactive-toys",
    tagline: "Sensory toy with textures and sounds",
    description: "A multi-texture sensory toy with crinkle sounds and varied surfaces that stimulate touch, sight and hearing.",
    price: 249,
    rating: 4.8,
    reviews: 156,
    emoji: "✨",
    gradient: "from-blush to-cream",
    image: "/products/pawsensation.jpeg",
    features: ["Multi-texture", "Crinkle sounds", "Lightweight", "Safe materials"],
    inStock: true,
  },
  {
    id: "t6",
    slug: "lickalicious",
    name: "Lickalicious",
    category: "interactive-toys",
    tagline: "Lick mat for calm, focused pets",
    description: "A textured lick mat that spreads treats or yogurt, promoting calm licking behavior and reducing anxiety.",
    price: 199,
    rating: 4.9,
    reviews: 230,
    badge: "Top Rated",
    emoji: "👅",
    gradient: "from-cream to-peach",
    image: "/products/lickalicious.jpeg",
    features: ["Suction cups", "Dishwasher safe", "Multiple textures", "Calming"],
    inStock: true,
  },
  {
    id: "h1",
    slug: "pawhideout",
    name: "PawHideout",
    category: "pet-houses",
    tagline: "Cozy hideout for rest and play",
    description: "A soft, enclosed hideout that gives pets a safe, warm spot to nap and feel secure.",
    price: 299,
    rating: 4.7,
    reviews: 88,
    emoji: "🏠",
    gradient: "from-sage to-blush",
    image: "/products/pawhideout.jpeg",
    features: ["Soft fabric", "Enclosed design", "Machine washable", "Portable"],
    inStock: true,
  },
  {
    id: "h2",
    slug: "pawhaven",
    name: "PawHaven",
    category: "pet-houses",
    tagline: "Indoor cat house",
    description: "A stylish indoor cat house with a cozy interior and breathable walls, perfect for cats who love a private den.",
    price: 599,
    rating: 4.8,
    reviews: 64,
    badge: "New",
    emoji: "🏠",
    gradient: "from-blush to-sage",
    image: "/products/pawhaven.jpeg",
    features: ["Indoor use", "Breathable fabric", "Cozy interior", "Easy assembly"],
    inStock: true,
  },
  {
    id: "h3",
    slug: "pawnest",
    name: "PawNest",
    category: "pet-houses",
    tagline: "Indoor dog house",
    description: "A comfortable indoor dog house with a sturdy frame and soft cushion, giving dogs their own cozy space.",
    price: 899,
    rating: 4.7,
    reviews: 52,
    emoji: "🛏️",
    gradient: "from-cream to-sage",
    image: "/products/pawnest.jpeg",
    features: ["Indoor use", "Sturdy frame", "Soft cushion", "Easy clean"],
    inStock: true,
  },
  {
    id: "w1",
    slug: "pawfresh",
    name: "PawFresh",
    category: "cat-washrooms",
    tagline: "Cat litter station",
    description: "A modern cat litter station that keeps litter contained and odors managed, with easy access for cleaning.",
    price: 499,
    rating: 4.6,
    reviews: 41,
    emoji: "🛁",
    gradient: "from-peach to-cream",
    image: "/products/pawfresh.jpeg",
    features: ["Odor control", "Easy clean", "Enclosed design", "Durable"],
    inStock: true,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function byCategory(cat: Category) {
  return PRODUCTS.filter((p) => p.category === cat);
}
