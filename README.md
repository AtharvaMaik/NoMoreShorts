# NoMoreShorts

NoMoreShorts is a personal Chrome extension that removes YouTube Shorts from the YouTube UI and redirects `youtube.com/shorts/...` links to `https://www.youtube.com/`.

This is currently a personal-use extension. It is not published on the Chrome Web Store right now, though it may be published someday.

## Why

Short-form feeds are designed to pull you into a quick scroll that quietly eats time. NoMoreShorts removes the YouTube Shorts surfaces that create that distraction, so opening YouTube is less likely to turn into an accidental time sink.

Use it if you still want YouTube for normal videos, tutorials, music, or subscriptions, but do not want Shorts sitting one click away every time you search or browse.

## Privacy And Security

NoMoreShorts does not collect, store, transmit, sell, or share user data.

The extension runs locally in your browser on YouTube pages. It only reads the page structure so it can remove Shorts UI elements and redirect direct Shorts URLs. It does not use analytics, remote servers, cookies, external requests, or third-party services.

## Install In Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this project folder.

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

## Publishing Status

This extension is not currently published. The repository includes store-oriented assets and notes for a possible future release, but for now NoMoreShorts is intended to be installed manually as an unpacked personal extension.
