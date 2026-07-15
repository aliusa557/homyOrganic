let allBundles = [];
let editingBundleImageUrl = "";
let bundleFormDirty;

function bundleRowHtml(bundle) {
  const statusClass = bundle.is_active ? "badge-active" : "badge-inactive";
  const statusLabel = bundle.is_active ? "Active" : "Inactive";

  return `
    <tr data-row-id="${bundle.id}">
      <td>
        <div class="cell-product">
          <img src="${escapeHtml(resolveAdminImageUrl(bundle.image))}" alt="">
          <div>
            <strong>${escapeHtml(bundle.name)}</strong>
            <span>${escapeHtml(bundle.tag || "")}</span>
          </div>
        </div>
      </td>
      <td>${formatCurrency(bundle.price)}</td>
      <td><span class="badge ${statusClass}">${statusLabel}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-edit="${bundle.id}" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path></svg>
          </button>
          <button class="icon-btn" data-toggle="${bundle.id}" title="${bundle.is_active ? "Deactivate" : "Activate"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"></circle><path d="M9 12l2 2 4-4"></path></svg>
          </button>
          <button class="icon-btn danger" data-delete="${bundle.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderBundlesTable(list) {
  const body = document.querySelector("[data-bundles-table]");

  if (list.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="4">No value packs found.</td></tr>`;
    return;
  }

  body.innerHTML = list.map(bundleRowHtml).join("");
}

async function loadBundles() {
  const { data, error } = await supabaseClient.from("bundles").select("*").order("id", { ascending: false });

  if (error) {
    showAdminToast("Failed to load value packs", true);
    return;
  }

  allBundles = data;
  renderBundlesTable(allBundles);
}

