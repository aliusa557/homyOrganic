const INSTAGRAM_URL = "https://www.instagram.com/homyorganicpk?igsh=MzBiamtkYXJneW14";
const INSTAGRAM_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.16.55.55.9 1.11 1.16 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.16 1.77 4.9 4.9 0 0 1-1.77 1.16c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.16-1.77a4.9 4.9 0 0 1 1.77-1.16c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 3.5A6.5 6.5 0 1 0 12 18.5 6.5 6.5 0 0 0 12 5.5Zm0 2A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm6.75-2.9a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg>`;

document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.querySelector("[data-featured-products]");
  const bundleGrid = document.querySelector("[data-bundles]");
  const hotSaleSpotlight = document.querySelector("[data-hot-sale-spotlight]");
  const instaGrid = document.querySelector("[data-insta-grid]");

  if (featuredGrid) {
    featuredGrid.innerHTML = PRODUCTS.map(productCard).join("");
  }

  if (bundleGrid) {
    bundleGrid.innerHTML = BUNDLES.map(bundleCard).join("");
  }

  if (instaGrid) {
    const gallery = [...PRODUCTS, ...PRODUCTS].slice(0, 6);
    instaGrid.innerHTML = gallery.map(product => `
      <a class="insta-tile reveal" href="${INSTAGRAM_URL}" target="_blank" rel="noopener" aria-label="View ${product.name} on Instagram">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${INSTAGRAM_ICON}
      </a>
    `).join("");
  }

  if (hotSaleSpotlight) {
    const hotProduct = PRODUCTS.find(product => product.tag === "Hot Sale") || PRODUCTS[0];
    const discount = discountPercent(hotProduct);

    hotSaleSpotlight.innerHTML = `
      <div class="hot-sale-image">
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ""}
        <img src="${hotProduct.image}" alt="${hotProduct.name}">
      </div>
      <div class="hot-sale-content">
        <p class="eyebrow">Hot Sale</p>
        <h2>${hotProduct.name}</h2>
        <p>${hotProduct.description}</p>
        <div class="price-row detail-price">
          <strong>${formatPrice(hotProduct.price)}</strong>
          <span>${formatPrice(hotProduct.oldPrice)}</span>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="addToCart(${hotProduct.id})">Add to Cart</button>
          <a class="btn btn-soft" href="product-detail.html" data-product-id="${hotProduct.id}">View Product</a>
        </div>
      </div>
    `;
  }

  rewriteInternalLinks();
  initRevealAnimations();
});
