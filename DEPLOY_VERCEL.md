# 🚀 Deploy Frontend to Vercel

Complete guide to deploy your restaurant menu frontend to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free tier available at https://vercel.com)
- Backend deployed on Render (see `DEPLOY_RENDER.md`)
- Backend URL from Render deployment

---

## Step 1: Remove Old Deployment (if exists)

If you have a previous deployment on Vercel:

1. Go to https://vercel.com/dashboard
2. Find your old frontend project
3. Click on the project name
4. Go to **Settings** tab
5. Scroll to bottom → **"Delete Project"**
6. Type the project name to confirm
7. Click **"Delete"**

---

## Step 2: Update Frontend Configuration

Before deploying, update the backend URL in your frontend:

### Edit `frontend/config.js`:

```javascript
window.ENV = {
    API_BASE_URL: 'https://your-backend-url.onrender.com'
};
```

**Replace** `your-backend-url.onrender.com` with your actual Render backend URL.

### Commit the changes:

```powershell
cd e:\EDUBOSS\menu

git add frontend/config.js
git commit -m "Update backend URL for production"
git push origin main
```

---

## Step 3: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Click **"Import"**

### Configure Project:

| Field | Value |
|-------|-------|
| **Project Name** | `menu-frontend` (or any name) |
| **Framework Preset** | `Other` |
| **Root Directory** | `frontend` ← **IMPORTANT!** |
| **Build Command** | Leave empty or `echo "No build needed"` |
| **Output Directory** | Leave empty |
| **Install Command** | `npm install` (optional) |

5. Click **"Deploy"**
6. Wait 1-2 minutes for deployment

---

### Method 2: Using Vercel CLI (Alternative)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend folder
cd e:\EDUBOSS\menu\frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts and select your settings.

---

## Step 4: Configure Environment Variables (Optional)

If you want to use environment variables instead of hardcoding:

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add variable:
   - **Name:** `VITE_API_BASE_URL` or `API_BASE_URL`
   - **Value:** `https://your-backend-url.onrender.com`
   - **Environment:** Production, Preview, Development
4. Click **"Save"**

Then update `frontend/inject-env.js` to use this variable.

---

## Step 5: Get Your Frontend URL

After deployment:
1. Vercel shows your live URL: `https://menu-frontend-xxxx.vercel.app`
2. Copy this URL
3. Test by opening it in browser
4. You should see your restaurant menu

---

## Step 6: Test the Complete System

1. Open your Vercel frontend URL
2. Browse menu items
3. Add items to cart
4. Fill in customer details
5. Place a test order
6. Check if order is received (check backend logs or Google Sheets)

---

## Step 7: Generate QR Code

1. Go to https://www.qr-code-generator.com/
2. Select **"URL"** type
3. Enter your Vercel URL: `https://your-frontend.vercel.app`
4. Customize design (optional):
   - Add logo
   - Change colors
   - Add frame with "Scan to Order"
5. Download QR code (PNG or SVG)
6. Print and place on restaurant tables

**Alternative QR Generators:**
- https://qr.io/
- https://www.qrcode-monkey.com/
- https://www.the-qrcode-generator.com/

---

## Troubleshooting

### ❌ Build Failed

**Check:**
- Root directory is set to `frontend`
- No build command is needed (static HTML/CSS/JS)

**Fix:** Set Build Command to empty or `echo "Static site"`

### ❌ 404 Not Found

**Cause:** Root directory not set correctly

**Fix:**
1. Go to Project Settings
2. Set Root Directory to `frontend`
3. Redeploy

### ❌ API Calls Failing

**Check:**
1. Backend URL is correct in `config.js`
2. Backend is running (visit backend health endpoint)
3. CORS is enabled on backend

**Fix:** Update `config.js` with correct backend URL and redeploy

### ❌ CORS Errors

**Fix on Backend (`backend/server.js`):**

```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'https://your-frontend.vercel.app',
        'http://localhost:8080'
    ],
    credentials: true
}));
```

Redeploy backend after this change.

### ⚠️ Environment Variables Not Working

Vercel doesn't automatically inject env vars into static HTML.

**Solution:** Use the `inject-env.js` script or hardcode in `config.js`

---

## Custom Domain (Optional)

### Add Your Own Domain:

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain (e.g., `menu.yourrestaurant.com`)
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5-60 minutes)

### DNS Settings (Example for Namecheap/GoDaddy):

| Type | Name | Value |
|------|------|-------|
| CNAME | menu | cname.vercel-dns.com |

Or use Vercel's nameservers for easier setup.

---

## Auto-Deploy Setup

Vercel automatically deploys when you push to GitHub.

**To disable:**
1. Settings → Git
2. Uncheck **"Production Branch"**

**To deploy specific branch:**
1. Settings → Git
2. Set **"Production Branch"** to your branch name

---

## Performance Optimization

### Enable Caching:

Already configured in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Add Analytics:

1. In Vercel Dashboard → Analytics
2. Enable Vercel Analytics
3. Add script to `index.html`:
```html
<script defer src="/_vercel/insights/script.js"></script>
```

---

## Important Notes

### 🔒 Security
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Enable HTTPS (automatic on Vercel)

### 🔄 Updates
- Push to GitHub → Auto-deploys to Vercel
- Check deployment status in Vercel dashboard
- Rollback available in Deployments tab

### 📱 Mobile Optimization
- Test on actual mobile devices
- Check responsive design
- Test QR code scanning

### 🌐 Multiple Environments
- **Production:** `main` branch → `menu.vercel.app`
- **Preview:** Other branches → `menu-git-branch.vercel.app`
- **Development:** Local → `localhost:8080`

---

## Vercel Free Tier Limits

✅ **Included:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Serverless functions (100 GB-hours)

⚠️ **Limits:**
- 100 deployments/day
- 6,000 build minutes/month

**Upgrade:** $20/month for Pro tier (more bandwidth & features)

---

## Next Steps

1. ✅ Frontend deployed on Vercel
2. ✅ Backend deployed on Render
3. ➡️ Generate QR codes
4. ➡️ Print and place QR codes on tables
5. ➡️ Test with real customers
6. ➡️ Monitor orders and feedback

---

## Complete System URLs

After deployment, you'll have:

- **Frontend (Customer):** `https://your-frontend.vercel.app`
- **Backend API:** `https://your-backend.onrender.com`
- **Health Check:** `https://your-backend.onrender.com/api/health`
- **Menu API:** `https://your-backend.onrender.com/api/menu`

---

## Support

**Vercel Documentation:** https://vercel.com/docs
**Deployment Guides:** https://vercel.com/docs/deployments/overview

**Common Issues:**
- Build failures: Check root directory setting
- 404 errors: Verify file paths and routing
- API errors: Check backend URL in config.js
- CORS errors: Update backend CORS settings

---

## Quick Redeploy

If you need to redeploy:

```powershell
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys in 1-2 minutes
```

Or manually trigger:
1. Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment
