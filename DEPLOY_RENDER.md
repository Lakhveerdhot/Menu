# 🚀 Deploy Backend to Render

Complete guide to deploy your restaurant menu backend to Render.

## Prerequisites

- GitHub account with your code pushed
- Render account (free tier available at https://render.com)
- Google Sheet URL for menu (optional)
- Gmail App Password for email notifications (optional)

---

## Step 1: Remove Old Deployment (if exists)

If you have a previous deployment on Render:

1. Go to https://dashboard.render.com
2. Find your old backend service
3. Click on the service name
4. Go to **Settings** (bottom of left sidebar)
5. Scroll down and click **"Delete Web Service"**
6. Type the service name to confirm deletion
7. Wait for deletion to complete

---

## Step 2: Push Code to GitHub

```powershell
# Make sure you're in the project root
cd e:\EDUBOSS\menu

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Clean deployment ready"

# Push to GitHub
git push origin main
```

**Note:** Replace `main` with your branch name if different (e.g., `dev`, `master`)

---

## Step 3: Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Connect your GitHub repository:
   - Click **"Connect GitHub"** (if not connected)
   - Find and select your repository
   - Click **"Connect"**

---

## Step 4: Configure Service Settings

### Basic Settings:

| Field | Value |
|-------|-------|
| **Name** | `menu-backend` (or any name you prefer) |
| **Region** | Select closest to your location |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Instance Type:
- Select **"Free"** (or paid if needed)

---

## Step 5: Add Environment Variables

Click **"Advanced"** and add these environment variables:

### Required Variables:

```env
PORT=5000
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Delicious Food, Great Service
```

### Optional - Google Sheets Integration:

```env
MENU_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Optional - Email Notifications:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
OWNER_EMAIL=owner@gmail.com
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not enabled)
3. Create new App Password for "Mail"
4. Copy the 16-character password (remove spaces)
5. Use this as `EMAIL_PASSWORD`

---

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Watch the logs for any errors
4. Once deployed, you'll see: **"Your service is live 🎉"**

---

## Step 7: Get Your Backend URL

After deployment:
1. Copy the URL shown at top (e.g., `https://menu-backend-xxxx.onrender.com`)
2. Test it by visiting: `https://your-backend-url.onrender.com/api/health`
3. You should see: `{"status":"ok","timestamp":"..."}`

---

## Step 8: Update Frontend Config

You need to update your frontend to use this backend URL:

**Option A: Using config.js (Recommended for Vercel)**

Edit `frontend/config.js`:
```javascript
window.ENV = {
    API_BASE_URL: 'https://your-backend-url.onrender.com'
};
```

**Option B: Direct in script.js**

Edit `frontend/script.js` (line 2):
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com';
```

---

## Troubleshooting

### ❌ Build Failed

**Check logs for:**
- Missing dependencies: Make sure `package.json` is correct
- Node version: Render uses Node 18+ by default

**Fix:** Add `.node-version` file in backend folder:
```
18.17.0
```

### ❌ Service Crashes After Deploy

**Common causes:**
1. Missing environment variables
2. Port not set correctly (must be `PORT=5000` or use `process.env.PORT`)
3. Database connection issues

**Check logs:**
- Click on "Logs" tab in Render dashboard
- Look for error messages

### ❌ CORS Errors

Your backend already has CORS enabled. If you still get errors:

Edit `backend/server.js` and update CORS origin:
```javascript
app.use(cors({
    origin: 'https://your-frontend-url.vercel.app',
    credentials: true
}));
```

### ⚠️ Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

**Solution:** Upgrade to paid tier ($7/month) for always-on service

---

## Important Notes

### 🔒 Security
- Never commit `.env` file to GitHub
- Use environment variables in Render dashboard
- Keep API keys and passwords secure

### 🔄 Auto-Deploy
- Render auto-deploys when you push to GitHub
- Disable in Settings > Build & Deploy if needed

### 📊 Monitoring
- Check logs regularly: Dashboard > Logs
- Set up email alerts: Settings > Notifications

### 💾 Data Persistence
- Orders are saved to `backend/data/orders.json`
- This file is **NOT persistent** on Render free tier
- Use Google Sheets webhook for permanent storage
- Or upgrade to paid tier with persistent disk

---

## Next Steps

1. ✅ Backend deployed on Render
2. ➡️ Deploy frontend to Vercel (see `DEPLOY_VERCEL.md`)
3. ➡️ Test the complete system
4. ➡️ Generate QR codes with your frontend URL

---

## Support

**Render Documentation:** https://render.com/docs
**Node.js on Render:** https://render.com/docs/deploy-node-express-app

**Common Issues:**
- Service not starting: Check environment variables
- 503 errors: Service is spinning up (wait 30-60s)
- Build errors: Check `package.json` and Node version
