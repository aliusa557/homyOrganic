const PRODUCTS = [
  {
    id: 1,
    name: "Signature Hair Oil",
    slug: "signature-hair-oil",
    category: "Hair Care",
    price: 1450,
    oldPrice: 1950,
    tag: "Hot Sale",
    rating: 4.9,
    reviewCount: 21,
    image: "assets/products-optimized/signature-hair-oil.webp",
    description: "A premium herbal infusion blend of natural botanical oils, suitable for home and professional salon use. Crafted for complete hair and scalp care.",
    keyBenefits: [
      "Helps maintain a healthy scalp",
      "Supports healthy hair growth",
      "Helps reduce hair fall",
      "Helps reduce dryness & rough texture",
      "Helps hair look fuller, softer & shinier"
    ],
    ingredients: "A nourishing herbal infusion of natural carrier oils and botanical extracts, thoughtfully blended for complete hair and scalp care.",
    usage: "Massage into the scalp and hair roots 2-3 times weekly. Leave for at least 2 hours or overnight, then wash.",
    precautions: [
      "For external use only.",
      "Perform a patch test before first use.",
      "Avoid contact with eyes; rinse with water if contact occurs.",
      "Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from direct sunlight."
    ],
    shelfLife: "See packaging for batch and expiry details.",
    quality: "Formulated in small batches with carefully selected natural ingredients, suitable for both home and professional salon use, to help preserve freshness and potency."
  },
  {
    id: 2,
    name: "Pure Glow Tea",
    slug: "pure-glow-tea",
    category: "Herbal Tea",
    price: 1100,
    oldPrice: 1470,
    tag: "Glow",
    rating: 4.8,
    reviewCount: 7,
    image: "assets/products-optimized/pure-glow-tea.webp",
    description: "Homy Organic Pure Glow Tea is a specially crafted herbal wellness blend made with carefully selected natural ingredients. It is designed to support everyday wellness, healthy digestion, and overall well-being. Rich in natural antioxidants, it helps you feel refreshed and supports healthy-looking skin. It is a comforting choice for busy lifestyles and daily self-care.",
    keyBenefits: [
      "Supports healthy-looking skin",
      "Supports healthy digestion and gut comfort",
      "Rich in natural antioxidants to support overall wellness",
      "Helps you feel refreshed"
    ],
    ingredients: "Rose petals, mint, fennel, cinnamon, cardamom, herbal botanicals.",
    usage: "Steep 1 teaspoon in hot water for 5-7 minutes. Strain and enjoy warm.",
    precautions: [
      "Consult a doctor if pregnant, nursing, or on medication.",
      "Not for children under 12.",
      "Store in a cool, dry place away from sunlight.",
      "Herbal tea blend — not a medicine."
    ],
    shelfLife: "4 Months",
    quality: "Crafted from carefully selected natural botanicals, blended in small batches to preserve aroma and freshness for a comforting daily wellness ritual."
  },
  {
    id: 3,
    name: "Glass Glow Face Pack",
    slug: "glass-glow-face-pack",
    category: "Skin Care",
    price: 1050,
    oldPrice: 1400,
    tag: "Bestseller",
    rating: 4.7,
    reviewCount: 18,
    image: "assets/products-optimized/organic-ubtan-powder.webp",
    description: "A Homy Organic ubtan-inspired face pack powder blend, crafted to help skin look fresh, polished, and naturally glowing — a modern glass-skin ritual with a traditional touch.",
    keyBenefits: [
      "Helps skin look fresh, polished & naturally glowing",
      "Gently exfoliates for smoother-looking skin",
      "Inspired by traditional ubtan care rituals",
      "Suitable for regular use as part of a skincare routine"
    ],
    ingredients: "Turmeric, sandalwood, rice, almond, neem, rose petals, herbal powders.",
    usage: "Mix with rose water, milk, or yogurt to form a paste. Apply for 10-15 minutes, then rinse gently.",
    precautions: [
      "For external use only.",
      "Perform a patch test before first use.",
      "Avoid contact with eyes.",
      "Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from moisture."
    ],
    shelfLife: "See packaging for batch and expiry details.",
    quality: "Made from finely milled natural powders, sourced and blended with care to deliver a traditional, trustworthy ubtan experience."
  },
  {
    id: 4,
    name: "Digest Well Powder",
    slug: "digest-well-powder",
    category: "Digestive Wellness",
    price: 950,
    oldPrice: 1270,
    tag: "Organic",
    rating: 4.6,
    reviewCount: 3,
    image: "assets/products-optimized/herbal-spice-blend.webp",
    description: "A premium Homy Organic powdered herbal spice blend made with visible whole spices and natural ingredients, thoughtfully blended to support healthy digestion and everyday comfort.",
    keyBenefits: [
      "Made with visible whole spices & natural ingredients",
      "Supports healthy digestion and gut comfort",
      "Free from artificial fillers",
      "Versatile for cooking & wellness use"
    ],
    ingredients: "Cardamom, cumin, coriander, mint, black seed, ginger, mixed herbs and spices.",
    usage: "Use as directed for your recipe or wellness routine. Store sealed in a cool, dry place.",
    precautions: [
      "Consult a doctor if pregnant, nursing, or on medication.",
      "Store sealed in a cool, dry place away from sunlight.",
      "For culinary and wellness use as directed."
    ],
    shelfLife: "See packaging for batch and expiry details.",
    quality: "Blended from whole, carefully selected spices for authentic flavor and freshness in every batch."
  },
  {
    id: 5,
    name: "Signature Spa Soak",
    slug: "signature-spa-soak",
    category: "Bath & Spa",
    price: 899,
    oldPrice: 1200,
    tag: "New",
    rating: 4.8,
    reviewCount: 4,
    image: "assets/products-optimized/signature-spa-soak.webp",
    description: "A Homy Organic bath soak blend of mineral-rich salts, dried rose petals, calendula and mint — designed to turn an everyday bath into a calming, spa-like ritual at home.",
    keyBenefits: [
      "Helps soothe tired muscles and calm the senses",
      "Infused with dried florals and mineral-rich salts",
      "Supports a relaxing, spa-like self-care ritual",
      "Makes a thoughtful gift or personal indulgence"
    ],
    ingredients: "Himalayan pink salt, Epsom salt, dried rose petals, calendula, mint, herbal botanicals.",
    usage: "Add 2-3 tablespoons to warm bath water and soak for 15-20 minutes. Rinse after use.",
    precautions: [
      "For external use only.",
      "Avoid use on broken or irritated skin.",
      "Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from moisture."
    ],
    shelfLife: "See packaging for batch and expiry details.",
    quality: "Hand-blended in small batches with mineral salts and dried botanicals, packaged in a breathable sachet for a fresh, aromatic soak every time."
  }
];

const BUNDLES = [
  {
    id: 101,
    name: "Hair & Glow Duo",
    slug: "hair-glow-duo",
    tag: "Bundle & Save",
    itemIds: [1, 3],
    price: 2200,
    rating: 4.9,
    reviewCount: 12,
    image: "assets/products-optimized/signature-hair-oil.webp",
    description: "Signature Hair Oil + Glass Glow Face Pack, bundled together for daily hair and skin care."
  },
  {
    id: 102,
    name: "Wellness Trio",
    slug: "wellness-trio",
    tag: "Bundle & Save",
    itemIds: [2, 4, 5],
    price: 2600,
    rating: 4.8,
    reviewCount: 9,
    image: "assets/products-optimized/pure-glow-tea.webp",
    description: "Pure Glow Tea + Digest Well Powder + Signature Spa Soak — a complete everyday wellness ritual."
  }
];
