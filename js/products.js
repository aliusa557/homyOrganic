const PRODUCTS = [
  {
    id: 1,
    name: "Signature Hair Oil",
    trademark: true,
    size: "200ml",
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
    ingredients: "Signature Hair Oil contains almond oil, coconut oil, mustard oil, pumpkin seed oil, castor oil, sesame oil, Argan oil, vitamin E, and other beneficial oils. Premium herbs are carefully infused to deeply nourish hair, strengthen roots, enhance natural shine, and support healthy growth.",
    usage: "Apply on scalp, massage for 5-10 minutes, leave for 3-4 hours or overnight, then wash. Use 2-3 times a week.",
    precautions: [
      "For external use only.",
      "Perform a patch test before first use.",
      "Avoid contact with eyes; rinse with water if contact occurs.",
      "Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from direct sunlight."
    ],
    shelfLife: "See packaging for batch and expiry details.",
    quality: [
      "Chemical-free and safe",
      "Hand blended and fresh",
      "Suitable for all hair types"
    ]
  },
  {
    id: 3,
    name: "Glass Glow Face Pack",
    trademark: true,
    size: "75g",
    slug: "glass-glow-face-pack",
    category: "Skin Care",
    price: 1050,
    oldPrice: 1400,
    tag: "Bestseller",
    rating: 4.7,
    reviewCount: 18,
    image: "assets/products-optimized/organic-ubtan-powder.webp",
    description: "Discover the secret to naturally glowing skin. Our handcrafted Glass Glow Face Pack is carefully blended with traditionally valued botanical ingredients to help cleanse, refresh, and support a healthy-looking complexion. An ideal choice for brides-to-be seeking a natural-looking glow for their special day, and perfect for regular home self-care.",
    keyBenefits: [
      "Deeply cleanses the skin",
      "Provides natural glow and softness",
      "Helps achieve an even skin tone",
      "Helps reduce dead skin and dark spots"
    ],
    ingredients: "Almond, sandalwood, Kesu flowers, rose petals, kachur, neem, licorice, amba haldi, rice flour, Multani mitti and other carefully selected natural botanical ingredients.",
    usage: "Mix a suitable amount of the face pack with yogurt, milk, or rose water to make a paste. Apply the paste to the face. Rinse off with plain water after 15-20 minutes. Patch test is recommended for sensitive skin.",
    precautions: [
      "For external use only.",
      "Perform a patch test before use to check for allergic reaction.",
      "Discontinue use if irritation occurs.",
      "Store in a cool, dry place away from direct sunlight."
    ],
    shelfLife: "3 Months (when stored properly)",
    quality: [
      "Handcrafted in small batches for freshness",
      "Made from carefully selected natural botanicals",
      "Suitable for all skin types"
    ]
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
    description: "A Homy Organic bath soak blend of mineral-rich salts, dried rose petals, calendula and mint - designed to turn an everyday bath into a calming, spa-like ritual at home.",
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
    description: "Where Wellness Meets Glow. Homy Organic Pure Glow Tea is a specially crafted herbal wellness blend made with carefully selected natural ingredients. It is designed to support everyday wellness, healthy digestion, and overall well-being. Rich in natural antioxidants, it helps you feel refreshed and supports healthy-looking skin. It is a comforting choice for busy lifestyles and daily self-care.",
    keyBenefits: [
      "Supports healthy-looking skin",
      "Supports healthy digestion and gut comfort",
      "Rich in natural antioxidants to support overall wellness",
      "Helps you feel refreshed"
    ],
    ingredients: "Cardamom, cinnamon, fennel seeds, green tea, lemongrass, mint, rose petals, along with other natural ingredients.",
    usage: "Shake well before use to mix the natural ingredients. Boil 250 ml of water and let it cool for about 1 minute until hot but not boiling, around 80-85 C. Add 1 teaspoon of Pure Glow Tea. Do NOT boil again. Cover and steep for 3-4 minutes. Strain and enjoy plain or with honey. Drink 1-2 times daily for overall health and glowing skin. Homy Organic - Pure, Natural, and Premium, for your health and beauty.",
    precautions: [
      "Consult a doctor if pregnant, nursing, or on medication.",
      "Not for children under 12.",
      "Store in a cool, dry place away from sunlight.",
      "Herbal tea blend - not a medicine."
    ],
    shelfLife: "3 Months",
    quality: "Crafted from carefully selected natural botanicals, blended in small batches to preserve aroma and freshness for a comforting daily wellness ritual."
  },
  {
    id: 4,
    name: "Digest Well Powder",
    size: "75g",
    slug: "digest-well-powder",
    category: "Digestive Wellness",
    price: 950,
    oldPrice: 1270,
    tag: "Organic",
    rating: 4.6,
    reviewCount: 3,
    image: "assets/products-optimized/herbal-spice-blend.webp",
    description: "Organic Digest Well Powder is a high-quality herbal formula made from pure natural herbs. It is specially crafted to support healthy digestion and digestive comfort. This formula is prepared in small batches using traditional herbal ingredients and modern quality standards to maintain freshness, purity, and quality.",
    keyBenefits: [
      "Supports healthy digestion",
      "Helps reduce gas, bloating, and indigestion",
      "Helps support stomach comfort",
      "Helps you feel lighter after meals",
      "Supports gut health"
    ],
    ingredients: "Cardamom, black seed (Kalonji), fennel, cumin, dry ginger, and a blend of other premium natural ingredients that help soothe the stomach and improve digestion performance.",
    usage: "Take 1 teaspoon twice daily after meals with normal water. This product is a safe and natural choice for everyday use.",
    precautions: [
      "For internal use only.",
      "Keep out of reach of children.",
      "Not recommended for children under 12 years of age.",
      "Consult your doctor if pregnant or breastfeeding.",
      "Discontinue use if any allergic reaction occurs.",
      "Do not use if seal is broken.",
      "Store in a cool, dry place away from sunlight."
    ],
    shelfLife: "4 Months (when stored properly)",
    quality: [
      "100% natural herbal blend",
      "No artificial flavors, colors, or chemicals",
      "Food supplement - not a medicine"
    ]
  },
  {
    id: 6,
    name: "Premium Silk Scrunchie",
    slug: "premium-silk-scrunchie",
    category: "Hair Accessories",
    price: 150,
    oldPrice: 220,
    tag: "New",
    rating: 4.8,
    reviewCount: 5,
    image: "assets/products-optimized/premium-silk-scrunchie.webp",
    description: "The Homy Organic Premium Silk Scrunchie is crafted for everyday comfort, effortless style, and hair protection. Handmade with soft, premium silk, it provides a secure yet gentle hold while helping reduce hair breakage, pulling, and hair creases. Perfect for everyday wear, casual styling, workouts, or bedtime, this elegant hair accessory keeps your hair comfortable, neat, and stylish.",
    variants: [
      { id: "small", name: "Small", price: 150 },
      { id: "medium", name: "Medium", price: 220 }
    ],
    keyBenefits: [
      "Gentle on hair",
      "Helps reduce hair breakage",
      "Soft, lightweight & comfortable",
      "Secure hold without pulling",
      "Helps reduce hair creases",
      "Suitable for all hair types",
      "Perfect for everyday wear & styling"
    ],
    ingredients: "Premium silk fabric, soft inner elastic.",
    usage: "Use for everyday styling, workouts, casual wear, or bedtime. Wrap gently around hair without pulling too tightly.",
    precautions: [
      "Keep away from sharp objects to protect the silk fabric.",
      "Hand wash gently when needed.",
      "Air dry fully before storage."
    ],
    shelfLife: "",
    quality: "Handmade with soft, premium silk for a gentle, comfortable hold that helps protect hair during daily styling."
  }

];

