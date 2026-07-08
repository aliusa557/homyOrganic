const STORE_CONFIG = {
  brandName: "Homy Organic",
  whatsappNumber: "923257316315",
  easypaisaNumber: "03XX-XXXXXXX",
  jazzcashNumber: "03XX-XXXXXXX",
  deliveryCharge: 250,
  freeDeliveryAbove: 5000
};

const CART_KEY = "blush_roots_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
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

function productCard(product) {
  return `
    <article class="product-card reveal">
      <a href="product-detail.html?id=${product.id}" class="product-image-wrap" aria-label="View ${product.name}">
        <span class="product-tag">${product.tag}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>

      <div class="product-content">
        <p class="product-category">${product.category}</p>
        <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
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
          <a class="btn btn-soft" href="product-detail.html?id=${product.id}">View</a>
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
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
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
  const button = document.querySelector("[data-whatsapp-float]");
  if (!button) return;

  const message = encodeURIComponent("Hello, I want to ask about your organic beauty products.");
  button.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initMobileMenu();
  initRevealAnimations();
  setActiveNav();
  initNewsletter();
  initWhatsAppFloatingButton();
});
