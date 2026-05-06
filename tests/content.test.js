const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  GHOST_SHELF_BOUNDARY_SELECTORS,
  getRedirectTarget,
  isShortsUrl,
  isShortsHeadingText,
  MODERN_SHORTS_HEADING_SELECTORS,
  SHORTS_SELECTORS,
} = require("../src/content.js");

test("detects YouTube Shorts URLs", () => {
  assert.equal(isShortsUrl("https://www.youtube.com/shorts/abc123"), true);
  assert.equal(isShortsUrl("https://m.youtube.com/shorts/abc123"), true);
  assert.equal(isShortsUrl("https://youtube.com/shorts/abc123?feature=share"), true);
});

test("does not treat normal YouTube URLs as Shorts", () => {
  assert.equal(isShortsUrl("https://www.youtube.com/watch?v=abc123"), false);
  assert.equal(isShortsUrl("https://www.youtube.com/feed/subscriptions"), false);
  assert.equal(isShortsUrl("https://example.com/shorts/abc123"), false);
});

test("redirects Shorts URLs to YouTube home", () => {
  assert.equal(
    getRedirectTarget("https://www.youtube.com/shorts/abc123"),
    "https://www.youtube.com/",
  );
  assert.equal(getRedirectTarget("https://www.youtube.com/watch?v=abc123"), null);
});

test("exports selectors for common Shorts surfaces", () => {
  const selectors = SHORTS_SELECTORS.join("\n");

  assert.match(selectors, /\/shorts\//);
  assert.match(selectors, /ytd-reel-shelf-renderer/);
  assert.match(selectors, /ytd-rich-shelf-renderer/);
  assert.match(selectors, /grid-shelf-view-model/);
});

test("detects only exact Shorts shelf headings", () => {
  assert.equal(isShortsHeadingText("Shorts"), true);
  assert.equal(isShortsHeadingText("  Shorts  "), true);
  assert.equal(isShortsHeadingText("YouTube Shorts"), false);
  assert.equal(isShortsHeadingText("Shorts remix"), false);
});

test("targets modern YouTube attributed Shorts heading spans", () => {
  const selectors = MODERN_SHORTS_HEADING_SELECTORS.join("\n");

  assert.match(selectors, /ytAttributedStringHost/);
  assert.match(selectors, /role='text'/);
});

test("ghost shelf ancestor search has page-level boundaries", () => {
  const selectors = GHOST_SHELF_BOUNDARY_SELECTORS.join("\n");

  assert.match(selectors, /ytd-item-section-renderer/);
  assert.match(selectors, /ytd-search/);
  assert.match(selectors, /ytd-page-manager/);
});

test("manifest includes store-ready icons and action metadata", () => {
  const manifestPath = path.join(__dirname, "..", "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  assert.equal(manifest.name, "FKshorts - Shorts Remover");
  assert.equal(manifest.short_name, "FKshorts");
  assert.equal(manifest.icons["128"], "assets/icons/icon-128.png");
  assert.equal(manifest.action.default_icon["128"], "assets/icons/icon-128.png");

  for (const size of ["16", "32", "48", "128"]) {
    const iconPath = path.join(__dirname, "..", manifest.icons[size]);
    assert.equal(fs.existsSync(iconPath), true);
  }
});
