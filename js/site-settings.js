const SITE_SETTINGS_CACHE_KEY = "homy_site_settings_cache";
const THEME_CSS_VARS = [
  "--pink", "--soft-pink", "--rose", "--deep-rose", "--wood", "--cream",
  "--page-bg", "--footer-bg", "--brown", "--muted", "--gold", "--green",
  "--green-soft", "--aqua", "--white"
];

window.SITE_SETTINGS = null;

function applySiteTheme(theme) {
  if (!theme) return;
  THEME_CSS_VARS.forEach(key => {
    if (theme[key]) document.documentElement.style.setProperty(key, theme[key]);
  });
}

(function applyCachedTheme() {
  try {
    const cached = JSON.parse(localStorage.getItem(SITE_SETTINGS_CACHE_KEY));
    if (cached) {
      window.SITE_SETTINGS = cached;
      applySiteTheme(cached.theme);
    }
  } catch {
    // ignore malformed cache
  }
})();

async function loadSiteSettings() {
  try {
    const { data, error } = await supabaseClient.from("site_settings").select("*").eq("id", 1).single();
    if (error) throw error;

    window.SITE_SETTINGS = data;
    applySiteTheme(data.theme);
    localStorage.setItem(SITE_SETTINGS_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to load site settings from Supabase:", error);
  }
}

window.settingsReadyPromise = loadSiteSettings();
