# 🚂 1-Click Railway Deployment: Shor Web 4.0

Deploy the complete fullstack Shor Web 4.0 platform to Railway with a single click.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Felon00%2Fshor&envs=GEMINI_API_KEY%2CPORT&optionalEnvs=GEMINI_API_KEY&PORTDesc=Port+for+server&GEMINI_API_KEYDesc=Google+Gemini+AI+API+Key)

---

## ⚡ Step-by-Step 1-Click Deployment

### Method 1: Instant 1-Click Button (Recommended)
1. Click the **[Deploy on Railway](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Felon00%2Fshor&envs=GEMINI_API_KEY%2CPORT&optionalEnvs=GEMINI_API_KEY&PORTDesc=Port+for+server&GEMINI_API_KEYDesc=Google+Gemini+AI+API+Key)** button.
2. Sign in with GitHub on Railway.
3. Configure your Environment Variables:
   - `GEMINI_API_KEY`: *(Optional but recommended for AI features - get key from [Google AI Studio](https://aistudio.google.com/app/apikey))*.
   - `PORT`: `3000` *(or leave blank for automatic Railway PORT assignment)*.
4. Click **Deploy**.
5. Once deployed, Railway will generate a public live HTTPS URL (e.g., `https://shor-production.up.railway.app`).

---

### Method 2: Railway CLI (Direct from Terminal)
```bash
# 1. Login to Railway
railway login

# 2. Link or create project
railway init

# 3. Set environment secrets
railway variables set GEMINI_API_KEY="your_api_key"

# 4. Deploy instantly
railway up
```

---

## 🔍 Health Check & Verification
Railway will automatically monitor the service via:
- Endpoint: `GET /api/health`
- Expected Output: `{"status":"online","framework":"Shor Web 4.0..."}`
