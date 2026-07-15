let allOffers = [];
let allProductsForOffers = [];
let allBundlesForOffers = [];
let offerFormDirty;

function offerLinkedToLabel(offer) {
  if (offer.product_id) {
    const product = allProductsForOffers.find(item => item.id === offer.product_id);
    return product ? `Product: ${product.name}` : "Product (deleted)";
  }
  if (offer.bundle_id) {
    const bundle = allBundlesForOffers.find(item => item.id === offer.bundle_id);
    return bundle ? `Value Pack: ${bundle.name}` : "Value Pack (deleted)";
  }
  if (offer.custom_link) return `Link: ${offer.custom_link}`;
  return "Shop page";
}

function offerRowHtml(offer, index, total) {
  const statusClass = offer.is_active ? "badge-active" : "badge-inactive";
  const statusLabel = offer.is_active ? "Active" : "Inactive";

  return `
    <tr data-row-id="${offer.id}">
      <td>
        <strong>${escapeHtml(offer.message)}</strong>
        ${offer.discount_percent ? `<div><span class="badge badge-new">${offer.discount_percent}% OFF</span></div>` : ""}
      </td>
      <td>${escapeHtml(offerLinkedToLabel(offer))}</td>
      <td><span class="badge ${statusClass}">${statusLabel}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-move-up="${offer.id}" title="Move up" ${index === 0 ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>
          </button>
          <button class="icon-btn" data-move-down="${offer.id}" title="Move down" ${index === total - 1 ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14"></path><path d="M19 12l-7 7-7-7"></path></svg>
          </button>
          <button class="icon-btn" data-edit="${offer.id}" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path></svg>
          </button>
          <button class="icon-btn" data-toggle="${offer.id}" title="${offer.is_active ? "Deactivate" : "Activate"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"></circle><path d="M9 12l2 2 4-4"></path></svg>
          </button>
          <button class="icon-btn danger" data-delete="${offer.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderOffersTable() {
  const body = document.querySelector("[data-offers-table]");

  if (allOffers.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="4">No offers yet.</td></tr>`;
    return;
  }

  body.innerHTML = allOffers.map((offer, index) => offerRowHtml(offer, index, allOffers.length)).join("");
}

function populateDropdowns() {
  const productSelect = document.querySelector('[data-field="productId"]');
  const bundleSelect = document.querySelector('[data-field="bundleId"]');

  productSelect.innerHTML = '<option value="">None</option>' +
    allProductsForOffers.map(product => `<option value="${product.id}">${escapeHtml(product.name)}</option>`).join("");

  bundleSelect.innerHTML = '<option value="">None</option>' +
    allBundlesForOffers.map(bundle => `<option value="${bundle.id}">${escapeHtml(bundle.name)}</option>`).join("");
}

async function loadOffersData() {
  const [offersResult, productsResult, bundlesResult] = await Promise.all([
    supabaseClient.from("offers").select("*").order("sort_order", { ascending: true }),
    supabaseClient.from("products").select("id, name").order("name"),
    supabaseClient.from("bundles").select("id, name").order("name")
  ]);

  if (offersResult.error) {
    showAdminToast("Failed to load offers", true);
    return;
  }

  allOffers = offersResult.data;
  allProductsForOffers = productsResult.data || [];
  allBundlesForOffers = bundlesResult.data || [];

  populateDropdowns();
  renderOffersTable();
}

function resetOfferForm() {
  const form = document.querySelector("[data-offer-form]");
  form.reset();
  form.querySelector('[data-field="id"]').value = "";
  form.querySelector('[data-field="isActive"]').checked = true;
}

function openOfferModal(offer = null) {
  resetOfferForm();
  const form = document.querySelector("[data-offer-form]");
  document.querySelector("[data-modal-title]").textContent = offer ? "Edit Offer" : "Add Offer";

  if (offer) {
    form.querySelector('[data-field="id"]').value = offer.id;
    form.querySelector('[data-field="message"]').value = offer.message || "";
    form.querySelector('[data-field="discountPercent"]').value = offer.discount_percent ?? "";
    form.querySelector('[data-field="customLink"]').value = offer.custom_link || "";
    form.querySelector('[data-field="productId"]').value = offer.product_id || "";
    form.querySelector('[data-field="bundleId"]').value = offer.bundle_id || "";
    form.querySelector('[data-field="isActive"]').checked = offer.is_active;
  }

  document.querySelector("[data-offer-modal]").classList.add("show");
  offerFormDirty?.reset();
}

function closeOfferModal() {
  document.querySelector("[data-offer-modal]").classList.remove("show");
}

async function attemptCloseOfferModal() {
  if (offerFormDirty?.isDirty()) {
    const confirmed = await showAdminConfirm(
      "You have unsaved changes. Are you sure you want to close without saving?",
      { title: "Unsaved Changes", confirmLabel: "Discard Changes", cancelLabel: "Keep Editing" }
    );
    if (!confirmed) return;
  }
  closeOfferModal();
}

