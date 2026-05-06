# YouTube Shorts Remover Design

## Goal

Build a Chrome Manifest V3 extension that removes YouTube Shorts entry points from the YouTube interface and prevents users from using `/shorts/...` links.

## Behavior

On `youtube.com`, the extension hides common Shorts surfaces such as navigation links, shelf/grid items, and video cards that point to `/shorts/`. If YouTube dynamically inserts more Shorts UI after navigation or scrolling, the extension removes those elements as they appear.

When the current tab reaches a YouTube Shorts URL, the extension redirects the tab to `https://www.youtube.com/`. This is intentionally strict: Shorts links should not open, transform into watch pages, or show a local blocked page.

## Architecture

Use a Manifest V3 extension with a single content script on YouTube pages. The content script owns both UI cleanup and Shorts URL blocking because YouTube is a single-page app and most navigation happens without full page reloads.

The script uses CSS injection for immediate hiding and a `MutationObserver` for cleanup after YouTube renders new content. It also watches History API navigation, `popstate`, and `yt-navigate-finish` so `/shorts/...` routes are caught even when YouTube changes URLs client-side.

## Files

- `manifest.json`: Extension metadata, match patterns, permissions, and content script registration.
- `src/content.js`: Shorts URL detection, redirect behavior, DOM cleanup, SPA navigation hooks, and exported helpers for tests.
- `src/content.css`: Immediate visual hiding for common Shorts selectors.
- `tests/content.test.js`: Node tests for URL matching, redirect decisions, and selector coverage.
- `package.json`: Minimal test script using Node's built-in test runner.
- `README.md`: Installation and behavior notes.

## Testing

Use Node's built-in test runner for pure logic coverage. Manual verification is loading the unpacked extension in Chrome, visiting `https://www.youtube.com/`, confirming Shorts UI is absent, and opening `https://www.youtube.com/shorts/<id>` to confirm it returns to YouTube home.
