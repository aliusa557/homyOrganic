function offerLink(offer) {
  if (offer.custom_link) return offer.custom_link;
  if (offer.product_id) return `product-detail.html?id=${offer.product_id}`;
  if (offer.bundle_id) return `bundle-detail.html?id=${offer.bundle_id}`;
  return "shop.html";
}

function initHeroOfferBadge(offers) {
  const badge = document.querySelector("[data-hero-offer-badge]");
  if (!badge || offers.length === 0) return;

  let activeIndex = 0;

  function showOffer(index) {
    const offer = offers[index];
    badge.setAttribute("href", offerLink(offer));
    badge.innerHTML = `
      ${offer.discount_percent ? `<span class="offer-discount">${offer.discount_percent}% OFF</span>` : ""}
      <span>${offer.message}</span>
    `;

    requestAnimationFrame(() => {
      badge.classList.remove("pop-out");
      badge.classList.add("pop-in");
    });
  }

  badge.classList.add("show");
  showOffer(activeIndex);

  if (offers.length <= 1) return;

  window.setInterval(() => {
    badge.classList.remove("pop-in");
    badge.classList.add("pop-out");

    window.setTimeout(() => {
      activeIndex = (activeIndex + 1) % offers.length;
      showOffer(activeIndex);
    }, 300);
  }, 2800);
}

async function loadOffers() {
  const badge = document.querySelector("[data-hero-offer-badge]");
  if (!badge) return;

  try {
    const { data, error } = await supabaseClient
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) initHeroOfferBadge(data);
  } catch (error) {
    console.error("Failed to load offers:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadOffers);
