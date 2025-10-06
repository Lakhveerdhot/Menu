# ⚡ Quick Deploy Instructions

## 🎯 Automated Deployment Steps

### 1️⃣ Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

### 2️⃣ Deploy Backend to Render

**Option A: Using Render Dashboard**

1. Visit: https://dashboard.render.com/select-repo
2. Connect your GitHub repository
3. Click on your repository
4. Render will auto-detect `backend/render.yaml`
5. Click **"Apply"**
6. Add environment variables (see below)
7. Click **"Create Web Service"**

**Option B: Using Render Blueprint (Recommended)**

1. Click this button: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
2. Connect your GitHub repo
3. Render will use `backend/render.yaml` automatically
4. Fill in environment variables
5. Deploy!

**Required Environment Variables:**
```
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Delicious Food, Great Service
MENU_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0
ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
OWNER_EMAIL=owner@example.com
```

**Your Backend URL will be:**
```
https://restaurant-menu-backend-xxxx.onrender.com
```
📋 **Copy this URL - you'll need it for frontend deployment!**

---

### 3️⃣ Deploy Frontend to Vercel

**Option A: Using Vercel CLI (Fastest)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? restaurant-menu (or your choice)
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: .
#   - Install Command: echo 'No dependencies'

# Add environment variable
vercel env add VITE_BACKEND_URL production
# Paste your Render backend URL when prompted

# Redeploy with environment variable
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Visit: https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.`
   - **Install Command**: `echo 'No dependencies'`
4. Add Environment Variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: Your Render backend URL
   - **Environment**: Production
5. Click **"Deploy"**

**Your Frontend URL will be:**
```
https://your-project.vercel.app
```

---

## ✅ Verification Checklist

### Backend Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "googleSheets": "enabled",
  "ordersWebhook": "configured"
}
```

### Frontend Test
1. Open: `https://your-project.vercel.app`
2. Menu should load automatically
3. Add items to cart
4. Place a test order
5. Check Google Sheets for the order

---

## 🎉 You're Live!

**Frontend URL (Share this with customers):**
```
https://your-project.vercel.app
```

**Backend API URL:**
```
https://your-backend.onrender.com
```

### Create QR Code for Easy Access

1. Visit: https://www.qr-code-generator.com/
2. Enter your frontend URL
3. Download QR code
4. Print and place on restaurant tables

---

## 🔄 Auto-Deployment

Both Render and Vercel are now connected to your GitHub repository:

- **Push to GitHub** → **Auto-deploys** to Render & Vercel
- No manual deployment needed after initial setup!

```bash
# Make changes
git add .
git commit -m "Update menu"
git push origin main

# Wait 2-3 minutes - both services auto-deploy! 🚀
```

---

## 📞 Support

If you encounter issues:

1. **Check Render Logs**: https://dashboard.render.com → Your Service → Logs
2. **Check Vercel Logs**: https://vercel.com/dashboard → Your Project → Deployments
3. **Test Backend**: Visit `/api/health` endpoint
4. **Check Browser Console**: F12 → Console tab

---

## 🎯 Next Steps

- [ ] Test the live application
- [ ] Update Google Sheets with your menu
- [ ] Configure email notifications
- [ ] Create QR codes for tables
- [ ] Share the link with customers

**Your restaurant menu is now live and accessible to anyone with the URL! 🎊**
