let PRODUCTS = [];
let BUNDLES = [];

function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    trademark: row.trademark,
    size: row.size,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price !== null ? Number(row.old_price) : undefined,
    tag: row.tag,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    image: row.image,
    images: row.images || [],
    description: row.description,
    keyBenefits: row.key_benefits || [],
    ingredients: row.ingredients,
    usage: row.usage,
    precautions: row.precautions || [],
    shelfLife: row.shelf_life,
    quality: row.quality,
    variants: row.variants || undefined
  };
}

function mapBundleRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tag: row.tag,
    items: row.items || [],
    originalPrice: row.original_price !== null ? Number(row.original_price) : undefined,
    price: Number(row.price),
    savings: row.savings !== null ? Number(row.savings) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    image: row.image,
    description: row.description
  };
}

async function loadStoreData() {
  try {
    const [productsResult, bundlesResult] = await Promise.all([
      supabaseClient.from("products").select("*").eq("is_active", true).order("id"),
      supabaseClient.from("bundles").select("*").eq("is_active", true).order("id")
    ]);

    if (productsResult.error) throw productsResult.error;
    if (bundlesResult.error) throw bundlesResult.error;

    PRODUCTS = productsResult.data.map(mapProductRow);
    BUNDLES = bundlesResult.data.map(mapBundleRow);
  } catch (error) {
    console.error("Failed to load store data from Supabase:", error);
  }
}

window.storeReadyPromise = loadStoreData();
