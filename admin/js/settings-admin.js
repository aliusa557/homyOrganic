const THEME_FIELDS = [
  { key: "--brown", label: "Primary Text (Brown)" },
  { key: "--deep-rose", label: "Heading Text" },
  { key: "--muted", label: "Muted Text" },
  { key: "--gold", label: "Gold Accent" },
  { key: "--green", label: "Green Accent" },
  { key: "--green-soft", label: "Soft Green Background" },
  { key: "--rose", label: "Rose Accent" },
  { key: "--wood", label: "Wood Accent" },
  { key: "--pink", label: "Pink Accent" },
  { key: "--soft-pink", label: "Soft Pink Background" },
  { key: "--aqua", label: "Aqua Background" },
  { key: "--page-bg", label: "Page Background" },
  { key: "--footer-bg", label: "Footer Background" },
  { key: "--cream", label: "Cream" },
  { key: "--white", label: "White" }
];

const DEFAULT_THEME = {
  "--pink": "#e6d2bf",
  "--soft-pink": "#f6ede0",
  "--rose": "#c89f7a",
  "--deep-rose": "#2b1c10",
  "--wood": "#e6c39b",
  "--cream": "#fdf4e2",
  "--page-bg": "#faf5ec",
  "--footer-bg": "#f7ead3",
  "--brown": "#15120f",
  "--muted": "#625b54",
  "--gold": "#b9853a",
  "--green": "#4f7a5b",
  "--green-soft": "#eaf3ec",
  "--aqua": "#f6f2eb",
  "--white": "#fffefb"
};

const THEME_PRESETS = [
  {
    name: "Ivory & Gold",
    swatches: ["#b9853a", "#4f7a5b", "#2b1c10", "#faf5ec"],
    theme: DEFAULT_THEME
  },
  {
    name: "Rose Blush",
    swatches: ["#8a2a48", "#c76e8a", "#7f9b7a", "#fbe9ee"],
    theme: {
      "--pink": "#f0d4dc", "--soft-pink": "#fde3ea", "--rose": "#d98ca3", "--deep-rose": "#8a2a48",
      "--wood": "#e6c8b8", "--cream": "#fdeef2", "--page-bg": "#fbe9ee", "--footer-bg": "#f6d3dd",
      "--brown": "#3a1420", "--muted": "#8a636d", "--gold": "#c76e8a", "--green": "#7f9b7a",
      "--green-soft": "#eef3ea", "--aqua": "#faeef1", "--white": "#fff8fa"
    }
  },
  {
    name: "Sage Botanical",
    swatches: ["#2c4a2f", "#a68a4c", "#35603f", "#e9f1e2"],
    theme: {
      "--pink": "#dbe6c9", "--soft-pink": "#e5efdd", "--rose": "#a3c08a", "--deep-rose": "#2c4a2f",
      "--wood": "#cddab0", "--cream": "#eff6e8", "--page-bg": "#e9f1e2", "--footer-bg": "#dbe8d2",
      "--brown": "#16241a", "--muted": "#566153", "--gold": "#a68a4c", "--green": "#35603f",
      "--green-soft": "#e3efe4", "--aqua": "#eef4ea", "--white": "#f8fbf5"
    }
  },
  {
    name: "Terracotta Earth",
    swatches: ["#6b3420", "#b3702f", "#6b7d4f", "#f6e5d1"],
    theme: {
      "--pink": "#e9c9ad", "--soft-pink": "#f5ddc4", "--rose": "#c17b53", "--deep-rose": "#6b3420",
      "--wood": "#d9a878", "--cream": "#faeddb", "--page-bg": "#f6e5d1", "--footer-bg": "#efd6b8",
      "--brown": "#291a10", "--muted": "#7a6353", "--gold": "#b3702f", "--green": "#6b7d4f",
      "--green-soft": "#eef1e5", "--aqua": "#f6ede2", "--white": "#fffaf6"
    }
  },
  {
    name: "Ocean Aqua",
    swatches: ["#1f4d4a", "#c98a4a", "#2f7166", "#dcf1ef"],
    theme: {
      "--pink": "#cfe4e2", "--soft-pink": "#dcf0ee", "--rose": "#7fb0ac", "--deep-rose": "#1f4d4a",
      "--wood": "#cfe0d6", "--cream": "#e6f6f4", "--page-bg": "#dcf1ef", "--footer-bg": "#c9e8e4",
      "--brown": "#13292a", "--muted": "#52706f", "--gold": "#c98a4a", "--green": "#2f7166",
      "--green-soft": "#e2f2ec", "--aqua": "#eaf6f4", "--white": "#f4fbfa"
    }
  }
];

let currentSettings = null;
let settingsFormDirty;