async function handleOfferSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const saveButton = document.querySelector("[data-save-offer]");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const id = form.querySelector('[data-field="id"]').value;
    const productId = form.querySelector('[data-field="productId"]').value;
    const bundleId = form.querySelector('[data-field="bundleId"]').value;

    const payload = {
      message: form.querySelector('[data-field="message"]').value.trim(),
      discount_percent: form.querySelector('[data-field="discountPercent"]').value
        ? Number(form.querySelector('[data-field="discountPercent"]').value)
        : null,
      custom_link: form.querySelector('[data-field="customLink"]').value.trim() || null,
      product_id: productId ? Number(productId) : null,
      bundle_id: bundleId ? Number(bundleId) : null,
      is_active: form.querySelector('[data-field="isActive"]').checked
    };

    if (!id) {
      const maxSortOrder = allOffers.reduce((max, offer) => Math.max(max, offer.sort_order || 0), 0);
      payload.sort_order = maxSortOrder + 1;
    }

    const { error } = id
      ? await supabaseClient.from("offers").update(payload).eq("id", id)
      : await supabaseClient.from("offers").insert(payload);

    if (error) throw error;

    showAdminToast(id ? "Offer updated" : "Offer added");
    offerFormDirty?.reset();
    closeOfferModal();
    await loadOffersData();
  } catch (error) {
    showAdminToast(error.message || "Failed to save offer", true);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Offer";
  }
}

async function swapOfferOrder(indexA, indexB) {
  const offerA = allOffers[indexA];
  const offerB = allOffers[indexB];

  const results = await Promise.all([
    supabaseClient.from("offers").update({ sort_order: offerB.sort_order }).eq("id", offerA.id),
    supabaseClient.from("offers").update({ sort_order: offerA.sort_order }).eq("id", offerB.id)
  ]);

  if (results.some(result => result.error)) {
    showAdminToast("Failed to reorder offers", true);
    return;
  }

  await loadOffersData();
}

async function handleOffersTableClick(event) {
  const editId = event.target.closest("[data-edit]")?.dataset.edit;
  const toggleId = event.target.closest("[data-toggle]")?.dataset.toggle;
  const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
  const moveUpId = event.target.closest("[data-move-up]")?.dataset.moveUp;
  const moveDownId = event.target.closest("[data-move-down]")?.dataset.moveDown;

  if (editId) {
    const offer = allOffers.find(item => String(item.id) === editId);
    if (offer) openOfferModal(offer);
    return;
  }

  if (toggleId) {
    const offer = allOffers.find(item => String(item.id) === toggleId);
    if (!offer) return;
    const { error } = await supabaseClient.from("offers").update({ is_active: !offer.is_active }).eq("id", toggleId);
    if (error) {
      showAdminToast("Failed to update status", true);
      return;
    }
    showAdminToast(offer.is_active ? "Offer deactivated" : "Offer activated");
    await loadOffersData();
    return;
  }

  if (deleteId) {
    const confirmed = await showAdminConfirm("Delete this offer? This cannot be undone.", { title: "Delete Offer?" });
    if (!confirmed) return;
    const { error } = await supabaseClient.from("offers").delete().eq("id", deleteId);
    if (error) {
      showAdminToast("Failed to delete offer", true);
      return;
    }
    showAdminToast("Offer deleted");
    await loadOffersData();
    return;
  }

  if (moveUpId) {
    const index = allOffers.findIndex(item => String(item.id) === moveUpId);
    if (index > 0) await swapOfferOrder(index, index - 1);
    return;
  }

  if (moveDownId) {
    const index = allOffers.findIndex(item => String(item.id) === moveDownId);
    if (index < allOffers.length - 1) await swapOfferOrder(index, index + 1);
  }
}

async function initOffersPage() {
  const session = await requireAdminSession();
  if (!session) return;

  await loadOffersData();

  offerFormDirty = trackFormDirty(document.querySelector("[data-offer-form]"));

  document.querySelector("[data-add-offer]").addEventListener("click", () => openOfferModal());
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", attemptCloseOfferModal));
  document.querySelector("[data-offer-modal]").addEventListener("click", event => {
    if (event.target === event.currentTarget) attemptCloseOfferModal();
  });
  document.querySelector("[data-offer-form]").addEventListener("submit", handleOfferSubmit);
  document.querySelector("[data-offers-table]").addEventListener("click", handleOffersTableClick);

  document.querySelector('[data-field="productId"]').addEventListener("change", event => {
    if (event.target.value) document.querySelector('[data-field="bundleId"]').value = "";
  });

  document.querySelector('[data-field="bundleId"]').addEventListener("change", event => {
    if (event.target.value) document.querySelector('[data-field="productId"]').value = "";
  });
}

document.addEventListener("DOMContentLoaded", initOffersPage);
