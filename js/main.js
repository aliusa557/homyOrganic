const STORE_CONFIG = {
  brandName: "Homy Organic",
  logoPath: "assets/brand/homy-organic-logo.webp",
  logoFooterPath: "assets/brand/homy-organic-logo-footer.webp",
  footerTagline: "Where Beauty Meets Wellness",
  footerAbout: "All our products are carefully hand-blended in small batches to ensure maximum freshness, quality, and effectiveness.",
  websiteUrl: "#",
  whatsappNumber: "923023735860",
  supportEmail: "support@homyorganic.pk",
  easypaisaNumber: "03XX-XXXXXXX",
  jazzcashNumber: "03XX-XXXXXXX",
  deliveryCharge: 250,
  freeDeliveryAbove: 5000,
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/homyorganicpk?igsh=MzBiamtkYXJneW14" },
    { label: "Facebook", url: "https://web.facebook.com/homyorganicpk?rdid=8prHyIPi17E7Bhng&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F18uskoNihb%2F%3F_rdc%3D1%26_rdr" },
    { label: "TikTok", url: "https://www.tiktok.com/@homyorganic" }
  ]
};

function applySiteSettingsToConfig() {
  const settings = window.SITE_SETTINGS;
  if (!settings) return;

  STORE_CONFIG.brandName = settings.brand_name || STORE_CONFIG.brandName;
  STORE_CONFIG.logoPath = settings.logo_url || STORE_CONFIG.logoPath;
  STORE_CONFIG.logoFooterPath = settings.logo_footer_url || STORE_CONFIG.logoFooterPath;
  STORE_CONFIG.footerTagline = settings.footer_tagline || STORE_CONFIG.footerTagline;
  STORE_CONFIG.footerAbout = settings.footer_about || STORE_CONFIG.footerAbout;
  STORE_CONFIG.whatsappNumber = settings.whatsapp_number || STORE_CONFIG.whatsappNumber;
  STORE_CONFIG.supportEmail = settings.support_email || STORE_CONFIG.supportEmail;
  STORE_CONFIG.easypaisaNumber = settings.easypaisa_number || STORE_CONFIG.easypaisaNumber;
  STORE_CONFIG.jazzcashNumber = settings.jazzcash_number || STORE_CONFIG.jazzcashNumber;

  const socialLinks = [
    settings.social_instagram && { label: "Instagram", url: settings.social_instagram },
    settings.social_facebook && { label: "Facebook", url: settings.social_facebook },
    settings.social_tiktok && { label: "TikTok", url: settings.social_tiktok }
  ].filter(Boolean);

  if (socialLinks.length) STORE_CONFIG.socialLinks = socialLinks;
}

const CART_KEY = "blush_roots_cart";

function whenReady(callback) {
  const run = () => {
    Promise.all([window.storeReadyPromise, window.settingsReadyPromise]).then(callback);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}

if (window.storeReadyPromise) {
  window.storeReadyPromise.then(() => updateCartCount());
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return cart.filter(item => findCartEntity(item));
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function findProduct(productId) {
  return PRODUCTS.find(product => Number(product.id) === Number(productId));
}

function findBundle(bundleId) {
  return BUNDLES.find(bundle => Number(bundle.id) === Number(bundleId));
}

function findCartEntity(item) {
  return item.type === "bundle" ? findBundle(item.id) : findProduct(item.id);
}

function findProductVariant(product, variantId) {
  if (!product?.variants?.length) return null;
  return product.variants.find(variant => variant.id === variantId) || product.variants[0];
}

function cartItemPrice(item, entity = findCartEntity(item)) {
  if (!entity) return 0;
  if (item.type === "bundle") return entity.price;
  return findProductVariant(entity, item.variantId)?.price || entity.price;
}

function cartItemName(item, entity = findCartEntity(item)) {
  if (!entity) return "";
  const variant = item.type === "bundle" ? null : findProductVariant(entity, item.variantId);
  return variant ? `${entity.name} - ${variant.name}` : entity.name;
}

function bundlePrice(bundle) {
  if (bundle.originalPrice) return bundle.originalPrice;
  if (bundle.items) return bundle.items.reduce((sum, item) => sum + (item.price || 0), 0);
  return (bundle.itemIds || []).reduce((sum, id) => sum + (findProduct(id)?.price || 0), 0);
}

function formatPrice(amount) {
  return `Rs.${Number(amount).toLocaleString("en-PK")}.00`;
}

function formatBundlePrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

function calculateCartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const entity = findCartEntity(item);
    if (!entity) return sum;
    return sum + cartItemPrice(item, entity) * item.quantity;
  }, 0);

  const delivery = subtotal === 0 || subtotal >= STORE_CONFIG.freeDeliveryAbove ? 0 : STORE_CONFIG.deliveryCharge;
  return {
    subtotal,
    delivery,
    total: subtotal + delivery
  };
}

