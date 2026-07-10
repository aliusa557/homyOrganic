let filteredProducts = [...PRODUCTS];

function renderProducts() {
  const grid = document.querySelector("[data-product-grid]");
  const count = document.querySelector("[data-product-count]");

  if (!grid) return;

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
  } else {
    grid.innerHTML = filteredProducts.map(productCard).join("");
  }

  if (count) {
    count.textContent = `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;
  }

  initRevealAnimations();
}

function applyFilters() {
  const search = document.querySelector("[data-search]")?.value.toLowerCase().trim() || "";
  const category = document.querySelector("[data-category]")?.value || "All";
  const sort = document.querySelector("[data-sort]")?.value || "featured";

  filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.querySelector("[data-category]");
  const categories = ["All", ...new Set(PRODUCTS.map(product => product.category))];

  if (categorySelect) {
    categorySelect.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join("");
  }

  const searchParam = new URLSearchParams(window.location.search).get("search");
  const searchInput = document.querySelector("[data-search]");
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }

  document.querySelector("[data-search]")?.addEventListener("input", applyFilters);
  document.querySelector("[data-category]")?.addEventListener("change", applyFilters);
  document.querySelector("[data-sort]")?.addEventListener("change", applyFilters);

  applyFilters();
});
