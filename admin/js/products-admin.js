let allProducts = [];
let editingImageUrl = "";

function productRowHtml(product) {
  const statusClass = product.is_active ? "badge-active" : "badge-inactive";
  const statusLabel = product.is_active ? "Active" : "Inactive";

  return `
    <tr data-row-id="${product.id}">
      <td>
        <div class="cell-product">
          <img src="${escapeHtml(resolveAdminImageUrl(product.image))}" alt="">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <span>${escapeHtml(product.tag || "")}</span>
          </div>
        </div>
      </td>
      <td>${escapeHtml(product.category)}</td>
      <td>${formatCurrency(product.price)}</td>
      <td><span class="badge ${statusClass}">${statusLabel}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-edit="${product.id}" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path></svg>
          </button>
          <button class="icon-btn" data-toggle="${product.id}" title="${product.is_active ? "Deactivate" : "Activate"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"></circle><path d="M9 12l2 2 4-4"></path></svg>
          </button>
          <button class="icon-btn danger" data-delete="${product.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function renderProductsTable(list) {
  const body = document.querySelector("[data-products-table]");

  if (list.length === 0) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No products found.</td></tr>`;
    return;
  }

  body.innerHTML = list.map(productRowHtml).join("");
}

async function loadProducts() {
  const { data, error } = await supabaseClient.from("products").select("*").order("id", { ascending: false });

  if (error) {
    showAdminToast("Failed to load products", true);
    return;
  }

  allProducts = data;
  renderProductsTable(allProducts);
}

function filterProducts() {
  const term = document.querySelector("[data-product-search]").value.toLowerCase().trim();
  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
  );
  renderProductsTable(filtered);
}

function addVariantRow(name = "", price = "") {
  const container = document.querySelector("[data-variant-rows]");
  const row = document.createElement("div");
  row.className = "variant-row";
  row.innerHTML = `
    <input type="text" placeholder="Variant name (e.g. Small)" class="variant-name" value="${escapeHtml(name)}">
    <input type="number" step="0.01" placeholder="Price" class="variant-price" value="${escapeHtml(price)}">
    <button type="button" class="icon-btn danger" data-remove-variant>&times;</button>
  `;
  row.querySelector("[data-remove-variant]").addEventListener("click", () => row.remove());
  container.appendChild(row);
}

function resetProductForm() {
  const form = document.querySelector("[data-product-form]");
  form.reset();
  form.querySelector('[data-field="id"]').value = "";
  document.querySelector("[data-variant-rows]").innerHTML = "";
  document.querySelector("[data-image-preview]").src = "";
  editingImageUrl = "";
  document.querySelector('[data-field="isActive"]').checked = true;
}

function openProductModal(product = null) {
  resetProductForm();
  const form = document.querySelector("[data-product-form]");
  document.querySelector("[data-modal-title]").textContent = product ? "Edit Product" : "Add Product";

  if (product) {
    form.querySelector('[data-field="id"]').value = product.id;
    form.querySelector('[data-field="name"]').value = product.name || "";
    form.querySelector('[data-field="slug"]').value = product.slug || "";
    form.querySelector('[data-field="category"]').value = product.category || "";
    form.querySelector('[data-field="tag"]').value = product.tag || "";
    form.querySelector('[data-field="price"]').value = product.price ?? "";
    form.querySelector('[data-field="oldPrice"]').value = product.old_price ?? "";
    form.querySelector('[data-field="size"]').value = product.size || "";
    form.querySelector('[data-field="shelfLife"]').value = product.shelf_life || "";
    form.querySelector('[data-field="rating"]').value = product.rating ?? "";
    form.querySelector('[data-field="reviewCount"]').value = product.review_count ?? "";
    form.querySelector('[data-field="trademark"]').checked = !!product.trademark;
    form.querySelector('[data-field="description"]').value = product.description || "";
    form.querySelector('[data-field="keyBenefits"]').value = (product.key_benefits || []).join("\n");
    form.querySelector('[data-field="ingredients"]').value = product.ingredients || "";
    form.querySelector('[data-field="usage"]').value = product.usage || "";
    form.querySelector('[data-field="precautions"]').value = (product.precautions || []).join("\n");
    form.querySelector('[data-field="quality"]').value = Array.isArray(product.quality)
      ? product.quality.join("\n")
      : (product.quality || "");
    form.querySelector('[data-field="isActive"]').checked = product.is_active;
    form.querySelector('[data-field="image"]').value = product.image || "";
    editingImageUrl = product.image || "";
    document.querySelector("[data-image-preview]").src = resolveAdminImageUrl(product.image);

    (product.variants || []).forEach(variant => addVariantRow(variant.name, variant.price));
  }

  document.querySelector("[data-product-modal]").classList.add("show");
}

function closeProductModal() {
  document.querySelector("[data-product-modal]").classList.remove("show");
}

