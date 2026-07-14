let allOrders = [];
let orderItemsByCode = {};
let expandedOrderCode = null;

function orderStatusOptions(current) {
  return ORDER_STATUSES.map(status =>
    `<option value="${status}" ${status === current ? "selected" : ""}>${status.charAt(0).toUpperCase() + status.slice(1)}</option>`
  ).join("");
}

function orderRowsHtml(order) {
  const isExpanded = expandedOrderCode === order.order_code;
  const items = orderItemsByCode[order.order_code] || [];

  const mainRow = `
    <tr>
      <td>
        <button class="icon-btn" data-expand="${order.order_code}" title="View items">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="transform: rotate(${isExpanded ? 90 : 0}deg); transition: transform .15s ease;"><path d="M9 6l6 6-6 6"></path></svg>
        </button>
      </td>
      <td>${escapeHtml(order.order_code)}</td>
      <td>
        <strong>${escapeHtml(order.customer_name)}</strong><br>
        <span style="color:var(--a-muted); font-size:12.5px;">${escapeHtml(order.phone)} &middot; ${escapeHtml(order.city)}</span>
      </td>
      <td>${formatCurrency(order.total)}</td>
      <td>
        <select class="order-status-select" data-status-select="${order.order_code}">
          ${orderStatusOptions(order.status)}
        </select>
      </td>
      <td>${formatDate(order.created_at)}</td>
    </tr>
  `;

  if (!isExpanded) return mainRow;

  const itemsHtml = items.length
    ? items.map(item => `
        <div class="oi">
          <span>${escapeHtml(item.name)}${item.variant_name ? ` - ${escapeHtml(item.variant_name)}` : ""} &times; ${item.quantity}</span>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </div>
      `).join("")
    : `<div class="oi"><span>No item details found.</span></div>`;

  const detailRow = `
    <tr class="order-items-row">
      <td colspan="6">
        <div class="order-items-list">
          ${itemsHtml}
          <div class="oi"><span>Address</span><span>${escapeHtml(order.address)}</span></div>
          <div class="oi"><span>Payment Method</span><span>${escapeHtml(order.payment_method || "-")}</span></div>
          ${order.note ? `<div class="oi"><span>Note</span><span>${escapeHtml(order.note)}</span></div>` : ""}
        </div>
      </td>
    </tr>
  `;

  return mainRow + detailRow;
}

function renderOrdersTable(list) {
  const body = document.querySelector("[data-orders-table]");

  if (list.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">No orders found.</td></tr>`;
    return;
  }

  body.innerHTML = list.map(orderRowsHtml).join("");
}

function applyOrderFilters() {
  const term = document.querySelector("[data-order-search]").value.toLowerCase().trim();
  const status = document.querySelector("[data-status-filter]").value;

  const filtered = allOrders.filter(order => {
    const matchesTerm = !term ||
      order.customer_name.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.order_code.toLowerCase().includes(term);
    const matchesStatus = !status || order.status === status;
    return matchesTerm && matchesStatus;
  });

  renderOrdersTable(filtered);
}

async function loadOrders() {
  const [ordersResult, itemsResult] = await Promise.all([
    supabaseClient.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("order_items").select("*")
  ]);

  if (ordersResult.error) {
    showAdminToast("Failed to load orders", true);
    return;
  }

  allOrders = ordersResult.data;
  orderItemsByCode = {};
  (itemsResult.data || []).forEach(item => {
    if (!orderItemsByCode[item.order_code]) orderItemsByCode[item.order_code] = [];
    orderItemsByCode[item.order_code].push(item);
  });

  applyOrderFilters();
}

async function handleOrdersTableClick(event) {
  const expandCode = event.target.closest("[data-expand]")?.dataset.expand;
  if (expandCode) {
    expandedOrderCode = expandedOrderCode === expandCode ? null : expandCode;
    applyOrderFilters();
  }
}

async function handleStatusChange(event) {
  const select = event.target.closest("[data-status-select]");
  if (!select) return;

  const orderCode = select.dataset.statusSelect;
  const newStatus = select.value;

  const { error } = await supabaseClient.from("orders").update({ status: newStatus }).eq("order_code", orderCode);

  if (error) {
    showAdminToast("Failed to update order status", true);
    return;
  }

  const order = allOrders.find(item => item.order_code === orderCode);
  if (order) order.status = newStatus;
  showAdminToast("Order status updated");
}

async function initOrdersPage() {
  const session = await requireAdminSession();
  if (!session) return;

  await loadOrders();

  document.querySelector("[data-order-search]").addEventListener("input", applyOrderFilters);
  document.querySelector("[data-status-filter]").addEventListener("change", applyOrderFilters);
  document.querySelector("[data-orders-table]").addEventListener("click", handleOrdersTableClick);
  document.querySelector("[data-orders-table]").addEventListener("change", handleStatusChange);
}

document.addEventListener("DOMContentLoaded", initOrdersPage);
