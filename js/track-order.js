const ORDER_TRACK_STEPS = [
  { key: "new", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
];

function renderTrackTimeline(status) {
  if (status === "cancelled") {
    return `<div class="order-track-cancelled">This order has been cancelled.</div>`;
  }

  const currentIndex = ORDER_TRACK_STEPS.findIndex(step => step.key === status);

  return `
    <div class="order-track-steps">
      ${ORDER_TRACK_STEPS.map((step, index) => {
        let stateClass = "";
        if (index < currentIndex) stateClass = "done";
        else if (index === currentIndex) stateClass = "current";
        return `
          <div class="order-track-step ${stateClass}">
            <div class="dot">${index < currentIndex ? "&#10003;" : index + 1}</div>
            <span>${step.label}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderTrackResult(order) {
  const resultBox = document.querySelector("[data-track-result]");
  if (!resultBox) return;

  if (!order) {
    resultBox.innerHTML = `
      <div class="track-not-found">
        We couldn't find an order matching that Order ID and phone number. Please double-check both and try again, or message us on WhatsApp for help.
      </div>
    `;
    return;
  }

  const itemsHtml = (order.items || []).map(item => `
    <div class="mini-product">
      <img src="${item.image || ""}" alt="${item.name}">
      <div>
        <strong>${item.name}${item.variant_name ? ` - ${item.variant_name}` : ""}</strong>
        <span>Qty: ${item.quantity}</span>
      </div>
      <b>${formatPrice(item.price * item.quantity)}</b>
    </div>
  `).join("");

  resultBox.innerHTML = `
    <div class="track-order-summary">
      <div class="summary-row">
        <span>Order ID</span>
        <strong>${order.order_code}</strong>
      </div>
      <div class="summary-row">
        <span>Placed On</span>
        <strong>${new Date(order.created_at).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</strong>
      </div>

      ${renderTrackTimeline(order.status)}

      <div class="checkout-products">${itemsHtml}</div>

      <div class="summary-row">
        <span>Subtotal</span>
        <strong>${formatPrice(order.subtotal)}</strong>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <strong>${Number(order.delivery) === 0 ? "Free" : formatPrice(order.delivery)}</strong>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>
    </div>
  `;
}

async function handleTrackSubmit(event) {
  event.preventDefault();

  const orderCode = document.getElementById("trackOrderCode").value.trim();
  const phone = document.getElementById("trackPhone").value.trim();

  if (!orderCode || !phone) {
    showToast("Please enter both your Order ID and phone number");
    return;
  }

  const submitButton = event.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Searching...";

  try {
    const { data, error } = await supabaseClient.rpc("track_order", {
      p_order_code: orderCode,
      p_phone: phone
    });

    if (error) throw error;
    renderTrackResult(data);
  } catch (error) {
    console.error("Failed to track order:", error);
    showToast("Something went wrong. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Track Order";
  }
}

whenReady(() => {
  const form = document.querySelector("[data-track-order-form]");
  form?.addEventListener("submit", handleTrackSubmit);

  const prefillCode = new URLSearchParams(window.location.search).get("code");
  const prefillPhone = new URLSearchParams(window.location.search).get("phone");

  if (prefillCode) document.getElementById("trackOrderCode").value = prefillCode;
  if (prefillPhone) document.getElementById("trackPhone").value = prefillPhone;

  if (prefillCode && prefillPhone) {
    form?.requestSubmit();
  }
});
