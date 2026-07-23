const SEO_CONFIG = {
  siteUrl: "https://homyorganic.pk",
  siteName: "Homy Organic",
  defaultImage: "assets/brand/homy-organic-logo.webp",
  phone: "+923023735860",
  email: "support@homyorganic.pk",
  locale: "en_PK"
};

const SEO_PAGES = {
  "index.html": {
    title: "Homy Organic | Organic Beauty & Wellness Products in Pakistan",
    description: "Shop premium organic beauty and wellness products from Homy Organic, including herbal hair oil, glass glow face pack, herbal tea, digestive wellness powder, spa soak, and value packs."
  },
  "shop.html": {
    title: "Shop Organic Beauty & Wellness Products | Homy Organic",
    description: "Browse Homy Organic skin care, hair care, herbal tea, digestive wellness, bath and spa products, and organic value packs in Pakistan."
  },
  "about.html": {
    title: "About Homy Organic | Natural Beauty & Wellness",
    description: "Learn about Homy Organic, a Pakistani beauty and wellness brand focused on hand-blended, natural, premium self-care products."
  },
  "contact.html": {
    title: "Contact Homy Organic | WhatsApp Orders & Support",
    description: "Contact Homy Organic for product questions, order support, WhatsApp orders, delivery help, and customer care."
  },
  "cart.html": {
    title: "Shopping Cart | Homy Organic",
    description: "Review your Homy Organic cart and continue to checkout for organic beauty and wellness products.",
    robots: "noindex, follow"
  },
  "checkout.html": {
    title: "Checkout | Homy Organic",
    description: "Complete your Homy Organic order with cash on delivery, Easypaisa, JazzCash, or WhatsApp confirmation.",
    robots: "noindex, follow"
  },
  "track-order.html": {
    title: "Track Your Order | Homy Organic",
    description: "Track your Homy Organic order status using your order ID and phone number.",
    robots: "noindex, follow"
  },
  "shipping-delivery.html": {
    title: "Shipping & Delivery Policy | Homy Organic",
    description: "Read Homy Organic shipping, delivery, cash on delivery, and order processing details."
  },
  "return-exchange-policy.html": {
    title: "Return & Exchange Policy | Homy Organic",
    description: "Read the Homy Organic return and exchange policy for organic beauty and wellness products."
  },
  "privacy-policy.html": {
    title: "Privacy Policy | Homy Organic",
    description: "Read how Homy Organic handles customer privacy, order details, contact information, and website data."
  },
  "product-detail.html": {
    title: "Product Details | Homy Organic",
    description: "View Homy Organic product details, ingredients, usage, benefits, price, and add the product to your cart.",
    robots: "noindex, follow"
  },
  "bundle-detail.html": {
    title: "Value Pack Details | Homy Organic",
    description: "View Homy Organic value pack details, included items, savings, price, and add the bundle deal to your cart.",
    robots: "noindex, follow"
  }
};

function seoPageName() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  return page === "" ? "index.html" : page;
}

function seoAbsoluteUrl(path = "") {
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `${SEO_CONFIG.siteUrl}/${cleanPath}`;
}

function seoCanonicalUrl() {
  const page = seoPageName();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const query = (page === "product-detail.html" || page === "bundle-detail.html") && id ? `?id=${encodeURIComponent(id)}` : "";
  return `${SEO_CONFIG.siteUrl}/${page === "index" ? "index.html" : page}${query}`;
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function setLink(rel, href) {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function setBaseSeo(pageData = SEO_PAGES[seoPageName()] || SEO_PAGES["index.html"]) {
  const canonical = seoCanonicalUrl();
  const image = seoAbsoluteUrl(SEO_CONFIG.defaultImage);

  document.title = pageData.title;
  setMeta('meta[name="description"]', { name: "description", content: pageData.description });
  setMeta('meta[name="robots"]', { name: "robots", content: pageData.robots || "index, follow, max-image-preview:large" });
  setLink("canonical", canonical);

  setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SEO_CONFIG.siteName });
  setMeta('meta[property="og:locale"]', { property: "og:locale", content: SEO_CONFIG.locale });
  setMeta('meta[property="og:title"]', { property: "og:title", content: pageData.title });
  setMeta('meta[property="og:description"]', { property: "og:description", content: pageData.description });
  setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  setMeta('meta[property="og:image"]', { property: "og:image", content: image });

  setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageData.title });
  setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: pageData.description });
  setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
}

