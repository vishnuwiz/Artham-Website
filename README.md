# Artham website

Single-page marketing site for **Artham** (അർത്ഥം), a personal budgeting app for Android.
Plain HTML and CSS, no build step, no JavaScript.

```
index.html      the whole page (styles are inline)
img/            app screenshots (WebP, 640×1422)
.nojekyll       tells GitHub Pages to serve files as they are
```

## Publish with GitHub Pages

1. Create a new repository and upload everything in this folder to the repository root.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository>/`.

Any static host (Netlify, Cloudflare Pages, Vercel) also works: point it at this folder.

## Things to edit

- **Download button.** The page says "Android · coming soon" in the nav and in the last section. Search `index.html` for `coming soon` and replace those pills with a link to your Play Store or APK page.
- **Screenshots.** Replace the files in `img/` with the same names. Keep the 9:20 ratio so the phone frames fit.
- **Colours and fonts.** All colours are CSS variables at the top of the `<style>` block, with a dark set and a light set.
- **Share preview.** Add `<meta property="og:image" content="https://…/preview.png">` in `<head>` once you have a hosted preview image.

Fonts (Bricolage Grotesque, DM Sans, Noto Sans Malayalam) load from Google Fonts.
