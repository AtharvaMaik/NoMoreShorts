(function () {
  const YOUTUBE_HOME_URL = "https://www.youtube.com/";

  const SHORTS_SELECTORS = [
    'a[href^="/shorts/"]',
    'a[href*="youtube.com/shorts/"]',
    "ytd-reel-shelf-renderer",
    "ytd-shelf-renderer:has(a[href^='/shorts/'])",
    "ytd-shelf-renderer:has(a[href*='youtube.com/shorts/'])",
    "ytd-rich-shelf-renderer[is-shorts]",
    "ytd-rich-shelf-renderer:has(a[href^='/shorts/'])",
    "ytd-horizontal-card-list-renderer:has(a[href^='/shorts/'])",
    "ytd-horizontal-card-list-renderer:has(a[href*='youtube.com/shorts/'])",
    "grid-shelf-view-model:has(a[href^='/shorts/'])",
    "grid-shelf-view-model:has(a[href*='youtube.com/shorts/'])",
    "ytd-mini-guide-entry-renderer[aria-label='Shorts']",
    "ytd-guide-entry-renderer a[title='Shorts']",
    "yt-chip-cloud-chip-renderer[chip-style='STYLE_DEFAULT'] a[href*='/shorts/']",
  ];

  const MODERN_SHORTS_HEADING_SELECTORS = [
    "span.ytAttributedStringHost[role='text']",
    "span.ytAttributedStringWhiteSpacePreWrap[role='text']",
    "yt-formatted-string[role='text']",
  ];

  const GHOST_SHELF_BOUNDARY_SELECTORS = [
    "ytd-item-section-renderer",
    "ytd-search",
    "ytd-section-list-renderer",
    "ytd-two-column-search-results-renderer",
    "ytd-page-manager",
    "ytd-app",
  ];

  const GHOST_SHELF_CONTAINER_HINTS = [
    "ytd-reel-shelf-renderer",
    "ytd-shelf-renderer",
    "ytd-rich-shelf-renderer",
    "ytd-horizontal-card-list-renderer",
    "yt-horizontal-list-renderer",
    "yt-horizontal-list-view-model",
    "yt-shelf-view-model",
    "yt-section-view-model",
    "grid-shelf-view-model",
  ];

  function parseUrl(value) {
    try {
      return new URL(value, YOUTUBE_HOME_URL);
    } catch (_error) {
      return null;
    }
  }

  function isYouTubeHost(hostname) {
    return hostname === "youtube.com" || hostname.endsWith(".youtube.com");
  }

  function isShortsUrl(value) {
    const url = parseUrl(value);

    return Boolean(url && isYouTubeHost(url.hostname) && url.pathname.startsWith("/shorts/"));
  }

  function getRedirectTarget(value) {
    return isShortsUrl(value) ? YOUTUBE_HOME_URL : null;
  }

  function isShortsHeadingText(value) {
    return String(value || "").trim() === "Shorts";
  }

  function nearestRemovableShortsElement(element) {
    if (!element || typeof element.closest !== "function") {
      return null;
    }

    return element.closest(
      [
        "ytd-rich-item-renderer",
        "ytd-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-compact-video-renderer",
        "ytd-reel-item-renderer",
        "ytd-shelf-renderer",
        "ytd-rich-shelf-renderer",
        "ytd-horizontal-card-list-renderer",
        "grid-shelf-view-model",
        "ytd-guide-entry-renderer",
        "ytd-mini-guide-entry-renderer",
        "yt-chip-cloud-chip-renderer",
      ].join(","),
    );
  }

  function removeShortsSurfaces(root) {
    if (!root || typeof root.querySelectorAll !== "function") {
      return;
    }

    const matchedElements = new Set();

    for (const selector of SHORTS_SELECTORS) {
      for (const element of root.querySelectorAll(selector)) {
        matchedElements.add(element);
      }
    }

    for (const element of matchedElements) {
      const removableElement = nearestRemovableShortsElement(element) || element;
      incrementDebugCount("removedBySelector");
      removableElement.remove();
    }

    removeGhostShortsShelves(root);
  }

  function removeGhostShortsShelves(root) {
    const headingSelectors = [
      "#title",
      "#title-text",
      "h2",
      "h3",
      "yt-formatted-string",
      "span",
      ...MODERN_SHORTS_HEADING_SELECTORS,
    ].join(",");

    for (const heading of root.querySelectorAll(headingSelectors)) {
      if (!isShortsHeadingText(heading.textContent)) {
        continue;
      }

      const shelf = findGhostShortsShelf(heading);

      if (shelf) {
        incrementDebugCount("removedByHeading");
        shelf.remove();
      }
    }
  }

  function findGhostShortsShelf(heading) {
    return heading.closest(GHOST_SHELF_CONTAINER_HINTS.join(","));
  }

  function incrementDebugCount(key) {
    if (typeof window === "undefined") {
      return;
    }

    window.__noMoreShortsDebug = window.__noMoreShortsDebug || {
      removedByHeading: 0,
      removedBySelector: 0,
    };
    window.__noMoreShortsDebug[key] = (window.__noMoreShortsDebug[key] || 0) + 1;
  }

  function redirectIfShortsLocation() {
    if (typeof window === "undefined" || !window.location) {
      return;
    }

    const redirectTarget = getRedirectTarget(window.location.href);

    if (redirectTarget && window.location.href !== redirectTarget) {
      window.location.replace(redirectTarget);
    }
  }

  function watchNavigation() {
    if (typeof window === "undefined" || !window.history) {
      return;
    }

    const handleNavigation = () => {
      window.setTimeout(() => {
        redirectIfShortsLocation();
        removeShortsSurfaces(document);
      }, 0);
    };

    for (const methodName of ["pushState", "replaceState"]) {
      const original = window.history[methodName];

      window.history[methodName] = function patchedHistoryMethod(...args) {
        const result = original.apply(this, args);
        handleNavigation();
        return result;
      };
    }

    window.addEventListener("popstate", handleNavigation, true);
    window.addEventListener("yt-navigate-finish", handleNavigation, true);
  }

  function startDomCleanup() {
    if (typeof document === "undefined") {
      return;
    }

    const cleanup = () => removeShortsSurfaces(document);

    const attachObserver = () => {
      cleanup();

      if (!document.documentElement || typeof MutationObserver === "undefined") {
        window.setTimeout(attachObserver, 50);
        return;
      }

      const observer = new MutationObserver(cleanup);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    };

    attachObserver();
    document.addEventListener("DOMContentLoaded", cleanup, { once: true });
  }

  function start() {
    redirectIfShortsLocation();
    watchNavigation();
    startDomCleanup();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      getRedirectTarget,
      GHOST_SHELF_BOUNDARY_SELECTORS,
      isShortsUrl,
      isShortsHeadingText,
      MODERN_SHORTS_HEADING_SELECTORS,
      SHORTS_SELECTORS,
    };
  } else {
    start();
  }
})();