function setSiteStructuredData() {
  setJsonLd("seo-organization-schema", {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SEO_CONFIG.siteUrl}/#organization`,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    logo: seoAbsoluteUrl(SEO_CONFIG.defaultImage),
    email: SEO_CONFIG.email,
    telephone: SEO_CONFIG.phone,
    sameAs: typeof STORE_CONFIG !== "undefined" ? STORE_CONFIG.socialLinks.map(link => link.url).filter(url => url && url !== "#") : []
  });

  setJsonLd("seo-website-schema", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO_CONFIG.siteUrl}/#website`,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    publisher: { "@id": `${SEO_CONFIG.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.siteUrl}/shop.html?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  });
}

function setProductSeo(product) {
  const title = `${product.name} | Organic ${product.category} | ${SEO_CONFIG.siteName}`;
  const description = product.description || `Buy ${product.name} from ${SEO_CONFIG.siteName}.`;
  const image = seoAbsoluteUrl(product.image || SEO_CONFIG.defaultImage);
  const canonical = `${SEO_CONFIG.siteUrl}/product-detail.html?id=${encodeURIComponent(product.id)}`;

  setBaseSeo({ title, description, robots: "index, follow, max-image-preview:large" });
  setLink("canonical", canonical);
  setMeta('meta[property="og:type"]', { property: "og:type", content: "product" });
  setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  setMeta('meta[property="og:image"]', { property: "og:image", content: image });
  setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

  setJsonLd("seo-product-schema", {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image,
    description,
    brand: { "@type": "Brand", name: SEO_CONFIG.siteName },
    category: product.category,
    aggregateRating: product.reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: String(product.rating || 5),
      reviewCount: String(product.reviewCount)
    } : undefined,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "PKR",
      price: String(product.variants?.[0]?.price || product.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  });
}

function setBundleSeo(bundle) {
  const title = `${bundle.name} | Bundle Deal | ${SEO_CONFIG.siteName}`;
  const description = bundle.description || `Shop ${bundle.name}, a Homy Organic value pack bundle deal.`;
  const image = seoAbsoluteUrl(bundle.image || SEO_CONFIG.defaultImage);
  const canonical = `${SEO_CONFIG.siteUrl}/bundle-detail.html?id=${encodeURIComponent(bundle.id)}`;

  setBaseSeo({ title, description, robots: "index, follow, max-image-preview:large" });
  setLink("canonical", canonical);
  setMeta('meta[property="og:type"]', { property: "og:type", content: "product" });
  setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  setMeta('meta[property="og:image"]', { property: "og:image", content: image });
  setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

  setJsonLd("seo-bundle-schema", {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    image,
    description,
    brand: { "@type": "Brand", name: SEO_CONFIG.siteName },
    category: "Value Pack",
    aggregateRating: bundle.reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: String(bundle.rating || 5),
      reviewCount: String(bundle.reviewCount)
    } : undefined,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "PKR",
      price: String(bundle.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  });
}

function setItemListSeo() {
  if (seoPageName() !== "shop.html" && seoPageName() !== "index.html") return;

  const products = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).slice(0, 12).map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SEO_CONFIG.siteUrl}/product-detail.html?id=${encodeURIComponent(product.id)}`,
    name: product.name
  }));

  if (products.length) {
    setJsonLd("seo-itemlist-schema", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products
    });
  }
}

function initSeo() {
  setBaseSeo();
  setSiteStructuredData();

  Promise.all([window.storeReadyPromise || Promise.resolve(), window.settingsReadyPromise || Promise.resolve()]).then(() => {
    if (typeof applySiteSettingsToConfig === "function") applySiteSettingsToConfig();
    setSiteStructuredData();

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    if (seoPageName() === "product-detail.html" && Number.isFinite(id)) {
      const product = typeof findProduct === "function" ? findProduct(id) : null;
      if (product) setProductSeo(product);
    }

    if (seoPageName() === "bundle-detail.html" && Number.isFinite(id)) {
      const bundle = typeof findBundle === "function" ? findBundle(id) : null;
      if (bundle) setBundleSeo(bundle);
    }

    setItemListSeo();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSeo);
} else {
  initSeo();
}