function bumpCartLink() {
  document.querySelectorAll(".cart-link").forEach(link => {
    link.classList.remove("bump");
    void link.offsetWidth;
    link.classList.add("bump");
  });
}

function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) return;

  addProductToCart(productId, quantity, product.variants?.[0]?.id || null);
}

function addProductToCart(productId, quantity = 1, variantId = null) {
  const product = findProduct(productId);
  if (!product) return;
  const selectedVariant = findProductVariant(product, variantId);

  const cart = getCart();
  const existing = cart.find(item =>
    item.type !== "bundle" &&
    Number(item.id) === Number(productId) &&
    (item.variantId || null) === (selectedVariant?.id || null)
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ type: "product", id: Number(productId), quantity, variantId: selectedVariant?.id || null });
  }

  saveCart(cart);
  bumpCartLink();
  showToast(`${selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name} added to cart`);
}

function addBundleToCart(bundleId, quantity = 1) {
  const bundle = findBundle(bundleId);
  if (!bundle) return;

  const cart = getCart();
  const existing = cart.find(item => item.type === "bundle" && Number(item.id) === Number(bundleId));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ type: "bundle", id: Number(bundleId), quantity });
  }

  saveCart(cart);
  bumpCartLink();
  showToast(`${bundle.name} added to cart`);
}

function removeFromCart(productId, variantId = undefined, type = undefined) {
  const cart = getCart().filter(item => {
    const sameId = Number(item.id) === Number(productId);
    const sameType = type === undefined || item.type === type;
    const sameVariant = variantId === undefined || (item.variantId || null) === (variantId || null);
    return !(sameId && sameType && sameVariant);
  });
  saveCart(cart);
}

function updateQuantity(productId, quantity, variantId = undefined, type = undefined) {
  const cart = getCart();
  const item = cart.find(cartItem =>
    Number(cartItem.id) === Number(productId) &&
    (type === undefined || cartItem.type === type) &&
    (variantId === undefined || (cartItem.variantId || null) === (variantId || null))
  );

  if (!item) return;

  item.quantity = Math.max(1, Number(quantity));
  saveCart(cart);
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll("[data-cart-count]");
  const totalItems = getCart().reduce((sum, item) => sum + Number(item.quantity), 0);

  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.classList.toggle("has-items", totalItems > 0);
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(window.toastTimeout);
  window.toastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function normalizePagePath(pathname = window.location.pathname) {
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned.split("/").pop() || "index";
}

function rewriteInternalLinks(root = document) {
  root.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    const htmlPages = new Set(["index", "about", "shop", "contact", "cart", "checkout", "product-detail", "bundle-detail", "track-order"]);

    if (htmlPages.has(href)) {
      link.setAttribute("href", `${href}.html`);
    }
  });
}

function productDetailUrl(productId) {
  return `product-detail.html?id=${encodeURIComponent(productId)}`;
}

function setSelectedProductId(productId) {
  sessionStorage.setItem("blush_roots_selected_product", String(productId));
}

function initProductLinks() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-product-id]");
    if (!link) return;

    setSelectedProductId(link.getAttribute("data-product-id"));

    if (!link.getAttribute("href")) {
      event.preventDefault();
      window.location.assign(productDetailUrl(link.getAttribute("data-product-id")));
    }
  });
}

function bundleDetailUrl(bundleId) {
  return `bundle-detail.html?id=${encodeURIComponent(bundleId)}`;
}

