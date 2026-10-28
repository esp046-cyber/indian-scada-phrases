# SCADA Engineer Indian-to-English Communication Guide

Offline-first PWA with 26 SCADA/PLC/DCS phrases, text-to-speech, copy, search and tag filters.

The `icons/` folder already contains ready-made PNG icons (icon-192, icon-512, favicon, og-image).
`assets/generate-icons.html` is optional if you want to regenerate them.

## Deploy from an iPhone (no PC)
1. In Safari open github.com, sign in, tap **+ -> New repository**. Name it `scada-english-guide`, set Public, create.
2. Unzip this package in the Files app.
3. In the repo tap **Add file -> Upload files**. Upload everything (keep the `assets/` and `icons/` folders), then **Commit changes**.
4. **Settings -> Pages**: Source = *Deploy from a branch*, branch `main`, folder `/ (root)`, Save.
5. After ~1 minute visit `https://YOUR-USERNAME.github.io/scada-english-guide/`.
6. Replace `YOUR-USERNAME` in `index.html`, `sitemap.xml` and `robots.txt`.
7. Install: Safari **Share -> Add to Home Screen**.

## Notes
- Speech uses the browser Web Speech API (`en-IN`); voices vary by device.
- Bump `V` in `service-worker.js` after each update so users get new files.
- Edit the `P` array in `script.js` to add phrases.
