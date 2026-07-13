function renderCheckoutSummary() {
  const cart = getCart();
  const summary = document.querySelector("[data-checkout-summary]");

  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = `
      <div class="summary-card">
        <h3>Your cart is empty</h3>
        <p>Please add products before checkout.</p>
        <a href="shop.html" class="btn btn-primary full">Shop Products</a>
      </div>
    `;
    return;
  }

  const totals = calculateCartTotals(cart);

  summary.innerHTML = `
    <div class="summary-card">
      <h3>Order Summary</h3>

      <div class="checkout-products">
        ${cart.map(item => {
          const entity = findCartEntity(item);
          if (!entity) return "";
          const name = item.type === "bundle" ? entity.name : cartItemName(item, entity);
          const price = cartItemPrice(item, entity);
          return `
            <div class="mini-product">
              <img src="${entity.image}" alt="${name}">
              <div>
                <strong>${name}</strong>
                <span>Qty: ${item.quantity}</span>
              </div>
              <b>${formatPrice(price * item.quantity)}</b>
            </div>
          `;
        }).join("")}
      </div>

      <div class="summary-row">
        <span>Subtotal</span>
        <strong>${formatPrice(totals.subtotal)}</strong>
      </div>

      <div class="summary-row">
        <span>Delivery</span>
        <strong>${totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}</strong>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <strong>${formatPrice(totals.total)}</strong>
      </div>
    </div>
  `;
}

function initPaymentNotes() {
  const paymentSelect = document.getElementById("paymentMethod");
  const note = document.querySelector("[data-payment-note]");

  if (!paymentSelect || !note) return;

  const updateNote = () => {
    const value = paymentSelect.value;

    if (value === "Easypaisa Manual Payment") {
      note.innerHTML = `
        <strong>Easypaisa Manual Payment</strong>
        <p>Send payment to: ${STORE_CONFIG.easypaisaNumber}</p>
        <p>After payment, send screenshot on WhatsApp with your order.</p>
      `;
      note.classList.add("show");
      return;
    }

    if (value === "JazzCash Manual Payment") {
      note.innerHTML = `
        <strong>JazzCash Manual Payment</strong>
        <p>Send payment to: ${STORE_CONFIG.jazzcashNumber}</p>
        <p>After payment, send screenshot on WhatsApp with your order.</p>
      `;
      note.classList.add("show");
      return;
    }

    note.innerHTML = `
      <strong>Cash on Delivery</strong>
      <p>You will pay when your parcel is delivered.</p>
    `;
    note.classList.add("show");
  };

  paymentSelect.addEventListener("change", updateNote);
  updateNote();
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function placeOrderOnWhatsApp(event) {
  event.preventDefault();

  const cart = getCart();

  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  const customer = {
    name: getInputValue("name"),
    phone: getInputValue("phone"),
    city: getInputValue("city"),
    address: getInputValue("address"),
    note: getInputValue("note"),
    paymentMethod: document.getElementById("paymentMethod").value
  };

  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    showToast("Please fill all required checkout details");
    return;
  }

  const totals = calculateCartTotals(cart);
  const orderId = `BR-${Date.now().toString().slice(-6)}`;

  let message = `New Order - ${STORE_CONFIG.brandName}%0A`;
  message += `Order ID: ${orderId}%0A%0A`;
  message += `Customer Details:%0A`;
  message += `Name: ${encodeURIComponent(customer.name)}%0A`;
  message += `Phone: ${encodeURIComponent(customer.phone)}%0A`;
  message += `City: ${encodeURIComponent(customer.city)}%0A`;
  message += `Address: ${encodeURIComponent(customer.address)}%0A`;
  message += `Payment Method: ${encodeURIComponent(customer.paymentMethod)}%0A`;

  if (customer.note) {
    message += `Note: ${encodeURIComponent(customer.note)}%0A`;
  }

  message += `%0AProducts:%0A`;

  cart.forEach((item, index) => {
    const entity = findCartEntity(item);
    if (!entity) return;

    const label = item.type === "bundle" ? `${entity.name} (Value Pack)` : cartItemName(item, entity);
    const price = cartItemPrice(item, entity);

    message += `${index + 1}. ${encodeURIComponent(label)}%0A`;
    message += `Qty: ${item.quantity}%0A`;
    message += `Price: ${formatPrice(price)}%0A`;
    message += `Subtotal: ${formatPrice(price * item.quantity)}%0A%0A`;
  });

  message += `Subtotal: ${formatPrice(totals.subtotal)}%0A`;
  message += `Delivery: ${totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}%0A`;
  message += `Total Amount: ${formatPrice(totals.total)}%0A%0A`;

  if (customer.paymentMethod.includes("Manual")) {
    message += `Payment screenshot will be shared on WhatsApp.%0A`;
  }

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");

  showToast("WhatsApp opened with your order details");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();
  initPaymentNotes();

  const form = document.querySelector("[data-checkout-form]");
  form?.addEventListener("submit", placeOrderOnWhatsApp);
});