async function uploadProductImage(file) {
  const path = `products/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${file.name.match(/\.[^.]+$/)?.[0] || ""}`;
  const { error } = await supabaseClient.storage.from("product-images").upload(path, file);
  if (error) throw error;

  const { data } = supabaseClient.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const saveButton = document.querySelector("[data-save-product]");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const imageFile = form.querySelector('[data-field="imageFile"]').files[0];
    let imageUrl = form.querySelector('[data-field="image"]').value.trim() || editingImageUrl;

    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }

    const variants = Array.from(document.querySelectorAll(".variant-row")).map(row => {
      const name = row.querySelector(".variant-name").value.trim();
      const price = Number(row.querySelector(".variant-price").value);
      return { id: slugify(name), name, price };
    }).filter(variant => variant.name && !Number.isNaN(variant.price));

    const id = form.querySelector('[data-field="id"]').value;
    const name = form.querySelector('[data-field="name"]').value.trim();
    const slugInput = form.querySelector('[data-field="slug"]').value.trim();

    const payload = {
      name,
      slug: slugInput || slugify(name),
      category: form.querySelector('[data-field="category"]').value.trim(),
      tag: form.querySelector('[data-field="tag"]').value.trim() || null,
      price: Number(form.querySelector('[data-field="price"]').value),
      old_price: form.querySelector('[data-field="oldPrice"]').value ? Number(form.querySelector('[data-field="oldPrice"]').value) : null,
      size: form.querySelector('[data-field="size"]').value.trim() || null,
      shelf_life: form.querySelector('[data-field="shelfLife"]').value.trim() || null,
      rating: form.querySelector('[data-field="rating"]').value ? Number(form.querySelector('[data-field="rating"]').value) : 5,
      review_count: form.querySelector('[data-field="reviewCount"]').value ? Number(form.querySelector('[data-field="reviewCount"]').value) : 0,
      trademark: form.querySelector('[data-field="trademark"]').checked,
      description: form.querySelector('[data-field="description"]').value.trim(),
      key_benefits: form.querySelector('[data-field="keyBenefits"]').value.split("\n").map(line => line.trim()).filter(Boolean),
      ingredients: form.querySelector('[data-field="ingredients"]').value.trim() || null,
      usage: form.querySelector('[data-field="usage"]').value.trim() || null,
      precautions: form.querySelector('[data-field="precautions"]').value.split("\n").map(line => line.trim()).filter(Boolean),
      quality: form.querySelector('[data-field="quality"]').value.split("\n").map(line => line.trim()).filter(Boolean),
      variants: variants.length ? variants : null,
      is_active: form.querySelector('[data-field="isActive"]').checked,
      image: imageUrl || null
    };

    const { error } = id
      ? await supabaseClient.from("products").update(payload).eq("id", id)
      : await supabaseClient.from("products").insert(payload);

    if (error) throw error;

    showAdminToast(id ? "Product updated" : "Product added");
    closeProductModal();
    await loadProducts();
  } catch (error) {
    showAdminToast(error.message || "Failed to save product", true);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Product";
  }
}

async function handleTableClick(event) {
  const editId = event.target.closest("[data-edit]")?.dataset.edit;
  const toggleId = event.target.closest("[data-toggle]")?.dataset.toggle;
  const deleteId = event.target.closest("[data-delete]")?.dataset.delete;

  if (editId) {
    const product = allProducts.find(item => String(item.id) === editId);
    if (product) openProductModal(product);
    return;
  }

  if (toggleId) {
    const product = allProducts.find(item => String(item.id) === toggleId);
    if (!product) return;
    const { error } = await supabaseClient.from("products").update({ is_active: !product.is_active }).eq("id", toggleId);
    if (error) {
      showAdminToast("Failed to update status", true);
      return;
    }
    showAdminToast(product.is_active ? "Product deactivated" : "Product activated");
    await loadProducts();
    return;
  }

  if (deleteId) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabaseClient.from("products").delete().eq("id", deleteId);
    if (error) {
      showAdminToast("Failed to delete product", true);
      return;
    }
    showAdminToast("Product deleted");
    await loadProducts();
  }
}

async function initProductsPage() {
  const session = await requireAdminSession();
  if (!session) return;

  await loadProducts();

  document.querySelector("[data-add-product]").addEventListener("click", () => openProductModal());
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", closeProductModal));
  document.querySelector("[data-product-modal]").addEventListener("click", event => {
    if (event.target === event.currentTarget) closeProductModal();
  });
  document.querySelector("[data-product-search]").addEventListener("input", filterProducts);
  document.querySelector("[data-add-variant]").addEventListener("click", () => addVariantRow());
  document.querySelector("[data-product-form]").addEventListener("submit", handleProductSubmit);
  document.querySelector("[data-products-table]").addEventListener("click", handleTableClick);

  document.querySelector('[data-field="imageFile"]').addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) document.querySelector("[data-image-preview]").src = URL.createObjectURL(file);
  });
}

document.addEventListener("DOMContentLoaded", initProductsPage);