const BUNDLES = [
  {
    id: 101,
    name: "Beauty Essentials Value Pack",
    slug: "beauty-essentials-value-pack",
    tag: "30% OFF",
    items: [
      { name: "Signature Hair Oil", price: 1950 },
      { name: "Glass Glow Face Pack", price: 1400 },
      { name: "Premium Silk Scrunchie (Small)", price: 150 }
    ],
    originalPrice: 3500,
    price: 2450,
    savings: 1050,
    rating: 4.9,
    reviewCount: 12,
    image: "assets/bundles-optimized/beauty-essentials-value-pack.webp",
    description: "A complete hair and skin care value pack with a premium silk scrunchie."
  },
  {
    id: 102,
    name: "Self-Care Essentials Value Pack",
    slug: "self-care-essentials-value-pack",
    tag: "30% OFF",
    items: [
      { name: "Signature Hair Oil", price: 1950 },
      { name: "Glass Glow Face Pack", price: 1400 },
      { name: "Signature Spa Soak", price: 1200 },
      { name: "Premium Silk Scrunchie (Small)", price: 150 }
    ],
    originalPrice: 4700,
    price: 3290,
    savings: 1410,
    rating: 4.8,
    reviewCount: 9,
    image: "assets/bundles-optimized/self-care-essentials-value-pack.webp",
    description: "A self-care ritual for hair, skin, bath, and everyday beauty essentials."
  },
  {
    id: 103,
    name: "Wellness Essentials Value Pack",
    slug: "wellness-essentials-value-pack",
    tag: "30% OFF",
    items: [
      { name: "Pure Glow Tea", price: 1470 },
      { name: "Digest Well Powder", price: 1270 }
    ],
    originalPrice: 2740,
    price: 1918,
    savings: 822,
    rating: 4.8,
    reviewCount: 7,
    image: "assets/bundles-optimized/wellness-essentials-value-pack.webp",
    description: "A simple daily wellness value pack for inner glow and digestive comfort."
  },
  {
    id: 104,
    name: "Complete Wellness Value Pack",
    slug: "complete-wellness-value-pack",
    tag: "30% OFF",
    items: [
      { name: "Signature Hair Oil", price: 1950 },
      { name: "Glass Glow Face Pack", price: 1400 },
      { name: "Signature Spa Soak", price: 1200 },
      { name: "Pure Glow Tea", price: 1470 },
      { name: "Digest Well Powder", price: 1270 },
      { name: "Premium Silk Scrunchie (Medium)", price: 220 }
    ],
    originalPrice: 7510,
    price: 5257,
    savings: 2253,
    rating: 4.9,
    reviewCount: 15,
    image: "assets/bundles-optimized/complete-wellness-value-pack.webp",
    description: "The full Homy Organic beauty and wellness ritual in one complete value pack."
  }
];
