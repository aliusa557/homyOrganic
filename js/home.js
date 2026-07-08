document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.querySelector("[data-featured-products]");
  const bestSellerGrid = document.querySelector("[data-best-sellers]");

  if (featuredGrid) {
    featuredGrid.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
  }

  if (bestSellerGrid) {
    const bestSellers = PRODUCTS.filter(product => ["Best Seller", "Popular", "Glow", "Night Care"].includes(product.tag));
    bestSellerGrid.innerHTML = bestSellers.slice(0, 4).map(productCard).join("");
  }

  initRevealAnimations();
});