function addItemRow(name = "", price = "") {
  const container = document.querySelector("[data-item-rows]");
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <input type="text" placeholder="Item name" class="item-name" value="${escapeHtml(name)}">
    <input type="number" step="0.01" placeholder="Price" class="item-price" value="${escapeHtml(price)}">
    <button type="button" class="icon-btn danger" data-remove-item>&times;</button>
  `;
  row.querySelector("[data-remove-item]").addEventListener("click", () => row.remove());
  container.appendChild(row);
}

function resetBundleForm() {
  const form = document.querySelector("[data-bundle-form]");
  form.reset();
  form.querySelector('[data-field="id"]').value = "";
  document.querySelector("[data-item-rows]").innerHTML = "";
  document.querySelector("[data-image-preview]").src = "";
  editingBundleImageUrl = "";
  document.querySelector('[data-field="isActive"]').checked = true;
}

function openBundleModal(bundle = null) {
  resetBundleForm();
  const form = document.querySelector("[data-bundle-form]");
  document.querySelector("[data-modal-title]").textContent = bundle ? "Edit Value Pack" : "Add Value Pack";

  if (bundle) {
    form.querySelector('[data-field="id"]').value = bundle.id;
    form.querySelector('[data-field="name"]').value = bundle.name || "";
    form.querySelector('[data-field="slug"]').value = bundle.slug || "";
    form.querySelector('[data-field="tag"]').value = bundle.tag || "";
    form.querySelector('[data-field="price"]').value = bundle.price ?? "";
    form.querySelector('[data-field="originalPrice"]').value = bundle.original_price ?? "";
    form.querySelector('[data-field="savings"]').value = bundle.savings ?? "";
    form.querySelector('[data-field="rating"]').value = bundle.rating ?? "";
    form.querySelector('[data-field="reviewCount"]').value = bundle.review_count ?? "";
    form.querySelector('[data-field="description"]').value = bundle.description || "";
    form.querySelector('[data-field="isActive"]').checked = bundle.is_active;
    form.querySelector('[data-field="image"]').value = bundle.image || "";
    editingBundleImageUrl = bundle.image || "";
    document.querySelector("[data-image-preview]").src = resolveAdminImageUrl(bundle.image);

    (bundle.items || []).forEach(item => addItemRow(item.name, item.price));
  }

  document.querySelector("[data-bundle-modal]").classList.add("show");
  bundleFormDirty?.reset();
}

function closeBundleModal() {
  document.querySelector("[data-bundle-modal]").classList.remove("show");
}

async function attemptCloseBundleModal() {
  if (bundleFormDirty?.isDirty()) {
    const confirmed = await showAdminConfirm(
      "You have unsaved changes. Are you sure you want to close without saving?",
      { title: "Unsaved Changes", confirmLabel: "Discard Changes", cancelLabel: "Keep Editing" }
    );
    if (!confirmed) return;
  }
  closeBundleModal();
}

async function handleBundleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const saveButton = document.querySelector("[data-save-bundle]");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const imageFile = form.querySelector('[data-field="imageFile"]').files[0];
    let imageUrl = form.querySelector('[data-field="image"]').value.trim() || editingBundleImageUrl;

    if (imageFile) {
      imageUrl = await uploadAdminImage(imageFile, "bundles");
    }

    const items = Array.from(document.querySelectorAll(".item-row")).map(row => {
      const name = row.querySelector(".item-name").value.trim();
      const price = Number(row.querySelector(".item-price").value);
      return { name, price };
    }).filter(item => item.name && !Number.isNaN(item.price));

    const id = form.querySelector('[data-field="id"]').value;
    const name = form.querySelector('[data-field="name"]').value.trim();
    const slugInput = form.querySelector('[data-field="slug"]').value.trim();

    const payload = {
      name,
      slug: slugInput || slugify(name),
      tag: form.querySelector('[data-field="tag"]').value.trim() || null,
      price: Number(form.querySelector('[data-field="price"]').value),
      original_price: form.querySelector('[data-field="originalPrice"]').value ? Number(form.querySelector('[data-field="originalPrice"]').value) : null,
      savings: form.querySelector('[data-field="savings"]').value ? Number(form.querySelector('[data-field="savings"]').value) : null,
      rating: form.querySelector('[data-field="rating"]').value ? Number(form.querySelector('[data-field="rating"]').value) : 5,
      review_count: form.querySelector('[data-field="reviewCount"]').value ? Number(form.querySelector('[data-field="reviewCount"]').value) : 0,
      description: form.querySelector('[data-field="description"]').value.trim() || null,
      items,
      is_active: form.querySelector('[data-field="isActive"]').checked,
      image: imageUrl || null
    };

    const { error } = id
      ? await supabaseClient.from("bundles").update(payload).eq("id", id)
      : await supabaseClient.from("bundles").insert(payload);

    if (error) throw error;

    showAdminToast(id ? "Value pack updated" : "Value pack added");
    bundleFormDirty?.reset();
    closeBundleModal();
    await loadBundles();
  } catch (error) {
    showAdminToast(error.message || "Failed to save value pack", true);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Value Pack";
  }
}

async function handleBundleTableClick(event) {
  const editId = event.target.closest("[data-edit]")?.dataset.edit;
  const toggleId = event.target.closest("[data-toggle]")?.dataset.toggle;
  const deleteId = event.target.closest("[data-delete]")?.dataset.delete;

  if (editId) {
    const bundle = allBundles.find(item => String(item.id) === editId);
    if (bundle) openBundleModal(bundle);
    return;
  }

  if (toggleId) {
    const bundle = allBundles.find(item => String(item.id) === toggleId);
    if (!bundle) return;
    const { error } = await supabaseClient.from("bundles").update({ is_active: !bundle.is_active }).eq("id", toggleId);
    if (error) {
      showAdminToast("Failed to update status", true);
      return;
    }
    showAdminToast(bundle.is_active ? "Value pack deactivated" : "Value pack activated");
    await loadBundles();
    return;
  }

  if (deleteId) {
    const confirmed = await showAdminConfirm("Delete this value pack? This cannot be undone.", { title: "Delete Value Pack?" });
    if (!confirmed) return;
    const { error } = await supabaseClient.from("bundles").delete().eq("id", deleteId);
    if (error) {
      showAdminToast("Failed to delete value pack", true);
      return;
    }
    showAdminToast("Value pack deleted");
    await loadBundles();
  }
}

async function initBundlesPage() {
  const session = await requireAdminSession();
  if (!session) return;

  await loadBundles();

  bundleFormDirty = trackFormDirty(document.querySelector("[data-bundle-form]"));

  document.querySelector("[data-add-bundle]").addEventListener("click", () => openBundleModal());
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", attemptCloseBundleModal));
  document.querySelector("[data-bundle-modal]").addEventListener("click", event => {
    if (event.target === event.currentTarget) attemptCloseBundleModal();
  });
  document.querySelector("[data-add-item]").addEventListener("click", () => addItemRow());
  document.querySelector("[data-bundle-form]").addEventListener("submit", handleBundleSubmit);
  document.querySelector("[data-bundles-table]").addEventListener("click", handleBundleTableClick);

  document.querySelector('[data-field="imageFile"]').addEventListener("change", event => {
    if (!validateWebpSelection(event.target)) return;
    const file = event.target.files[0];
    if (file) document.querySelector("[data-image-preview]").src = URL.createObjectURL(file);
  });
}

document.addEventListener("DOMContentLoaded", initBundlesPage);