function setFieldValue(name, value) {
  const el = document.querySelector(`[data-field="${name}"]`);
  if (el) el.value = value || "";
}

function getFieldValue(name) {
  return document.querySelector(`[data-field="${name}"]`)?.value.trim() || "";
}

function renderThemeGrid(theme) {
  const grid = document.querySelector("[data-theme-grid]");
  grid.innerHTML = THEME_FIELDS.map(field => `
    <div class="field">
      <label>${field.label}</label>
      <input type="color" data-theme-input="${field.key}" value="${theme[field.key] || DEFAULT_THEME[field.key]}">
    </div>
  `).join("");
}

function renderThemePresets() {
  const container = document.querySelector("[data-theme-presets]");
  if (!container) return;

  container.innerHTML = THEME_PRESETS.map((preset, index) => `
    <button type="button" class="theme-preset-card" data-apply-theme-preset="${index}">
      <span class="theme-preset-swatches">
        ${preset.swatches.map(color => `<span style="background:${color}"></span>`).join("")}
      </span>
      <span class="theme-preset-name">${preset.name}</span>
    </button>
  `).join("");

  container.addEventListener("click", event => {
    const button = event.target.closest("[data-apply-theme-preset]");
    if (!button) return;

    const preset = THEME_PRESETS[Number(button.dataset.applyThemePreset)];
    if (!preset) return;

    renderThemeGrid(preset.theme);
    settingsFormDirty?.markDirty();
    showAdminToast(`"${preset.name}" theme applied — click Save Settings to publish it`);
  });
}

function slideRowHtml(slide = {}) {
  return `
    <div class="hero-slide-row" data-slide-row>
      <img class="image-preview" data-slide-preview src="${escapeHtml(resolveAdminImageUrl(slide.image))}" alt="">
      <div class="slide-inputs">
        <input type="hidden" class="slide-image" value="${escapeHtml(slide.image || "")}">
        <input type="file" accept=".webp,image/webp" class="slide-file">
        <input type="text" class="slide-alt" placeholder="Alt text (for accessibility)" value="${escapeHtml(slide.alt || "")}">
      </div>
      <div class="row-actions">
        <button type="button" class="icon-btn" data-move-slide-up title="Move up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>
        </button>
        <button type="button" class="icon-btn" data-move-slide-down title="Move down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14"></path><path d="M19 12l-7 7-7-7"></path></svg>
        </button>
        <button type="button" class="icon-btn danger" data-remove-slide title="Remove">&times;</button>
      </div>
    </div>
  `;
}

function addSlideRow(slide) {
  const container = document.querySelector("[data-hero-slide-rows]");
  container.insertAdjacentHTML("beforeend", slideRowHtml(slide));
}

function wireSlideRowEvents() {
  const container = document.querySelector("[data-hero-slide-rows]");

  container.addEventListener("click", event => {
    const row = event.target.closest("[data-slide-row]");
    if (!row) return;

    if (event.target.closest("[data-remove-slide]")) {
      row.remove();
      settingsFormDirty?.markDirty();
      return;
    }

    if (event.target.closest("[data-move-slide-up]")) {
      const prev = row.previousElementSibling;
      if (prev) container.insertBefore(row, prev);
      settingsFormDirty?.markDirty();
      return;
    }

    if (event.target.closest("[data-move-slide-down]")) {
      const next = row.nextElementSibling;
      if (next) container.insertBefore(next, row);
      settingsFormDirty?.markDirty();
    }
  });

  container.addEventListener("change", event => {
    if (!event.target.classList.contains("slide-file")) return;
    if (!validateWebpSelection(event.target)) return;
    const row = event.target.closest("[data-slide-row]");
    const file = event.target.files[0];
    if (file) row.querySelector("[data-slide-preview]").src = URL.createObjectURL(file);
  });
}

function fillForm(settings) {
  setFieldValue("brandName", settings.brand_name);
  setFieldValue("logoUrl", settings.logo_url);
  setFieldValue("logoFooterUrl", settings.logo_footer_url);
  document.querySelector('[data-image-preview="logo"]').src = resolveAdminImageUrl(settings.logo_url);
  document.querySelector('[data-image-preview="logoFooter"]').src = resolveAdminImageUrl(settings.logo_footer_url);

  setFieldValue("heroHeading", settings.hero_heading);
  document.querySelector("[data-hero-slide-rows]").innerHTML = "";
  (settings.hero_slides || []).forEach(addSlideRow);

  setFieldValue("footerTagline", settings.footer_tagline);
  setFieldValue("footerAbout", settings.footer_about);
  setFieldValue("whatsappNumber", settings.whatsapp_number);
  setFieldValue("supportEmail", settings.support_email);
  setFieldValue("easypaisaNumber", settings.easypaisa_number);
  setFieldValue("jazzcashNumber", settings.jazzcash_number);
  setFieldValue("socialInstagram", settings.social_instagram);
  setFieldValue("socialFacebook", settings.social_facebook);
  setFieldValue("socialTiktok", settings.social_tiktok);

  renderThemeGrid(settings.theme || {});
}