function setSelectedBundleId(bundleId) {
  sessionStorage.setItem("blush_roots_selected_bundle", String(bundleId));
}

function initBundleLinks() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-bundle-id]");
    if (!link) return;

    setSelectedBundleId(link.getAttribute("data-bundle-id"));

    if (!link.getAttribute("href")) {
      event.preventDefault();
      window.location.assign(bundleDetailUrl(link.getAttribute("data-bundle-id")));
    }
  });
}

function discountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function reviewText(reviewCount = 0) {
  if (!reviewCount) return "No reviews";
  return `${reviewCount} review${reviewCount === 1 ? "" : "s"}`;
}

function renderStars(rating, reviewCount = 0) {
  const fullStars = Math.round(rating);
  const stars = "&#9733;".repeat(fullStars) + "&#9734;".repeat(5 - fullStars);
  return `<span class="stars" aria-label="${rating} out of 5 stars">${stars}</span><span>${reviewText(reviewCount)}</span>`;
}

function cartIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12l-1 11H7L6 8Z"></path>
      <path d="M9 8a3 3 0 0 1 6 0"></path>
      <path d="M9 13h6"></path>
    </svg>
  `;
}

function eyeIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
      <circle cx="12" cy="12" r="2.5"></circle>
    </svg>
  `;
}

function productCard(product) {
  const discount = discountPercent(product);
  const displayPrice = product.variants?.length ? Math.min(...product.variants.map(variant => variant.price)) : product.price;
  const displayOldPrice = product.variants?.length ? Math.max(...product.variants.map(variant => variant.price)) : product.oldPrice;

  return `
    <article class="product-card reveal">
      <div class="product-image-wrap">
        <span class="product-tag">${product.tag}</span>
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ""}
        <a href="${productDetailUrl(product.id)}" data-product-id="${product.id}" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" onerror="this.closest('.product-image-wrap')?.classList.add('image-failed')">
        </a>
        <div class="product-quick-actions">
          <button class="icon-action" type="button" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">${cartIcon()}</button>
          <a class="icon-action" href="${productDetailUrl(product.id)}" data-product-id="${product.id}" aria-label="View ${product.name}">${eyeIcon()}</a>
        </div>
      </div>

      <div class="product-content">
        <p class="product-category">${product.category}</p>
        <h3><a href="${productDetailUrl(product.id)}" data-product-id="${product.id}">${product.name}</a></h3>

        <div class="rating-row">
          ${renderStars(product.rating, product.reviewCount)}
        </div>

        <div class="price-row">
          <strong>${product.variants?.length ? "From " : ""}${formatPrice(displayPrice)}</strong>
          ${displayOldPrice > displayPrice ? `<span>${formatPrice(displayOldPrice)}</span>` : ""}
        </div>

      </div>
    </article>
  `;
}

