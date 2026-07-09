document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.querySelector("[data-featured-products]");
  const bundleGrid = document.querySelector("[data-bundles]");
  const hotSaleSpotlight = document.querySelector("[data-hot-sale-spotlight]");

  if (featuredGrid) {
    featuredGrid.innerHTML = PRODUCTS.map(productCard).join("");
  }

  if (bundleGrid) {
    bundleGrid.innerHTML = BUNDLES.map(bundleCard).join("");
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
