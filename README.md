# Cozy Drone — marketing page

A one-page static site. No framework, no build step, no `node_modules`. Just
`index.html`, `styles.css`, `main.js` and an `images/` folder.

```
index.html          the whole page
styles.css          all styling
main.js             lightbox + click-to-load YouTube embed
images/
  logo.png          COZY ✈ DRONE wordmark (transparent PNG)
  social-card.png   og:image used for link previews
  favicon.png
  screenshots/      01.png, 02.png, ...
vercel.json         clean URLs + long cache on /images
```

## Local preview

Opening `index.html` straight off disk won't resolve the absolute paths
(`/styles.css`), so run a tiny server instead:

```sh
npx serve .          # http://localhost:3000
# or, no npm at all:
python3 -m http.server 8000
```

## Deploy to Vercel

The repo is static, so Vercel needs no build configuration:

1. Push to GitHub.
2. In Vercel: **Add New → Project**, import the repo.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
4. Deploy.

Every push to `main` redeploys; pull requests get preview URLs.

Or from the terminal:

```sh
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production
```

## Things to fill in before launch

- **Trailer** — in `index.html`, put the YouTube ID on the trailer container:
  `<div class="video" data-video-id="dQw4w9WgXcQ" ...>`. That's it; `main.js`
  swaps the "Trailer incoming" placeholder for a click-to-play thumbnail. The
  real embed only loads once someone clicks it, so the page stays fast.
- **Steam link** — two `<a class="btn" ... data-steam>` tags currently point at
  `#`. Replace both `href`s with the Steam app URL.
- **Screenshots** — drop files into `images/screenshots/` and add one `<figure>`
  block per image in the screenshots section. Two are in so far; there's room
  for six. Write real alt text for each.
- **Domain** — the `og:image`, `og:url` and `canonical` tags hardcode
  `https://cozydrone.com`. Update those three if the domain differs, otherwise
  link previews on Discord/Twitter/Slack will break.

## Notes

- Screenshots use `image-rendering: pixelated` so the pixel art stays crisp
  instead of going blurry when scaled.
- The palette (`#c6ac84` sand) is sampled directly from the game art.
- Respects `prefers-reduced-motion` — the drifting planes in the hero turn off.
