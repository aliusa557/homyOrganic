-- Homy Organic - initial seed data
-- Run this once, after schema.sql, in the Supabase SQL editor.
-- It copies the products/bundles that used to be hardcoded in js/products.js,
-- so the live site keeps working the moment it switches to Supabase.
-- Image paths point at the existing local /assets files; replace them with
-- uploaded Supabase Storage URLs any time from the admin panel.

insert into products
  (name, slug, category, price, old_price, tag, trademark, size, rating, review_count, image, description, key_benefits, ingredients, usage, precautions, shelf_life, quality, variants)
values
(
  'Signature Hair Oil', 'signature-hair-oil', 'Hair Care', 1450, 1950, 'Hot Sale', true, '200ml', 4.9, 21,
  'assets/products-optimized/signature-hair-oil.webp',
  'A premium herbal infusion blend of natural botanical oils, suitable for home and professional salon use. Crafted for complete hair and scalp care.',
  '["Helps maintain a healthy scalp","Supports healthy hair growth","Helps reduce hair fall","Helps reduce dryness & rough texture","Helps hair look fuller, softer & shinier"]',
  'Signature Hair Oil contains almond oil, coconut oil, mustard oil, pumpkin seed oil, castor oil, sesame oil, Argan oil, vitamin E, and other beneficial oils. Premium herbs are carefully infused to deeply nourish hair, strengthen roots, enhance natural shine, and support healthy growth.',
  'Apply on scalp, massage for 5-10 minutes, leave for 3-4 hours or overnight, then wash. Use 2-3 times a week.',
  '["For external use only.","Perform a patch test before first use.","Avoid contact with eyes; rinse with water if contact occurs.","Discontinue use if irritation occurs.","Store in a cool, dry place away from direct sunlight."]',
  'See packaging for batch and expiry details.',
  '["Chemical-free and safe","Hand blended and fresh","Suitable for all hair types"]',
  null
),
(
  'Glass Glow Face Pack', 'glass-glow-face-pack', 'Skin Care', 1050, 1400, 'Bestseller', true, '75g', 4.7, 18,
  'assets/products-optimized/organic-ubtan-powder.webp',
  'Discover the secret to naturally glowing skin. Our handcrafted Glass Glow Face Pack is carefully blended with traditionally valued botanical ingredients to help cleanse, refresh, and support a healthy-looking complexion. An ideal choice for brides-to-be seeking a natural-looking glow for their special day, and perfect for regular home self-care.',
  '["Deeply cleanses the skin","Provides natural glow and softness","Helps achieve an even skin tone","Helps reduce dead skin and dark spots"]',
  'Almond, sandalwood, Kesu flowers, rose petals, kachur, neem, licorice, amba haldi, rice flour, Multani mitti and other carefully selected natural botanical ingredients.',
  'Mix a suitable amount of the face pack with yogurt, milk, or rose water to make a paste. Apply the paste to the face. Rinse off with plain water after 15-20 minutes. Patch test is recommended for sensitive skin.',
  '["For external use only.","Perform a patch test before use to check for allergic reaction.","Discontinue use if irritation occurs.","Store in a cool, dry place away from direct sunlight."]',
  '3 Months (when stored properly)',
  '["Handcrafted in small batches for freshness","Made from carefully selected natural botanicals","Suitable for all skin types"]',
  null
),
(
  'Signature Spa Soak', 'signature-spa-soak', 'Bath & Spa', 899, 1200, 'New', false, null, 4.8, 4,
  'assets/products-optimized/signature-spa-soak.webp',
  'A Homy Organic bath soak blend of mineral-rich salts, dried rose petals, calendula and mint - designed to turn an everyday bath into a calming, spa-like ritual at home.',
  '["Helps soothe tired muscles and calm the senses","Infused with dried florals and mineral-rich salts","Supports a relaxing, spa-like self-care ritual","Makes a thoughtful gift or personal indulgence"]',
  'Himalayan pink salt, Epsom salt, dried rose petals, calendula, mint, herbal botanicals.',
  'Add 2-3 tablespoons to warm bath water and soak for 15-20 minutes. Rinse after use.',
  '["For external use only.","Avoid use on broken or irritated skin.","Discontinue use if irritation occurs.","Store in a cool, dry place away from moisture."]',
  'See packaging for batch and expiry details.',
  '"Hand-blended in small batches with mineral salts and dried botanicals, packaged in a breathable sachet for a fresh, aromatic soak every time."',
  null
),
(
  'Pure Glow Tea', 'pure-glow-tea', 'Herbal Tea', 1100, 1470, 'Glow', false, null, 4.8, 7,
  'assets/products-optimized/pure-glow-tea.webp',
  'Where Wellness Meets Glow. Homy Organic Pure Glow Tea is a specially crafted herbal wellness blend made with carefully selected natural ingredients. It is designed to support everyday wellness, healthy digestion, and overall well-being. Rich in natural antioxidants, it helps you feel refreshed and supports healthy-looking skin. It is a comforting choice for busy lifestyles and daily self-care.',
  '["Supports healthy-looking skin","Supports healthy digestion and gut comfort","Rich in natural antioxidants to support overall wellness","Helps you feel refreshed"]',
  'Cardamom, cinnamon, fennel seeds, green tea, lemongrass, mint, rose petals, along with other natural ingredients.',
  'Shake well before use to mix the natural ingredients. Boil 250 ml of water and let it cool for about 1 minute until hot but not boiling, around 80-85 C. Add 1 teaspoon of Pure Glow Tea. Do NOT boil again. Cover and steep for 3-4 minutes. Strain and enjoy plain or with honey. Drink 1-2 times daily for overall health and glowing skin. Homy Organic - Pure, Natural, and Premium, for your health and beauty.',
  '["Consult a doctor if pregnant, nursing, or on medication.","Not for children under 12.","Store in a cool, dry place away from sunlight.","Herbal tea blend - not a medicine."]',
  '3 Months',
  '"Crafted from carefully selected natural botanicals, blended in small batches to preserve aroma and freshness for a comforting daily wellness ritual."',
  null
),
(
  'Digest Well Powder', 'digest-well-powder', 'Digestive Wellness', 950, 1270, 'Organic', false, '75g', 4.6, 3,
  'assets/products-optimized/herbal-spice-blend.webp',
  'Organic Digest Well Powder is a high-quality herbal formula made from pure natural herbs. It is specially crafted to support healthy digestion and digestive comfort. This formula is prepared in small batches using traditional herbal ingredients and modern quality standards to maintain freshness, purity, and quality.',
  '["Supports healthy digestion","Helps reduce gas, bloating, and indigestion","Helps support stomach comfort","Helps you feel lighter after meals","Supports gut health"]',
  'Cardamom, black seed (Kalonji), fennel, cumin, dry ginger, and a blend of other premium natural ingredients that help soothe the stomach and improve digestion performance.',
  'Take 1 teaspoon twice daily after meals with normal water. This product is a safe and natural choice for everyday use.',
  '["For internal use only.","Keep out of reach of children.","Not recommended for children under 12 years of age.","Consult your doctor if pregnant or breastfeeding.","Discontinue use if any allergic reaction occurs.","Do not use if seal is broken.","Store in a cool, dry place away from sunlight."]',
  '4 Months (when stored properly)',
  '["100% natural herbal blend","No artificial flavors, colors, or chemicals","Food supplement - not a medicine"]',
  null
),
(
  'Premium Silk Scrunchie', 'premium-silk-scrunchie', 'Hair Accessories', 150, 220, 'New', false, null, 4.8, 5,
  'assets/products-optimized/premium-silk-scrunchie.webp',
  'The Homy Organic Premium Silk Scrunchie is crafted for everyday comfort, effortless style, and hair protection. Handmade with soft, premium silk, it provides a secure yet gentle hold while helping reduce hair breakage, pulling, and hair creases. Perfect for everyday wear, casual styling, workouts, or bedtime, this elegant hair accessory keeps your hair comfortable, neat, and stylish.',
  '["Gentle on hair","Helps reduce hair breakage","Soft, lightweight & comfortable","Secure hold without pulling","Helps reduce hair creases","Suitable for all hair types","Perfect for everyday wear & styling"]',
  'Premium silk fabric, soft inner elastic.',
  'Use for everyday styling, workouts, casual wear, or bedtime. Wrap gently around hair without pulling too tightly.',
  '["Keep away from sharp objects to protect the silk fabric.","Hand wash gently when needed.","Air dry fully before storage."]',
  '',
  '"Handmade with soft, premium silk for a gentle, comfortable hold that helps protect hair during daily styling."',
  '[{"id":"small","name":"Small","price":150},{"id":"medium","name":"Medium","price":220}]'
);

