const STORE_CONFIG = {
  brandName: "Homy Organic",
  logoPath: "assets/brand/homy-organic-logo.svg",
  websiteUrl: "#",
  whatsappNumber: "923023735860",
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

const CART_KEY = "blush_roots_cart";

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return cart.filter(item => findProduct(item.id));
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

function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

function calculateCartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const product = findProduct(item.id);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const delivery = subtotal === 0 || subtotal >= STORE_CONFIG.freeDeliveryAbove ? 0 : STORE_CONFIG.deliveryCharge;
  return {
    subtotal,
    delivery,
    total: subtotal + delivery
  };
}

function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => Number(item.id) === Number(productId));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: Number(productId), quantity });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => Number(item.id) !== Number(productId));
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(cartItem => Number(cartItem.id) === Number(productId));

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

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  return `<span class="stars">${stars}</span><span>${rating}</span>`;
}

function normalizePagePath(pathname = window.location.pathname) {
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned.split("/").pop() || "index";
}

function rewriteInternalLinks(root = document) {
  root.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    const htmlPages = new Set(["index", "about", "shop", "contact", "cart", "checkout", "product-detail"]);

    if (htmlPages.has(href)) {
      link.setAttribute("href", `${href}.html`);
    }
  });
}

function setSelectedProductId(productId) {
  sessionStorage.setItem("blush_roots_selected_product", String(productId));
}

function initProductLinks() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-product-id]");
    if (!link) return;

    event.preventDefault();
    setSelectedProductId(link.getAttribute("data-product-id"));
    window.location.assign("product-detail.html");
  });
}

function productCard(product) {
  return `
    <article class="product-card reveal">
      <a href="product-detail.html" class="product-image-wrap" data-product-id="${product.id}" aria-label="View ${product.name}">
        <span class="product-tag">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>

      <div class="product-content">
        <p class="product-category">${product.category}</p>
        <h3><a href="product-detail.html" data-product-id="${product.id}">${product.name}</a></h3>
        <p class="product-description">${product.description}</p>

        <div class="rating-row">
          ${renderStars(product.rating)}
        </div>

        <div class="price-row">
          <strong>${formatPrice(product.price)}</strong>
          <span>${formatPrice(product.oldPrice)}</span>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
          <a class="btn btn-soft" href="product-detail.html" data-product-id="${product.id}">View</a>
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

document.addEventListener("DOMContentLoaded", () => {
  rewriteInternalLinks();
  initBranding();
  initSocialLinks();
  updateCartCount();
  initMobileMenu();
  initRevealAnimations();
  setActiveNav();
  initNewsletter();
  initWhatsAppFloatingButton();
  initProductLinks();
});
