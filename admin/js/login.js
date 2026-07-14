async function redirectIfLoggedIn() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) window.location.href = "index.html";
}

function showLoginError(message) {
  const errorBox = document.querySelector("[data-login-error]");
  errorBox.textContent = message;
  errorBox.classList.add("show");
}

async function handleLogin(event) {
  event.preventDefault();

  const submitButton = document.querySelector("[data-login-submit]");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    showLoginError(error.message);
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
    return;
  }

  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  redirectIfLoggedIn();
  document.querySelector("[data-login-form]")?.addEventListener("submit", handleLogin);
});
