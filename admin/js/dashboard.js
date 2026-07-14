async function loadDashboard() {
  const session = await requireAdminSession();
  if (!session) return;

  const [productsCount, ordersResult] = await Promise.all([
    supabaseClient.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabaseClient.from("orders").select("*").order("created_at", { ascending: false })
  ]);

  const orders = ordersResult.data || [];
  const newOrders = orders.filter(order => order.status === "new");
  const revenue = orders
    .filter(order => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  document.querySelector("[data-stat-products]").textContent = productsCount.count ?? 0;
  document.querySelector("[data-stat-orders]").textContent = orders.length;
  document.querySelector("[data-stat-new-orders]").textContent = newOrders.length;
  document.querySelector("[data-stat-revenue]").textContent = formatCurrency(revenue);

  const recentBody = document.querySelector("[data-recent-orders]");
  const recent = orders.slice(0, 6);

  if (recent.length === 0) {
    recentBody.innerHTML = `<tr class="empty-row"><td colspan="5">No orders yet.</td></tr>`;
    return;
  }

  recentBody.innerHTML = recent.map(order => `
    <tr>
      <td>${escapeHtml(order.order_code)}</td>
      <td>${escapeHtml(order.customer_name)}</td>
      <td>${formatCurrency(order.total)}</td>
      <td>${statusBadge(order.status)}</td>
      <td>${formatDate(order.created_at)}</td>
    </tr>
  `).join("");
}

document.addEventListener("DOMContentLoaded", loadDashboard);
