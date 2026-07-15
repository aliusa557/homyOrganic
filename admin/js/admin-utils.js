function trackFormDirty(formEl) {
  let dirty = false;
  const markDirty = () => { dirty = true; };

  formEl.addEventListener("input", markDirty);
  formEl.addEventListener("change", markDirty);

  return {
    isDirty: () => dirty,
    markDirty,
    reset: () => { dirty = false; }
  };
}

function resolveAdminImageUrl(url) {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("/") || url.startsWith("data:")) return url;
  return `../${url}`;
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isWebpFile(file) {
  return file.type === "image/webp" || /\.webp$/i.test(file.name);
}

function validateWebpSelection(inputEl) {
  const file = inputEl.files[0];
  if (!file) return true;

  if (!isWebpFile(file)) {
    showAdminToast("Only .webp images are allowed. Please choose a .webp file, or paste an image URL instead.", true);
    inputEl.value = "";
    return false;
  }

  return true;
}

async function uploadAdminImage(file, folder) {
  if (!isWebpFile(file)) {
    throw new Error("Only .webp images can be uploaded. Please convert your image to WebP first, or paste an image URL instead.");
  }

  const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
  const path = `${folder}/${Date.now()}-${baseName}.webp`;

  const { error } = await supabaseClient.storage.from("product-images").upload(path, file);
  if (error) throw error;

  const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
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

function showAdminConfirm(message, options = {}) {
  return new Promise(resolve => {
    let overlay = document.querySelector("[data-admin-confirm-overlay]");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.setAttribute("data-admin-confirm-overlay", "");
      overlay.innerHTML = `
        <div class="modal admin-confirm-modal">
          <h2 data-admin-confirm-title></h2>
          <p data-admin-confirm-message></p>
          <div class="modal-footer admin-confirm-actions">
            <button type="button" class="btn btn-outline" data-admin-confirm-cancel></button>
            <button type="button" class="btn btn-solid-danger" data-admin-confirm-ok></button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    overlay.querySelector("[data-admin-confirm-title]").textContent = options.title || "Are you sure?";
    overlay.querySelector("[data-admin-confirm-message]").textContent = message;

    const okButton = overlay.querySelector("[data-admin-confirm-ok]");
    const cancelButton = overlay.querySelector("[data-admin-confirm-cancel]");
    okButton.textContent = options.confirmLabel || "Delete";
    cancelButton.textContent = options.cancelLabel || "Cancel";

    overlay.classList.add("show");

    const cleanup = result => {
      overlay.classList.remove("show");
      okButton.removeEventListener("click", onOk);
      cancelButton.removeEventListener("click", onCancel);
      overlay.removeEventListener("click", onOverlayClick);
      resolve(result);
    };

    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);
    const onOverlayClick = event => {
      if (event.target === overlay) cleanup(false);
    };

    okButton.addEventListener("click", onOk);
    cancelButton.addEventListener("click", onCancel);
    overlay.addEventListener("click", onOverlayClick);
  });
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
