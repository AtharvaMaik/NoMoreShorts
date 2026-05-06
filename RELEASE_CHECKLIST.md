# Chrome Web Store Release Checklist

## Files To Upload

- Extension package: `dist/nomoreshorts-0.1.0.zip`
- Store icon: `assets/icons/icon-128.png`
- Screenshot: `store-assets/screenshot-1280x800.png`
- Small promo tile: `store-assets/small-promo-440x280.png`
- Optional marquee tile: `store-assets/marquee-1400x560.png`

## Dashboard Fields

- Name: `NoMoreShorts`
- Summary: `Remove YouTube Shorts UI, shelves, links, and Shorts pages.`
- Category: `Productivity`
- Language: `English`
- Detailed description: use `CHROME_WEB_STORE_LISTING.md`
- Privacy practices: disclose that the extension does not collect or use user data.
- Privacy policy: publish `PRIVACY.md` somewhere public and paste that URL.
- Support: add your preferred support email or website.

## Final Local Checks

```powershell
npm test
node -e "JSON.parse(require('fs').readFileSync('manifest.json','utf8')); console.log('manifest ok')"
tar -tf dist\nomoreshorts-0.1.0.zip
```
