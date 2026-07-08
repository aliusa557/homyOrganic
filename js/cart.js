function renderCart() {
  const cartContainer = document.querySelector("[data-cart-items]");
  const summaryContainer = document.querySelector("[data-cart-summary]");

  if (!cartContainer || !summaryContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add your favorite organic products and come back here.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;

    summaryContainer.innerHTML = `
      <div class="summary-card">
        <h3>Order Summary</h3>
        <p>No items added yet.</p>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = cart.map(item => {
    const product = findProduct(item.id);
    if (!product) return "";

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${product.category}</p>
          <strong>${formatPrice(product.price)}</strong>
        </div>

        <div class="cart-controls">
          <button onclick="changeCartQuantity(${product.id}, -1)" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeCartQuantity(${product.id}, 1)" aria-label="Increase quantity">+</button>
        </div>

        <div class="cart-item-total">
          <strong>${formatPrice(product.price * item.quantity)}</strong>
          <button onclick="removeCartItem(${product.id})">Remove</button>
        </div>
      </article>
    `;
  }).join("");

  const totals = calculateCartTotals(cart);

  summaryContainer.innerHTML = `
    <div class="summary-card">
      <h3>Order Summary</h3>

      <div class="summary-row">
        <span>Subtotal</span>
        <strong>${formatPrice(totals.subtotal)}</strong>
      </div>

      <div class="summary-row">
        <span>Delivery</span>
        <strong>${totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}</strong>
      </div>

      <div class="summary-note">
        Free delivery above ${formatPrice(STORE_CONFIG.freeDeliveryAbove)}
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <strong>${formatPrice(totals.total)}</strong>
      </div>

      <a href="checkout" class="btn btn-primary full">Proceed to Checkout</a>
      <a href="shop.html" class="btn btn-soft full">Continue Shopping</a>
    </div>
  `;
}

function changeCartQuantity(productId, amount) {
  const cart = getCart();
  const item = cart.find(cartItem => Number(cartItem.id) === Number(productId));

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart(cart);
  }

  renderCart();
}

function removeCartItem(productId) {
  removeFromCart(productId);
  renderCart();
  showToast("Product removed from cart");
}

document.addEventListener("DOMContentLoaded", renderCart);
