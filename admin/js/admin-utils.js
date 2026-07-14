function resolveAdminImageUrl(url) {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("/") || url.startsWith("data:")) return url;
  return `../${url}`;
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatCurrency(amount) {
  return `Rs.${Number(amount || 0).toLocaleString("en-PK")}.00`;
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

function statusBadge(status) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge badge-${status}">${label}</span>`;
}

function showAdminToast(message, isError = false) {
  let toast = document.querySelector(".admin-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "admin-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.padding = "13px 20px";
    toast.style.borderRadius = "12px";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0 10px 26px rgba(17,17,17,.18)";
    toast.style.zIndex = "200";
    toast.style.transition = "opacity .2s ease, transform .2s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = isError ? "#b3432f" : "#15120f";
  toast.style.color = "#fff";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  window.clearTimeout(window.adminToastTimeout);
  window.adminToastTimeout = window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }, 2600);
}
