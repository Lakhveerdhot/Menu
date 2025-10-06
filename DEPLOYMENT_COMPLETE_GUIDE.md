# 🚀 Complete Deployment Guide (Node Only - No Nodemon)

## ✅ Pre-Deployment Checklist

### 1. Verify Node Configuration (NOT Nodemon)
Your `backend/package.json` already has correct configuration:
```json
"scripts": {
  "start": "node server.js"  ← This will be used in production
}
```
✅ **NO NODEMON IN PRODUCTION - Already configured correctly!**

---

## 📋 STEP 1: Remove Old Deployments

### A. Remove Old Render Deployment

1. Go to https://dashboard.render.com
2. Login to your account
3. Find your old backend service
4. Click on the service name
5. Go to **Settings** (bottom left)
6. Scroll down to **Danger Zone**
7. Click **Delete Web Service**
8. Type the service name to confirm
9. Click **Delete**

### B. Remove Old Vercel Deployment

1. Go to https://vercel.com/dashboard
2. Login to your account
3. Find your old frontend project
4. Click on the project
5. Go to **Settings** tab
6. Scroll down to **Delete Project**
7. Click **Delete**
8. Type the project name to confirm
9. Click **Delete**

---

## 📋 STEP 2: Push Latest Code to GitHub

```powershell
# Make sure you're in the project directory
cd e:\EDUBOSS\menu

# Check current status
git status

# If changes exist, commit them
git add .
git commit -m "Final deployment ready - node only configuration"

# Push to GitHub
git push origin dev

# Or push to main branch if needed
git push origin main
```

---

## 📋 STEP 3: Deploy Backend to Render

### 3.1 Create New Web Service

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select your repository: `menu` or `Lakhveerdhot/Menu`
5. Click **Connect**

### 3.2 Configure Service

Fill in these details:

**Basic Settings:**
- **Name**: `restaurant-menu-backend` (or any name you want)
- **Region**: `Singapore` (closest to India)
- **Branch**: `dev` (or `main` - whichever has your code)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start` ← **This uses node, NOT nodemon**
- **Instance Type**: `Free`

### 3.3 Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these one by one:

```
PORT=5002

RESTAURANT_NAME=My Restaurant

RESTAURANT_TAGLINE=Delicious Food, Great Service

MENU_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0

ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

EMAIL_USER=lakhveer.eduboss@gmail.com

EMAIL_PASSWORD=your-gmail-app-password-here

OWNER_EMAIL=lakhveer.eduboss@gmail.com
```

**IMPORTANT:** Replace:
- `YOUR_SHEET_ID` with your actual Google Sheet ID
- `YOUR_SCRIPT_ID` with your actual Apps Script ID
- `your-gmail-app-password-here` with your 16-character Gmail App Password

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait 2-3 minutes for deployment
3. Once deployed, you'll see: **"Your service is live at https://restaurant-menu-backend-xxxx.onrender.com"**
4. **COPY THIS URL** - you'll need it for frontend

### 3.5 Verify Backend is Working

1. Open: `https://your-backend-url.onrender.com/api/health`
2. You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "googleSheets": "enabled"
}
```

---

## 📋 STEP 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Config

**BEFORE deploying frontend**, update the backend URL:

Open `frontend/config.js` and update:
```javascript
window.API_CONFIG = {
    BASE_URL: window.BACKEND_URL || 'https://your-backend-url.onrender.com'
};
```

Replace `https://your-backend-url.onrender.com` with your actual Render URL from Step 3.4

**Commit and push this change:**
```powershell
git add frontend/config.js
git commit -m "Updated backend URL for production"
git push origin dev
```

### 4.2 Create New Vercel Project

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. **Import Git Repository**
4. Select your GitHub repository
5. Click **Import**

### 4.3 Configure Project

**Framework Preset:** Other

**Root Directory:** Click **Edit** → Select `frontend`

**Build Settings:**
- Build Command: (leave empty)
- Output Directory: `./`
- Install Command: (leave empty)

### 4.4 Add Environment Variable (Optional)

Click **Environment Variables**:
- **Key**: `BACKEND_URL`
- **Value**: `https://your-backend-url.onrender.com`
- Click **Add**

### 4.5 Deploy

1. Click **Deploy**
2. Wait 1-2 minutes
3. Once deployed: **"Your project is live at https://your-project.vercel.app"**
4. **COPY THIS URL** - this is your restaurant website!

---

## 📋 STEP 5: Test Everything

### 5.1 Test Backend
1. Open: `https://your-backend-url.onrender.com/api/health`
2. Should show status "ok"

### 5.2 Test Frontend
1. Open: `https://your-project.vercel.app`
2. Menu should load
3. Add items to cart
4. Place test order with your email
5. Check if order is saved to Google Sheets
6. Check if email is received

### 5.3 Check Logs

**Render Logs:**
1. Go to Render Dashboard
2. Click on your service
3. Click **Logs** tab
4. Look for:
   - ✅ Server running on http://localhost:5002
   - ✅ Email sent successfully

---

## 📋 STEP 6: Generate QR Codes for Tables

Use your Vercel URL to create QR codes:

**Table URLs:**
- Table 1: `https://your-project.vercel.app?table=1`
- Table 2: `https://your-project.vercel.app?table=2`
- Table 3: `https://your-project.vercel.app?table=3`
- etc.

**Generate QR Codes:**
- Use: https://www.qr-code-generator.com/
- Or: https://qr.io/

---

## 🔧 Troubleshooting

### Issue 1: Backend not starting
**Check Render Logs:**
- Look for error messages
- Verify environment variables are set correctly

### Issue 2: Frontend can't connect to backend
**Fix:**
1. Check `frontend/config.js` has correct backend URL
2. Verify CORS is enabled in backend (already done)
3. Check Render service is running

### Issue 3: Email not sending
**Fix:**
1. Verify EMAIL_USER and EMAIL_PASSWORD in Render environment variables
2. Make sure you're using Gmail App Password (not regular password)
3. Check Render logs for email errors

### Issue 4: Render free tier sleeps after 15 min
**This is normal:**
- First request after sleep takes 30 seconds to wake up
- Subsequent requests are fast
- Upgrade to paid plan to avoid sleeping

---

## ✅ Final Verification

- [ ] Old Render deployment deleted
- [ ] Old Vercel deployment deleted
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render with `npm start` (node only)
- [ ] Frontend deployed to Vercel
- [ ] Backend health check working
- [ ] Frontend loading menu
- [ ] Test order placed successfully
- [ ] Email received
- [ ] Google Sheets updated
- [ ] QR codes generated

---

## 🎉 Deployment Complete!

**Your URLs:**
- **Frontend (Customer)**: https://your-project.vercel.app
- **Backend API**: https://your-backend-url.onrender.com

**Important Notes:**
1. ✅ Production uses `node server.js` (NO nodemon)
2. ✅ Render automatically runs `npm start` which uses node
3. ✅ Free tier has limitations (server sleeps after 15 min)
4. ✅ All environment variables must be set in Render dashboard
5. ✅ Never commit .env file to GitHub

---

## 📞 Support

If you face any issues:
1. Check Render logs
2. Check browser console (F12)
3. Verify all environment variables
4. Test backend health endpoint
