# FKshorts - Shorts Remover

FKshorts is a small Chrome extension that removes YouTube Shorts from the YouTube UI and redirects `youtube.com/shorts/...` links to `https://www.youtube.com/`.

## Install In Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this folder: `C:\Projects\FKshorts`.

## What It Blocks

- Shorts links in navigation and feeds.
- Shorts shelves and reel renderers.
- Direct visits to `/shorts/...`, including YouTube single-page navigation.

## Verify

Run the automated checks:

```powershell
npm test
```

Manual check:

1. Visit `https://www.youtube.com/` and confirm Shorts surfaces are gone.
2. Visit `https://www.youtube.com/shorts/example` and confirm the tab redirects to YouTube home.

## Chrome Web Store

Store listing copy is in `CHROME_WEB_STORE_LISTING.md`.

Store artwork is in `store-assets/`.

The upload ZIP is generated under `dist/`.
