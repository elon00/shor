# 🚀 1-Click Netlify Free Deployment: Shor Web 4.0

Deploy Shor Web 4.0 to Netlify with 100% Free Hosting (No credit card or paid plan required).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/elon00/shor)

---

## ⚡ Instant 1-Click Deployment (100% Free Tier)

1. Click the **[Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/elon00/shor)** button above.
2. Sign in with GitHub on Netlify (Free account).
3. Connect the repository `elon00/shor`.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. *(Optional)* Add Environment Variables in Site Settings:
   - `GEMINI_API_KEY`: *(Your Google AI Studio key)*
6. Click **Save & Deploy Site**.
7. Netlify will give you a live free URL (e.g. `https://shor-web4.netlify.app`) with free automatic SSL/HTTPS!

---

## 🔧 Netlify Configuration Specs
- **SPA Routing**: Configured in `netlify.toml` and `public/_redirects` to handle all sub-routes seamlessly.
- **Node.js Environment**: Fixed to Node.js 20 LTS for zero build failures.
