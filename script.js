/* =====================================================
   MovieHub — script.js
   Configuration is loaded from config.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

/* =====================================================
   APP INITIALIZATION
===================================================== */

function initializeApp() {
  initializeBrand();
  initializeGithub();
  createPlayer();

  initNavbarScroll();
  initFullscreenButton();
  initReloadButton();
  initCopyButton();
  initKeyboardShortcuts();
}

/* =====================================================
   BRAND
===================================================== */

function initializeBrand() {
  if (!window.APP_CONFIG) return;

  // Update page title
  document.title = `${APP_CONFIG.brand} • Premium Player`;

  // Update navbar logo
  const navbarLogo = document.querySelector(".navbar__logo");

  if (navbarLogo) {
    navbarLogo.innerHTML = `
      <span class="navbar__logo-primary">${APP_CONFIG.brand.slice(0, -3)}</span><span class="navbar__logo-accent">${APP_CONFIG.brand.slice(-3)}</span>
    `;
  }

  // Update footer brand
  const footerBrand = document.getElementById("brandName");

  if (footerBrand) {
    footerBrand.textContent = APP_CONFIG.brand;
  }
}

/* =====================================================
   GITHUB LINK
===================================================== */

function initializeGithub() {
    const github = document.getElementById("githubLink");

    if (!github) return;

    const url = APP_CONFIG?.githubUrl || "https://github.com";

    github.setAttribute("href", url);
}

/* =====================================================
   PLAYER
===================================================== */

function createPlayer() {
  const container = document.getElementById("player");

  if (!container) return;

  container.innerHTML = buildLoadingState();

  if (!APP_CONFIG.playerUrl) {
    container.innerHTML = "";
    container.appendChild(buildEmptyState());
    return;
  }

  const iframe = buildIframe(APP_CONFIG.playerUrl);

  iframe.onload = () => {
    const loader = container.querySelector(".player-loading");

    if (loader) {
      loader.remove();
    }
  };

  iframe.onerror = () => {
    container.innerHTML = `
      <div class="hero__player-empty">

        <svg
          class="hero__player-empty-icon"
          viewBox="0 0 24 24"
          fill="none">

          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            stroke-width="1.5"/>

          <path
            d="M12 7v6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"/>

          <circle
            cx="12"
            cy="17"
            r="1"
            fill="currentColor"/>

        </svg>

        <p class="hero__player-empty-text">

          Unable to load movie

        </p>

        <p class="hero__player-empty-sub">

          Please check your iframe URL.

        </p>

      </div>
    `;

    announce("Unable to load player");
  };

  container.appendChild(iframe);
}

/* =====================================================
   IFRAME
===================================================== */

function buildIframe(url) {
  const iframe = document.createElement("iframe");

  iframe.src = url;
  iframe.id = "moviePlayerFrame";

  iframe.title = "Movie Player";

  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";

  iframe.allowFullscreen = true;

  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  iframe.loading = "eager";

  iframe.frameBorder = "0";

  return iframe;
}

/* =====================================================
   LOADING STATE
===================================================== */

function buildLoadingState() {
  return `
    <div class="player-loading">

      <div class="loader"></div>

      <p>

        Loading player...

      </p>

    </div>
  `;
}

/* =====================================================
   EMPTY STATE
===================================================== */

function buildEmptyState() {
  const wrapper = document.createElement("div");

  wrapper.className = "hero__player-empty";

  wrapper.innerHTML = `
    <svg
      class="hero__player-empty-icon"
      viewBox="0 0 24 24"
      fill="none">

      <circle
        cx="12"
        cy="12"
        r="11"
        stroke="currentColor"
        stroke-width="1.5"/>

      <path
        d="M10 8.5L16 12L10 15.5V8.5Z"
        fill="currentColor"/>

    </svg>

    <p class="hero__player-empty-text">

      NO MOVIE LOADED

    </p>

    <p class="hero__player-empty-sub">

      Open config.js and paste your iframe URL.

    </p>
  `;

  return wrapper;
}
/* =====================================================
   NAVBAR
===================================================== */

function initNavbarScroll() {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  handleScroll();
}

/* =====================================================
   FULLSCREEN
===================================================== */

function initFullscreenButton() {
  const button = document.getElementById("fullscreenBtn");
  const player = document.querySelector(".hero__player");

  if (!button || !player) return;

  addRipple(button);

  button.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
          await player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
          player.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      announce("Fullscreen unavailable");
    }
  });
}

/* =====================================================
   RELOAD PLAYER
===================================================== */

function initReloadButton() {
  const button = document.getElementById("reloadBtn");

  if (!button) return;

  addRipple(button);

  button.addEventListener("click", () => {
    button.disabled = true;

    createPlayer();

    announce("Player reloaded");

    setTimeout(() => {
      button.disabled = false;
    }, 1000);
  });
}

/* =====================================================
   COPY LINK
===================================================== */

function initCopyButton() {
  const button = document.getElementById("copyBtn");
  const label = document.getElementById("copyBtnLabel");

  if (!button || !label) return;

  addRipple(button);

  button.addEventListener("click", async () => {
    if (!APP_CONFIG.playerUrl) {
      announce("No movie loaded");
      return;
    }

    try {
      await navigator.clipboard.writeText(APP_CONFIG.playerUrl);

      const original = label.textContent;

      label.textContent = "✓ Copied!";

      announce("Link copied");

      setTimeout(() => {
        label.textContent = original;
      }, 1800);

    } catch (err) {
      announce("Copy failed");
    }
  });
}

/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

function initKeyboardShortcuts() {

  document.addEventListener("keydown", (event) => {

    const tag = document.activeElement.tagName;

    if (
      tag === "INPUT" ||
      tag === "TEXTAREA"
    ) {
      return;
    }

    switch (event.key.toLowerCase()) {

      case "f":
        document.getElementById("fullscreenBtn")?.click();
        break;

      case "r":
        event.preventDefault();
        document.getElementById("reloadBtn")?.click();
        break;

      case "c":
        document.getElementById("copyBtn")?.click();
        break;

    }

  });

}

/* =====================================================
   RIPPLE EFFECT
===================================================== */

function addRipple(button) {

  button.addEventListener("click", (event) => {

    const rect = button.getBoundingClientRect();

    const ripple = document.createElement("span");

    const size = Math.max(rect.width, rect.height);

    ripple.className = "btn__ripple";

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    ripple.style.left =
      `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
      `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });

  });

}

/* =====================================================
   ACCESSIBILITY
===================================================== */

function announce(message) {

  const live =
    document.getElementById("statusMessage");

  if (!live) return;

  live.textContent = "";

  requestAnimationFrame(() => {
    live.textContent = message;
  });

}

/* =====================================================
   OPTIONAL UTILITIES
===================================================== */

window.addEventListener("online", () => {
  announce("Connection restored");
});

window.addEventListener("offline", () => {
  announce("You are offline");
});

window.addEventListener("error", () => {
  announce("Something went wrong");
});

/* =====================================================
   END OF FILE
===================================================== */