function getBundleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const bundleIdFromUrl = Number(params.get("id"));

  if (Number.isFinite(bundleIdFromUrl) && bundleIdFromUrl > 0) {
    return bundleIdFromUrl;
  }

  const bundleIdFromStorage = Number(sessionStorage.getItem("blush_roots_selected_bundle"));
  if (Number.isFinite(bundleIdFromStorage) && bundleIdFromStorage > 0) {
    return bundleIdFromStorage;
  }

  return BUNDLES[0]?.id;
}

function renderBundleDetail() {
  const bundle = findBundle(getBundleIdFromUrl());
  const wrapper = document.querySelector("[data-bundle-detail]");

  if (window.location.search.includes("id=")) {
    window.history.replaceState({}, "", "bundle-detail.html");
  }

  if (!wrapper) return;

  if (!bundle) {
    wrapper.innerHTML = `
      <section class="section">
        <div class="container empty-state">
          <h2>Value pack not found</h2>
          <p>The value pack you are looking for is unavailable.</p>
          <a href="index.html" class="btn btn-primary">Back to Home</a>
        </div>
      </section>
    `;
    return;
  }

  const items = bundle.items || (bundle.itemIds || []).map(findProduct).filter(Boolean);
  const oldPrice = bundlePrice(bundle);
  const savings = bundle.savings || oldPrice - bundle.price;

  document.title = `${bundle.name} | ${STORE_CONFIG.brandName}`;

  wrapper.innerHTML = `
    <section class="page-hero small">
      <div class="container">
        <p class="eyebrow">Value Pack Detail</p>
        <h1>${bundle.name}</h1>
        <p>${bundle.description || ""}</p>
      </div>
    </section>

    <section class="section">
      <div class="container product-detail-grid">
        <div class="detail-image reveal">
          <span class="product-tag">${bundle.tag || ""}</span>
          <img src="${bundle.image}" alt="${bundle.name}" fetchpriority="high" decoding="async">
        </div>

        <div class="detail-content reveal">
          <p class="product-category">Value Pack</p>
          <h2>${bundle.name}</h2>
          <div class="rating-row">${renderStars(bundle.rating, bundle.reviewCount)}</div>

          <div class="price-row detail-price">
            <strong>${formatBundlePrice(bundle.price)}</strong>
            ${oldPrice > bundle.price ? `<span>${formatBundlePrice(oldPrice)}</span>` : ""}
          </div>

          ${savings > 0 ? `<p class="bundle-savings">You Save: ${formatBundlePrice(savings)}</p>` : ""}

          <p class="lead-text">${bundle.description || ""}</p>

          <div class="bundle-includes">
            <strong>What's Included:</strong>
            <ul>
              ${items.map(item => `<li><span>${item.name}</span><span>${formatBundlePrice(item.price)}</span></li>`).join("")}
            </ul>
          </div>

          <div class="quantity-box">
            <label for="quantity">Quantity</label>
            <input id="quantity" type="number" min="1" value="1">
          </div>

          <div class="detail-actions">
            <button class="btn btn-primary" data-add-bundle-detail>Add Value Pack to Cart</button>
            <a href="cart.html" class="btn btn-soft">Go to Cart</a>
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

  document.querySelector("[data-add-bundle-detail]")?.addEventListener("click", () => {
    const quantity = Number(document.getElementById("quantity").value) || 1;
    addBundleToCart(bundle.id, quantity);
  });

  const relatedGrid = document.querySelector("[data-related-bundles]");
  if (relatedGrid) {
    relatedGrid.innerHTML = BUNDLES
      .filter(item => item.id !== bundle.id)
      .slice(0, 3)
      .map(bundleCard)
      .join("");
  }

  rewriteInternalLinks(wrapper);
  initRevealAnimations();
}

whenReady(renderBundleDetail);
