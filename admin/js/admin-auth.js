async function requireAdminSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  const emailEl = document.querySelector("[data-admin-email]");
  if (emailEl) emailEl.textContent = session.user.email;

  return session;
}

function openMobileSidebar() {
  document.querySelector(".sidebar")?.classList.add("open");
  document.querySelector("[data-sidebar-backdrop]")?.classList.add("show");
}

function closeMobileSidebar() {
  document.querySelector(".sidebar")?.classList.remove("open");
  document.querySelector("[data-sidebar-backdrop]")?.classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  requireAdminSession();

  document.querySelector("[data-logout]")?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });

  document.querySelector("[data-admin-menu-toggle]")?.addEventListener("click", openMobileSidebar);
  document.querySelector("[data-sidebar-backdrop]")?.addEventListener("click", closeMobileSidebar);
});
