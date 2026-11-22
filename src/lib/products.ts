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
    id: "p1",
    slug: "whisker-wobble-ball",
    name: "Whisker Wobble Ball",
    category: "interactive-toys",
    tagline: "Motion-activated rolling ball with feather tail",
    description:
      "A self-rolling ball that wobbles, chirps and teases with a feather tail. Rechargeable, with 3 play modes and auto-sleep to save battery. Perfect for cats and small dogs.",
    price: 24.99,
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    emoji: "🧶",
    gradient: "from-rose-400 to-pink-600",
    features: ["Rechargeable USB-C", "3 play modes", "Auto-sleep", "Feather tail attachment"],
    inStock: true,
  },
  {
    id: "p2",
    slug: "smart-laser-chaser",
    name: "Smart Laser Chaser",
    category: "interactive-toys",
    tagline: "App-controlled rotating laser for endless chase",
    description:
      "Hands-free laser toy with random patterns that keep cats sprinting. Control speed and pattern from your phone, or set a daily play schedule.",
    price: 39.99,
    rating: 4.7,
    reviews: 198,
    badge: "New",
    emoji: "🔴",
    gradient: "from-fuchsia-500 to-purple-600",
    features: ["App control", "Random patterns", "Daily schedule", "Auto shut-off"],
    inStock: true,
  },
  {
    id: "p3",
    slug: "treat-puzzle-mat",
    name: "Treat Puzzle Mat",
    category: "interactive-toys",
    tagline: "Snuffle mat with hidden pockets for mental stimulation",
    description:
      "A washable snuffle mat with layered pockets that hide treats, slowing down fast eaters and engaging your dog's natural foraging instincts.",
    price: 19.99,
    rating: 4.9,
    reviews: 427,
    emoji: "🧠",
    gradient: "from-amber-400 to-orange-500",
    features: ["Machine washable", "Non-slip base", "2 sizes", "Hides treats"],
    inStock: true,
  },
  {
    id: "p4",
    slug: "feather-frenzy-tower",
    name: "Feather Frenzy Tower",
    category: "interactive-toys",
    tagline: "3-tier track tower with spinning feather",
    description:
      "A multi-level track tower with balls and a spinning feather wand. Encourages batting, chasing and pouncing — great for solo or multi-cat play.",
    price: 29.99,
    rating: 4.6,
    reviews: 156,
    emoji: "🪶",
    gradient: "from-teal-400 to-cyan-600",
    features: ["3 tiers", "Non-slip", "Multi-cat", "Durable ABS"],
    inStock: true,
  },
  {
    id: "p5",
    slug: "cozy-cove-bed",
    name: "Cozy Cove Bed",
    category: "pet-houses",
    tagline: "Donut cuddler with raised rim for security",
    description:
      "Ultra-soft donut bed with a raised rim that supports the head and creates a sense of security. Removable, machine-washable cover.",
    price: 49.99,
    rating: 4.9,
    reviews: 521,
    badge: "Top Rated",
    emoji: "🛏️",
    gradient: "from-rose-300 to-rose-500",
    features: ["Memory foam", "Washable cover", "Non-slip", "4 sizes"],
    inStock: true,
  },
  {
    id: "p6",
    slug: "modern-igloo-house",
    name: "Modern Igloo House",
    category: "pet-houses",
    tagline: "Felt igloo den for cats and small dogs",
    description:
      "A minimalist felt igloo that blends with your decor. Warm, breathable and easy to spot-clean. Includes a reversible cushion.",
    price: 59.99,
    rating: 4.7,
    reviews: 203,
    emoji: "🏔️",
    gradient: "from-slate-400 to-slate-600",
    features: ["Premium felt", "Reversible cushion", "Easy clean", "Stylish"],
    inStock: true,
  },
  {
    id: "p7",
    slug: "outdoor-adventure-kennel",
    name: "Outdoor Adventure Kennel",
    category: "pet-houses",
    tagline: "Weather-resistant elevated outdoor house",
    description:
      "Raised, ventilated outdoor house with a waterproof roof and removable floor. Keeps pets cool in summer and dry in rain.",
    price: 129.99,
    rating: 4.5,
    reviews: 87,
    badge: "Premium",
    emoji: "🏕️",
    gradient: "from-emerald-400 to-green-600",
    features: ["Waterproof roof", "Elevated floor", "Ventilated", "Easy assembly"],
    inStock: true,
  },
  {
    id: "p8",
    slug: "window-perch-hammock",
    name: "Window Perch Hammock",
    category: "pet-houses",
    tagline: "Suction-cup window bed for sun-loving cats",
    description:
      "A sturdy window-mounted hammock that holds up to 30 lbs. Tool-free suction cups, machine-washable pad. Cats love the sun and the view.",
    price: 34.99,
    rating: 4.8,
    reviews: 264,
    emoji: "☀️",
    gradient: "from-yellow-400 to-amber-500",
    features: ["Holds 30 lbs", "Tool-free", "Washable pad", "Strong suction"],
    inStock: true,
  },
  {
    id: "p9",
    slug: "odorlock-litter-box",
    name: "OdorLock Litter Box",
    category: "cat-washrooms",
    tagline: "Enclosed box with carbon filter and scoop holder",
    description:
      "High-sided enclosed litter box with a replaceable carbon filter and built-in scoop holder. Keeps litter in and odors out.",
    price: 44.99,
    rating: 4.7,
    reviews: 341,
    badge: "Best Seller",
    emoji: "📦",
    gradient: "from-indigo-400 to-blue-600",
    features: ["Carbon filter", "Scoop holder", "High sides", "Easy clean"],
    inStock: true,
  },
  {
    id: "p10",
    slug: "self-cleaning-litter-robot",
    name: "Self-Cleaning Litter Robot",
    category: "cat-washrooms",
    tagline: "Automatic sifting litter box with app alerts",
    description:
      "A smart litter box that auto-sifts after each use and sends waste-level alerts to your phone. Fits most clumping litters.",
    price: 199.99,
    rating: 4.8,
    reviews: 129,
    badge: "Premium",
    emoji: "🤖",
    gradient: "from-violet-500 to-indigo-600",
    features: ["Auto-sift", "App alerts", "Waste drawer", "Quiet motor"],
    inStock: true,
  },
  {
    id: "p11",
    slug: "top-entry-litter-box",
    name: "Top-Entry Litter Box",
    category: "cat-washrooms",
    tagline: "Top-entry design reduces tracking and mess",
    description:
      "A top-entry box that traps litter on the lid as cats exit. Includes a replaceable tracking mat and easy-lift lid.",
    price: 32.99,
    rating: 4.6,
    reviews: 178,
    emoji: "🪜",
    gradient: "from-cyan-400 to-teal-600",
    features: ["Top entry", "Tracking mat", "Easy lift", "Sturdy"],
    inStock: true,
  },
  {
    id: "p12",
    slug: "corner-litter-cabinet",
    name: "Corner Litter Cabinet",
    category: "cat-washrooms",
    tagline: "Furniture-style cabinet hiding the litter box",
    description:
      "A stylish cabinet that disguises the litter box as furniture. Ventilated interior, magnetic door and easy-clean tray.",
    price: 89.99,
    rating: 4.7,
    reviews: 95,
    emoji: "🪵",
    gradient: "from-stone-400 to-stone-600",
    features: ["Furniture style", "Ventilated", "Magnetic door", "Easy clean"],
    inStock: true,
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function byCategory(cat: Category) {
  return PRODUCTS.filter((p) => p.category === cat);
}
