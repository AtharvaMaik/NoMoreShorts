# YouTube Shorts Remover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chrome extension that removes YouTube Shorts UI and redirects Shorts URLs to YouTube home.

**Architecture:** A Manifest V3 extension runs one content script on YouTube pages. The script blocks `/shorts/...` routes, watches YouTube SPA navigation, and removes DOM elements that point to Shorts. CSS provides immediate hiding while JavaScript handles dynamic rendering.

**Tech Stack:** Chrome Manifest V3, plain JavaScript, CSS, Node.js built-in test runner.

---

## File Structure

- `manifest.json`: Chrome extension declaration and content script registration.
- `src/content.js`: URL blocking, redirect handling, DOM cleanup, navigation hooks, and testable helper exports.
- `src/content.css`: Fast CSS-level hiding of likely Shorts UI.
- `tests/content.test.js`: Unit tests for URL detection, redirect policy, and Shorts selectors.
- `package.json`: `npm test` script using Node's built-in runner.
- `README.md`: Install and behavior notes for loading the unpacked extension.

### Task 1: Test Shorts URL Policy

**Files:**
- Create: `package.json`
- Create: `tests/content.test.js`

- [ ] **Step 1: Write failing tests**

Create tests that import helpers from `src/content.js` and assert:
- `isShortsUrl("https://www.youtube.com/shorts/abc")` is true.
- `isShortsUrl("https://m.youtube.com/shorts/abc")` is true.
- `isShortsUrl("https://www.youtube.com/watch?v=abc")` is false.
- `getRedirectTarget("https://www.youtube.com/shorts/abc")` returns `https://www.youtube.com/`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because `src/content.js` does not exist.

### Task 2: Implement Content Script Helpers

**Files:**
- Create: `src/content.js`

- [ ] **Step 1: Implement minimal helpers**

Add `SHORTS_SELECTORS`, `isShortsUrl`, and `getRedirectTarget` with CommonJS exports when `module.exports` exists.

- [ ] **Step 2: Run tests and verify GREEN**

Run: `npm test`

Expected: PASS.

### Task 3: Add Extension Manifest and CSS

**Files:**
- Create: `manifest.json`
- Create: `src/content.css`
- Modify: `tests/content.test.js`

- [ ] **Step 1: Add selector coverage test**

Assert `SHORTS_SELECTORS` contains selectors for `/shorts/`, `ytd-reel-shelf-renderer`, and `ytd-rich-shelf-renderer`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL until selectors are complete.

- [ ] **Step 3: Add manifest and CSS**

Register `src/content.js` and `src/content.css` on `*://*.youtube.com/*`. CSS hides obvious Shorts navigation and renderer surfaces.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: PASS.

### Task 4: Add Runtime DOM Cleanup and Navigation Blocking

**Files:**
- Modify: `src/content.js`
- Modify: `README.md`

- [ ] **Step 1: Add runtime behavior**

Use `location.replace("https://www.youtube.com/")` when on a Shorts URL. Override `history.pushState` and `history.replaceState`, listen for `popstate` and `yt-navigate-finish`, and run DOM cleanup through a `MutationObserver`.

- [ ] **Step 2: Document installation**

Add README instructions for `chrome://extensions`, Developer mode, and "Load unpacked".

- [ ] **Step 3: Run final verification**

Run: `npm test`

Expected: PASS.
