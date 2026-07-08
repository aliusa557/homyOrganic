function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const productIdFromUrl = Number(params.get("id"));

  if (Number.isFinite(productIdFromUrl) && productIdFromUrl > 0) {
    return productIdFromUrl;
  }

  const productIdFromStorage = Number(sessionStorage.getItem("blush_roots_selected_product"));
  if (Number.isFinite(productIdFromStorage) && productIdFromStorage > 0) {
    return productIdFromStorage;
  }

  return PRODUCTS[0].id;
}

function renderProductDetail() {
  const product = findProduct(getProductIdFromUrl());
  const wrapper = document.querySelector("[data-product-detail]");

  if (window.location.search.includes("id=")) {
    window.history.replaceState({}, "", "product-detail");
  }

  if (!wrapper) return;

  if (!product) {
    wrapper.innerHTML = `
      <section class="section">
        <div class="container empty-state">
          <h2>Product not found</h2>
          <p>The product you are looking for is unavailable.</p>
          <a href="shop.html" class="btn btn-primary">Back to Shop</a>
        </div>
      </section>
    `;
    return;
  }

  document.title = `${product.name} | Blush Roots`;

  wrapper.innerHTML = `
    <section class="page-hero small">
      <div class="container">
        <p class="eyebrow">Product Detail</p>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
      </div>
    </section>

    <section class="section">
      <div class="container product-detail-grid">
        <div class="detail-image reveal">
          <span class="product-tag">${product.tag}</span>
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="detail-content reveal">
          <p class="product-category">${product.category}</p>
          <h2>${product.name}</h2>
          <div class="rating-row">${renderStars(product.rating)}</div>

          <div class="price-row detail-price">
            <strong>${formatPrice(product.price)}</strong>
            <span>${formatPrice(product.oldPrice)}</span>
          </div>

          <p class="lead-text">${product.description}</p>

          <div class="quantity-box">
            <label for="quantity">Quantity</label>
            <input id="quantity" type="number" min="1" value="1">
          </div>

          <div class="detail-actions">
            <button class="btn btn-primary" data-add-detail>Add to Cart</button>
            <a href="cart.html" class="btn btn-soft">Go to Cart</a>
          </div>

          <div class="info-card">
            <h3>Ingredients</h3>
            <p>${product.ingredients}</p>
          </div>

          <div class="info-card">
            <h3>How to Use</h3>
            <p>${product.usage}</p>
          </div>

          <div class="notice-box">
            <strong>Note:</strong> Results can vary by skin/hair type. Patch test before use and avoid contact with eyes.
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector("[data-add-detail]")?.addEventListener("click", () => {
    const quantity = Number(document.getElementById("quantity").value) || 1;
    addToCart(product.id, quantity);
  });

  const relatedGrid = document.querySelector("[data-related-products]");
  if (relatedGrid) {
    relatedGrid.innerHTML = PRODUCTS
      .filter(item => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
      .map(productCard)
      .join("");
  }

  rewriteInternalLinks(wrapper);
  initRevealAnimations();
}

document.addEventListener("DOMContentLoaded", renderProductDetail);