async function loadSettings() {
  const { data, error } = await supabaseClient.from("site_settings").select("*").eq("id", 1).single();

  if (error) {
    showAdminToast("Failed to load settings", true);
    return;
  }

  currentSettings = data;
  fillForm(data);
}

async function uploadIfSelected(inputSelector, folder) {
  const file = document.querySelector(inputSelector)?.files[0];
  if (!file) return null;
  return uploadAdminImage(file, folder);
}

async function collectHeroSlides() {
  const rows = Array.from(document.querySelectorAll("[data-slide-row]"));
  const slides = [];

  for (const row of rows) {
    const file = row.querySelector(".slide-file").files[0];
    let image = row.querySelector(".slide-image").value.trim();
    const alt = row.querySelector(".slide-alt").value.trim();

    if (file) {
      image = await uploadAdminImage(file, "site/hero");
    }

    if (image) slides.push({ image, alt });
  }

  return slides;
}

async function handleSaveSettings() {
  const saveButton = document.querySelector("[data-save-settings]");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const [logoUrl, logoFooterUrl] = await Promise.all([
      uploadIfSelected('[data-field="logoFile"]', "site"),
      uploadIfSelected('[data-field="logoFooterFile"]', "site")
    ]);

    const heroSlides = await collectHeroSlides();

    const theme = {};
    THEME_FIELDS.forEach(field => {
      theme[field.key] = document.querySelector(`[data-theme-input="${field.key}"]`).value;
    });

    const payload = {
      id: 1,
      brand_name: getFieldValue("brandName") || null,
      logo_url: logoUrl || getFieldValue("logoUrl") || null,
      logo_footer_url: logoFooterUrl || getFieldValue("logoFooterUrl") || null,
      hero_heading: getFieldValue("heroHeading") || null,
      hero_slides: heroSlides,
      footer_tagline: getFieldValue("footerTagline") || null,
      footer_about: getFieldValue("footerAbout") || null,
      whatsapp_number: getFieldValue("whatsappNumber") || null,
      support_email: getFieldValue("supportEmail") || null,
      easypaisa_number: getFieldValue("easypaisaNumber") || null,
      jazzcash_number: getFieldValue("jazzcashNumber") || null,
      social_instagram: getFieldValue("socialInstagram") || null,
      social_facebook: getFieldValue("socialFacebook") || null,
      social_tiktok: getFieldValue("socialTiktok") || null,
      theme,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient.from("site_settings").upsert(payload);
    if (error) throw error;

    showAdminToast("Settings saved");
    await loadSettings();
    settingsFormDirty?.reset();
  } catch (error) {
    showAdminToast(error.message || "Failed to save settings", true);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Settings";
  }
}

async function initSettingsPage() {
  const session = await requireAdminSession();
  if (!session) return;

  wireSlideRowEvents();
  renderThemePresets();
  await loadSettings();

  settingsFormDirty = trackFormDirty(document.querySelector("[data-settings-form]"));

  window.addEventListener("beforeunload", event => {
    if (!settingsFormDirty?.isDirty()) return;
    event.preventDefault();
    event.returnValue = "";
  });

  document.querySelector("[data-add-slide]").addEventListener("click", () => {
    addSlideRow();
    settingsFormDirty?.markDirty();
  });
  document.querySelector("[data-save-settings]").addEventListener("click", handleSaveSettings);
  document.querySelector("[data-reset-theme]").addEventListener("click", () => {
    renderThemeGrid(DEFAULT_THEME);
    settingsFormDirty?.markDirty();
  });

  document.querySelector('[data-field="logoFile"]').addEventListener("change", event => {
    if (!validateWebpSelection(event.target)) return;
    const file = event.target.files[0];
    if (file) document.querySelector('[data-image-preview="logo"]').src = URL.createObjectURL(file);
  });

  document.querySelector('[data-field="logoFooterFile"]').addEventListener("change", event => {
    if (!validateWebpSelection(event.target)) return;
    const file = event.target.files[0];
    if (file) document.querySelector('[data-image-preview="logoFooter"]').src = URL.createObjectURL(file);
  });

  document.querySelector("[data-settings-form]").addEventListener("submit", event => event.preventDefault());
}

document.addEventListener("DOMContentLoaded", initSettingsPage);
