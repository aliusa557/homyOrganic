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

function renderIngredientsMarkup(ingredients) {
  const cleaned = (ingredients || "").trim().replace(/\.$/, "");
  const parts = cleaned.split(",").map(part => part.trim()).filter(Boolean);
  const looksLikeList = parts.length > 1 && parts.every(part => part.length <= 30 && !part.includes("."));

  if (!looksLikeList) {
    return `<p>${ingredients}</p>`;
  }

  return `<ul class="ingredient-chips">${parts.map(part => `<li>${part}</li>`).join("")}</ul>`;
}

function renderQualityMarkup(quality) {
  if (Array.isArray(quality)) {
    return `<ul class="benefit-checklist">${quality.map(item => `<li>${item}</li>`).join("")}</ul>`;
  }
  return `<p>${quality}</p>`;
}

function renderProductDetail() {
  const product = findProduct(getProductIdFromUrl());
  const wrapper = document.querySelector("[data-product-detail]");
  const hasVariants = !!product?.variants?.length;
  const variantOptions = hasVariants
    ? product.variants.map(variant => `<option value="${variant.id}" data-price="${variant.price}">${variant.name} - ${formatPrice(variant.price)}</option>`).join("")
    : "";
  const initialVariant = hasVariants ? findProductVariant(product, null) : null;
  const displayPrice = initialVariant ? initialVariant.price : product?.price;

  if (window.location.search.includes("id=")) {
    window.history.replaceState({}, "", "product-detail.html");
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

  document.title = `${product.name} | ${STORE_CONFIG.brandName}`;

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
          <img src="${product.image}" alt="${product.name}" fetchpriority="high" decoding="async">
        </div>

        <div class="detail-content reveal">
          <p class="product-category">${product.category}${product.size ? ` &middot; ${product.size}` : ""}</p>
          <h2>${product.name}</h2>
          <div class="rating-row">${renderStars(product.rating, product.reviewCount)}</div>

          <div class="price-row detail-price">
            <strong data-detail-price>${formatPrice(displayPrice)}</strong>
            ${!hasVariants && product.oldPrice > product.price ? `<span>${formatPrice(product.oldPrice)}</span>` : ""}
          </div>

          <p class="lead-text">${product.description}</p>

          ${product.variants?.length ? `
            <div class="quantity-box">
              <label for="variant">Size</label>
              <select id="variant">${variantOptions}</select>
            </div>
          ` : ""}

          <div class="quantity-box">
            <label for="quantity">Quantity</label>
            <input id="quantity" type="number" min="1" value="1">
          </div>

          <div class="detail-actions">
            <button class="btn btn-primary" data-add-detail>Add to Cart</button>
            <a href="cart.html" class="btn btn-soft">Go to Cart</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-sm pd-sections">
      <div class="container">
        <div class="pd-section-grid">
          <div class="pd-section reveal">
            <h3 class="pd-section-title">Description</h3>
            <p>${product.description}</p>
          </div>

          <div class="pd-section reveal">
            <h3 class="pd-section-title">Key Benefits</h3>
            <ul class="benefit-checklist">
              ${product.keyBenefits.map(benefit => `<li>${benefit}</li>`).join("")}
            </ul>
          </div>

          <div class="pd-section reveal">
            <h3 class="pd-section-title">Selected Natural Ingredients</h3>
            ${renderIngredientsMarkup(product.ingredients)}
          </div>

          <div class="pd-section reveal">
            <h3 class="pd-section-title">How to Use</h3>
            <p>${product.usage}</p>
          </div>

          <div class="pd-section pd-section-caution reveal">
            <h3 class="pd-section-title">Precautions</h3>
            <ul class="precaution-list">
              ${product.precautions.map(item => `<li>${item}</li>`).join("")}
            </ul>
            ${product.shelfLife ? `<p class="shelf-life"><strong>Shelf Life:</strong> ${product.shelfLife}</p>` : ""}
          </div>

          <div class="pd-section pd-section-quality reveal">
            <h3 class="pd-section-title">Our Quality</h3>
            ${renderQualityMarkup(product.quality)}
          </div>
        </div>
      </div>
    </section>

    <section class="section-sm trust-strip">
      <div class="container">
        <div class="trust-grid reveal">
          <div class="trust-item">
            <strong>Hand-Blended</strong>
            <span>Crafted in small batches for freshness</span>
          </div>
          <div class="trust-item">
            <strong>100% Natural</strong>
            <span>Pure, natural ingredients only</span>
          </div>
          <div class="trust-item">
            <strong>Hygienically Made</strong>
            <span>Strict cleanliness &amp; quality standards</span>
          </div>
          <div class="trust-item">
            <strong>Premium Quality</strong>
            <span>No compromise on quality, ever</span>
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector("[data-add-detail]")?.addEventListener("click", () => {
    const quantity = Number(document.getElementById("quantity").value) || 1;
    addProductToCart(product.id, quantity, document.getElementById("variant")?.value || null);
  });

  document.getElementById("variant")?.addEventListener("change", event => {
    const variant = findProductVariant(product, event.target.value);
    const priceElement = document.querySelector("[data-detail-price]");
    if (variant && priceElement) {
      priceElement.textContent = formatPrice(variant.price);
    }
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

whenReady(renderProductDetail);
