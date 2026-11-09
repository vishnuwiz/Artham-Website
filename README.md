<h1 align="center">Artham · അർത്ഥം</h1>

<p align="center">
  Website for <strong>Artham</strong>, a personal budgeting app for Android.<br>
  One page, glassmorphism, plain HTML and CSS.
</p>

<p align="center">
  <img src="img/social-preview.png" alt="Artham website preview" width="720">
</p>

## About

Artham shows every account as one balance, records each rupee as it moves, and keeps every category inside its limit. The name is Malayalam for *meaning*.

This repository holds the landing page. It shows the app's Home, Activity, Insights and Budgets screens, with sections for budget planning (including an interactive forecast example), recurring transactions, the local-first design, the latest changelog entries and the roadmap. Light and dark themes follow the visitor's device setting.

The app itself lives in [vishnuwiz/artham](https://github.com/vishnuwiz/artham). The content sections are written from that repository's README and `CHANGELOG.md`.

## Structure

```
index.html      the whole page, styles and a little script inline
img/            app screenshots (WebP, 640×1422), the app icon and the social preview
```

## Run it locally

There is no build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Publish with GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
3. After a minute the site is live at `https://<your-username>.github.io/<repository>/`.

## Keeping it up to date

When the app repository gets a new README or changelog entry, update these sections in `index.html`:

- **Budget planning, Recurring, Local-first:** the feature descriptions.
- **What's new:** the Added, Changed and Fixed lists, copied from the `[Unreleased]` or latest release entry.
- **Roadmap:** the Planned list in the app README.
- **Screenshots:** replace the files in `img/` using the same names and keep the 9:20 ratio. The Insights and Budgets screens predate budget planning and forecasts, so new screenshots will show them.

## Other things to edit

- **Download button.** The nav and the last section show "Android · coming soon". Search `index.html` for `coming soon` and replace those pills with a link to the Play Store or APK page.
- **GitHub links.** The "Built in the open" section links to the app repository, its changelog and its issues page.
- **Colours and fonts.** Every colour is a CSS variable at the top of the `<style>` block, with a dark set and a light set.
- **Share preview.** `img/social-preview.png` is also set as the Open Graph image. Upload it under **Settings → General → Social preview** too.

Fonts (Bricolage Grotesque, DM Sans and Noto Sans Malayalam) load from Google Fonts.

## Licence

The website code is released under the [MIT licence](LICENSE). The Artham name, logo and app screenshots are not covered by it.
