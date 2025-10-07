# 🚀 Complete Deployment Guide

Quick guide to deploy your Restaurant QR Menu System to production.

## 📋 Overview

- **Backend:** Deploy to Render (Node.js API)
- **Frontend:** Deploy to Vercel (Static HTML/CSS/JS)
- **Total Time:** 15-20 minutes
- **Cost:** FREE (using free tiers)

---

## 🎯 Quick Steps

### 1️⃣ Remove Old Deployments

#### Remove from Render:
1. Go to https://dashboard.render.com
2. Select old backend service → Settings → Delete Web Service

#### Remove from Vercel:
1. Go to https://vercel.com/dashboard
2. Select old frontend project → Settings → Delete Project

---

### 2️⃣ Deploy Backend to Render

**Detailed Guide:** See `DEPLOY_RENDER.md`

**Quick Steps:**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   ```
   PORT=5000
   RESTAURANT_NAME=Your Restaurant
   RESTAURANT_TAGLINE=Great Food
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=app-password
   OWNER_EMAIL=owner@gmail.com
   ```
6. Deploy and copy the backend URL

---

### 3️⃣ Update Frontend Config

Edit `frontend/config.js`:
```javascript
window.ENV = {
    API_BASE_URL: 'https://your-backend.onrender.com'
};
```

Commit and push:
```powershell
git add frontend/config.js
git commit -m "Update backend URL"
git push origin main
```

---

### 4️⃣ Deploy Frontend to Vercel

**Detailed Guide:** See `DEPLOY_VERCEL.md`

**Quick Steps:**
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** Leave empty
4. Deploy
5. Copy the frontend URL

---

### 5️⃣ Test System

1. Open frontend URL in browser
2. Browse menu
3. Add items to cart
4. Place test order
5. Check email for confirmation

---

### 6️⃣ Generate QR Code

1. Go to https://www.qr-code-generator.com/
2. Enter your frontend URL
3. Download QR code
4. Print and place on tables

---

## 📱 Your Live URLs

After deployment:

- **Customer Menu:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.onrender.com`
- **Health Check:** `https://your-backend.onrender.com/api/health`

---

## 🔧 Environment Variables Reference

### Backend (Render Dashboard)

**Required:**
```env
PORT=5000
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Delicious Food, Great Service
```

**Optional - Email Notifications:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
OWNER_EMAIL=owner@gmail.com
```

**Optional - Google Sheets:**
```env
MENU_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/edit
ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

### Frontend (Vercel Dashboard)

Not required - use `config.js` instead.

---

## 🐛 Common Issues

### Backend Issues

**❌ Build Failed**
- Check `package.json` in backend folder
- Verify Node version (18+)

**❌ Service Crashes**
- Check environment variables are set
- View logs in Render dashboard

**❌ 503 Error**
- Free tier spins down after 15 min
- Wait 30-60 seconds for service to wake up

### Frontend Issues

**❌ 404 Not Found**
- Set Root Directory to `frontend` in Vercel

**❌ API Not Working**
- Check backend URL in `config.js`
- Verify backend is running

**❌ CORS Error**
- Update CORS settings in `backend/server.js`
- Add your Vercel URL to allowed origins

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)

**Render Free:**
- 750 hours/month
- Service spins down after 15 min inactivity
- 30-60s wake-up time

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- Always on

**Total: $0/month**

### Paid Tier (Recommended for Production)

**Render Starter:**
- $7/month
- Always on
- No spin-down

**Vercel Pro:**
- $20/month (optional)
- More bandwidth
- Advanced features

**Total: $7-27/month**

---

## 📊 Monitoring

### Check Backend Health
```
https://your-backend.onrender.com/api/health
```

### View Logs
- **Render:** Dashboard → Logs tab
- **Vercel:** Dashboard → Deployments → View Logs

### Email Notifications
- Customer receives order confirmation
- Owner receives order notification

---

## 🔄 Making Updates

### Update Backend
```powershell
# Make changes to backend code
git add backend/
git commit -m "Update backend"
git push origin main

# Render auto-deploys in 2-3 minutes
```

### Update Frontend
```powershell
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys in 1-2 minutes
```

---

## 🎓 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test complete system
4. ✅ Generate QR codes
5. ✅ Print QR codes
6. ✅ Place on tables
7. ✅ Start receiving orders!

---

## 📚 Detailed Guides

- **Backend Deployment:** `DEPLOY_RENDER.md`
- **Frontend Deployment:** `DEPLOY_VERCEL.md`
- **Local Development:** `README.md`

---

## 🆘 Need Help?

**Render Support:** https://render.com/docs
**Vercel Support:** https://vercel.com/docs

**Common Questions:**
1. **How to get Gmail App Password?**
   - https://myaccount.google.com/apppasswords

2. **How to setup Google Sheets?**
   - See `README.md` → Google Sheets Setup

3. **How to add custom domain?**
   - See `DEPLOY_VERCEL.md` → Custom Domain

---

## ✅ Deployment Checklist

- [ ] Old deployments removed
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Environment variables set
- [ ] Backend URL copied
- [ ] Frontend config updated
- [ ] Frontend deployed to Vercel
- [ ] System tested end-to-end
- [ ] QR codes generated
- [ ] QR codes printed and placed

**🎉 Congratulations! Your system is live!**
