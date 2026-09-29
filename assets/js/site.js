const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);

const normalizeLanguage = (value) => {
  if (!value) return "";
  const normalized = value.toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : "";
};

export const resolveLanguage = (search = "", stored = "", browserLanguage = "") => {
  const queryLanguage = normalizeLanguage(new URLSearchParams(search).get("lang"));
  return queryLanguage || normalizeLanguage(stored) || normalizeLanguage(browserLanguage) || "zh";
};

const getStoredLanguage = () => {
  try {
    return window.localStorage.getItem("preferred-language") || "";
  } catch {
    return "";
  }
};

const storeLanguage = (language) => {
  try {
    window.localStorage.setItem("preferred-language", language);
  } catch {
    // The page still works when storage is unavailable.
  }
};

const initializeSite = () => {
  const translatedElements = [...document.querySelectorAll(".i18n")];
  const ariaElements = [...document.querySelectorAll("[data-aria-zh][data-aria-en]")];
  const languageButtons = [...document.querySelectorAll("[data-lang]")];
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  translatedElements.forEach((element) => {
    element.dataset.zh = element.innerHTML;
  });

  const applyLanguage = (language, { persist = false, updateUrl = false } = {}) => {
    const selected = SUPPORTED_LANGUAGES.has(language) ? language : "zh";
    document.documentElement.lang = selected === "en" ? "en" : "zh-CN";

    translatedElements.forEach((element) => {
      element.innerHTML = selected === "en" ? element.dataset.en : element.dataset.zh;
    });
    ariaElements.forEach((element) => {
      element.setAttribute("aria-label", selected === "en" ? element.dataset.ariaEn : element.dataset.ariaZh);
    });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === selected));
    });

    document.title = selected === "en" ? "Yuehua Zhu, Ph.D." : "朱跃华博士 | Yuehua Zhu, Ph.D.";

    if (persist) storeLanguage(selected);
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", selected);
      window.history.replaceState({}, "", url);
    }
  };

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang, { persist: true, updateUrl: true }));
  });

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const sections = [...document.querySelectorAll(".section-anchor")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
      },
      { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
  }

  const selectedLanguage = resolveLanguage(window.location.search, getStoredLanguage(), navigator.language);
  applyLanguage(selectedLanguage);

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
  } else {
    initializeSite();
  }
}
