# Cozy Drone — marketing page

A one-page static site. No framework, no build step, no `node_modules`. Just
`index.html`, `styles.css`, `main.js` and an `images/` folder.

```
index.html          the landing page
press.html          press kit (served at /press via cleanUrls)
styles.css          all styling, both pages
main.js             carousel + lightbox + click-to-load YouTube embed
press.js            copy-to-clipboard buttons on /press
images/
  logo.png          COZY ✈ DRONE wordmark (transparent PNG)
  social-card.png   og:image used for link previews
  favicon.png
  screenshots/      01.png ... 10.png (2400×1350 originals)
press-assets/       downloadable press files: renamed screenshots, logo,
                    key art, 4 GIFs, trailer mp4, fact sheet .txt, and
                    cozy-drone-press-kit.zip bundling everything but the mp4
vercel.json         clean URLs + cache headers
```

## Press assets — how they were made

- GIFs: cut from `~/Documents/cozyDrone/cozyDroneSteamTrailer.mp4` with ffmpeg
  (15 fps, 640px, palettegen). Re-cut with different timestamps if the trailer
  changes.
- `cozy-drone-trailer-1080p.mp4`: same source re-encoded (crf 19) — the raw
  export is 147 MB, over Vercel's 100 MB file limit.
- Key art PNGs are lossless recompressions of the Steam capsule exports.
- After changing any asset, rebuild the zip:
  `cd press-assets && zip -q cozy-drone-press-kit.zip cozy-drone-*.png cozy-drone-*.gif cozy-drone-fact-sheet.txt`

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
- ~~**Steam link**~~ — done. Both `<a class="btn" ... data-steam>` tags point at
  app `4950510`. The `data-steam` attribute is just a marker for finding them.
- ~~**Screenshots**~~ — 10 are in, all 2400×1350 (16:9). To add more, drop a
  **16:9** file into `images/screenshots/` and copy a `<figure class="slide">`
  block; the dots and counter are generated from however many slides exist.
  Write real alt text for each.
- **Domain** — the `og:image`, `og:url` and `canonical` tags hardcode
  `https://cozydrone.com`. Update those three if the domain differs, otherwise
  link previews on Discord/Twitter/Slack will break.
- **Press page fills** — `press.html` has two `[FILL:]` markers: the Squeeg
  Studios bio and (commented out) social links. The price row says
  "TBA — available to press on request"; change it if you'd rather publish it.

## Notes

- **Don't add `image-rendering: pixelated` to the screenshots.** It's only right
  when scaling pixel art *up*. The sources are 2400px wide and display at about
  1030 CSS px, so they always scale *down* — and nearest-neighbour downscaling
  discards pixels instead of averaging them, which shreds the 1px villagers and
  the HUD text. Smooth downsampling of a 2x source is what keeps them sharp.
- The screenshot carousel is CSS scroll-snap; `main.js` only adds the dots,
  counter and arrows. Without JS it stays a swipeable horizontal strip.
- The palette (`#c6ac84` sand) is sampled directly from the game art.
- Respects `prefers-reduced-motion` — the drifting planes in the hero turn off.