function bundleCard(bundle) {
  const oldPrice = bundlePrice(bundle);
  const discount = oldPrice > bundle.price ? Math.round((1 - bundle.price / oldPrice) * 100) : 0;

  return `
    <article class="product-card bundle-card reveal">
      <div class="product-image-wrap">
        <span class="product-tag">${bundle.tag}</span>
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ""}
        <a href="${bundleDetailUrl(bundle.id)}" data-bundle-id="${bundle.id}" aria-label="View ${bundle.name}">
          <img src="${bundle.image}" alt="${bundle.name}" loading="lazy" decoding="async" onerror="this.closest('.product-image-wrap')?.classList.add('image-failed')">
        </a>
      </div>

      <div class="product-content">
        <p class="product-category">Value Pack</p>
        <h3><a href="${bundleDetailUrl(bundle.id)}" data-bundle-id="${bundle.id}">${bundle.name}</a></h3>
        <div class="rating-row">
          ${renderStars(bundle.rating, bundle.reviewCount)}
        </div>

        <div class="price-row">
          <strong>${formatBundlePrice(bundle.price)}</strong>
          <span>${formatBundlePrice(oldPrice)}</span>
        </div>
        <p class="bundle-savings">You Save: ${formatBundlePrice(bundle.savings || oldPrice - bundle.price)}</p>

        <div class="product-actions">
          <button class="btn btn-primary" onclick="addBundleToCart(${bundle.id})">Add Value Pack to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function initMobileMenu() {
  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  if (!menuButton || !nav) return;

  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuButton.classList.toggle("open");
    document.querySelector("[data-search-panel]")?.classList.remove("open");
  });
}

function initSearchToggle() {
  const panel = document.querySelector("[data-search-panel]");
  if (!panel) return;

  document.querySelectorAll("[data-search-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      panel.classList.toggle("open");
      document.querySelector("[data-nav]")?.classList.remove("open");
      document.querySelector("[data-menu-button]")?.classList.remove("open");

      if (panel.classList.contains("open")) {
        panel.querySelector("input")?.focus();
      }
    });
  });
}

function initSearchForm() {
  const form = document.querySelector("[data-search-form]");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = form.querySelector("input").value.trim();
    window.location.href = `shop.html${query ? `?search=${encodeURIComponent(query)}` : ""}`;
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

function setActiveNav() {
  const currentPage = normalizePagePath(window.location.pathname);

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = (link.getAttribute("href") || "").replace(/\/+$/, "");
    const pageName = href.split("/").pop() || "index";
    const isActive = pageName === currentPage || (currentPage === "product-detail" && pageName === "shop") || (currentPage === "" && pageName === "index");
    link.classList.toggle("active", isActive);
  });
}

function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = form.querySelector("input").value.trim();

    if (!email) {
      showToast("Please enter your email address");
      return;
    }

    form.reset();
    showToast("Thank you for joining our beauty list");
  });
}

function initWhatsAppFloatingButton() {
  const message = encodeURIComponent("Hello, I want to ask about your organic beauty products.");
  document.querySelectorAll("[data-whatsapp-float]").forEach(button => {
    button.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
  });
}

function initBranding() {
  document.querySelectorAll("[data-brand-name]").forEach(element => {
    element.textContent = STORE_CONFIG.brandName;
  });

  document.querySelectorAll("[data-brand-logo]").forEach(image => {
    image.src = STORE_CONFIG.logoPath;
    image.alt = `${STORE_CONFIG.brandName} logo`;
  });

  document.querySelectorAll("[data-brand-logo-footer]").forEach(image => {
    image.src = STORE_CONFIG.logoFooterPath;
    image.alt = `${STORE_CONFIG.brandName} logo`;
  });

  document.querySelectorAll("[data-footer-tagline]").forEach(element => {
    element.textContent = STORE_CONFIG.footerTagline;
  });

  document.querySelectorAll("[data-footer-about]").forEach(element => {
    element.textContent = STORE_CONFIG.footerAbout;
  });

  document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-website-link]").forEach(link => {
    link.href = STORE_CONFIG.websiteUrl;
    link.textContent = STORE_CONFIG.websiteUrl === "#" ? "Website" : "Website";
    link.toggleAttribute("aria-disabled", STORE_CONFIG.websiteUrl === "#");
  });
}

function initSocialLinks() {
  const links = STORE_CONFIG.socialLinks
    .map(link => `<a href="${link.url}" target="_blank" rel="noopener" ${link.url === "#" ? 'aria-disabled="true"' : ""}>${link.label}</a>`)
    .join("");

  document.querySelectorAll("[data-social-links]").forEach(container => {
    container.innerHTML = links;
  });
}

function initSupportEmail() {
  document.querySelectorAll("[data-support-email]").forEach(element => {
    element.href = `mailto:${STORE_CONFIG.supportEmail}`;
    element.textContent = STORE_CONFIG.supportEmail;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  rewriteInternalLinks();
  initBranding();
  initSocialLinks();
  initSupportEmail();
  updateCartCount();
  initMobileMenu();
  initSearchToggle();
  initSearchForm();
  initRevealAnimations();
  setActiveNav();
  initNewsletter();
  initWhatsAppFloatingButton();
  initProductLinks();
  initBundleLinks();
});

if (window.settingsReadyPromise) {
  window.settingsReadyPromise.then(() => {
    applySiteSettingsToConfig();
    initBranding();
    initSocialLinks();
    initSupportEmail();
    initWhatsAppFloatingButton();
  });
}
