# Artham Website

A responsive, single-page landing website for **Artham**, a local-first personal finance app for Android.

The focused layout includes the hero and download area, four product screens, key features, privacy, recent updates and project links. It uses plain HTML, CSS and JavaScript with no build step or package manager.

## Run locally

1. Extract the project folder.
2. Open `index.html` directly in a browser, or start a local server:

   ```bash
   python -m http.server 8000
   ```

3. Visit `http://localhost:8000`.

## Publish

The site is static and can be hosted on Netlify, GitHub Pages, Cloudflare Pages or another static host. Preserve the `assets/` and `img/` directory paths.

## Files

```text
index.html
404.html
assets/
  css/styles.css
  js/main.js
img/
  app screenshots, icons and social preview
```

## Included interactions

- Responsive mobile navigation with keyboard dismissal.
- Section-aware navigation state and animated desktop underlines.
- Staggered scroll reveals, a reading-progress line and back-to-top control.
- Accessible screenshot lightbox (click, Enter/Space and Escape).
- Pointer-aware product-card tilt and soft cursor-following highlights.
- Gentle hero-phone parallax and magnetic primary download buttons on desktop.
- Refined hover and focus responses for feature items, privacy points, update cards and download areas.
- Pointer effects are disabled on touch-only devices and when reduced motion is preferred.

## Download link

The Android beta buttons point to GitHub Release `v0.1.1`:

https://github.com/vishnuwiz/artham/releases/download/v0.1.1/app-release.apk

Update both APK buttons and the release-notes link in `index.html` together when publishing a new release.

## Privacy wording

The page describes SMS import as user-initiated paste/share only. It does not claim to read the SMS inbox, monitor messages in the background or request SMS permissions.

## Notes

- Google Fonts load remotely; system fallbacks are provided.
- App screenshots and icons are served from the repository's existing `img/` directory.
- The website code is MIT licensed. The Artham name, icon and app screenshots are not covered by that licence.