insert into bundles
  (name, slug, tag, items, original_price, price, savings, rating, review_count, image, description)
values
(
  'Beauty Essentials Value Pack', 'beauty-essentials-value-pack', '30% OFF',
  '[{"name":"Signature Hair Oil","price":1950},{"name":"Glass Glow Face Pack","price":1400},{"name":"Premium Silk Scrunchie (Small)","price":150}]',
  3500, 2450, 1050, 4.9, 12,
  'assets/bundles-optimized/beauty-essentials-value-pack.webp',
  'A complete hair and skin care value pack with a premium silk scrunchie.'
),
(
  'Self-Care Essentials Value Pack', 'self-care-essentials-value-pack', '30% OFF',
  '[{"name":"Signature Hair Oil","price":1950},{"name":"Glass Glow Face Pack","price":1400},{"name":"Signature Spa Soak","price":1200},{"name":"Premium Silk Scrunchie (Small)","price":150}]',
  4700, 3290, 1410, 4.8, 9,
  'assets/bundles-optimized/self-care-essentials-value-pack.webp',
  'A self-care ritual for hair, skin, bath, and everyday beauty essentials.'
),
(
  'Wellness Essentials Value Pack', 'wellness-essentials-value-pack', '30% OFF',
  '[{"name":"Pure Glow Tea","price":1470},{"name":"Digest Well Powder","price":1270}]',
  2740, 1918, 822, 4.8, 7,
  'assets/bundles-optimized/wellness-essentials-value-pack.webp',
  'A simple daily wellness value pack for inner glow and digestive comfort.'
),
(
  'Complete Wellness Value Pack', 'complete-wellness-value-pack', '30% OFF',
  '[{"name":"Signature Hair Oil","price":1950},{"name":"Glass Glow Face Pack","price":1400},{"name":"Signature Spa Soak","price":1200},{"name":"Pure Glow Tea","price":1470},{"name":"Digest Well Powder","price":1270},{"name":"Premium Silk Scrunchie (Medium)","price":220}]',
  7510, 5257, 2253, 4.9, 15,
  'assets/bundles-optimized/complete-wellness-value-pack.webp',
  'The full Homy Organic beauty and wellness ritual in one complete value pack.'
);
