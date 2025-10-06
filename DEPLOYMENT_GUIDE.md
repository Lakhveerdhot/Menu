# 🚀 Deployment Guide

This guide will help you deploy your Restaurant Menu application to production.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to a GitHub repository
2. **Render Account** - Sign up at https://render.com (free)
3. **Vercel Account** - Sign up at https://vercel.com (free)
4. **Google Sheets Setup** - Menu sheet and Orders webhook configured

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `restaurant-menu-backend`
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables

In the Render dashboard, add these environment variables:

```
PORT=5000
NODE_ENV=production
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Your Tagline
MENU_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0
ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
OWNER_EMAIL=owner@example.com
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (3-5 minutes)
3. **Copy your backend URL**: `https://restaurant-menu-backend-xxxx.onrender.com`

⚠️ **Important**: Free tier services on Render spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create New Project on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.` (current directory)
   - **Install Command**: `echo 'No dependencies'`

### Step 2: Add Environment Variable

In Vercel project settings → Environment Variables:

```
VITE_BACKEND_URL=https://restaurant-menu-backend-xxxx.onrender.com
```

Replace with your actual Render backend URL from Part 1.

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. **Your frontend URL**: `https://your-project.vercel.app`

---

## ✅ Part 3: Test Your Deployment

### Test Backend
Visit: `https://restaurant-menu-backend-xxxx.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-06T...",
  "googleSheets": "enabled",
  "ordersWebhook": "configured"
}
```

### Test Frontend
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Menu should load from Google Sheets
3. Try placing a test order
4. Check Google Sheets for the order

---

## 🔄 Updating Your Deployment

### Backend Updates
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will auto-deploy in 2-3 minutes.

### Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel will auto-deploy in 1-2 minutes.

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: 503 Service Unavailable
- **Solution**: Free tier spins down. Wait 30-60 seconds and retry.

**Problem**: Menu not loading
- **Solution**: Check `MENU_SHEET_URL` in Render environment variables
- Ensure Google Sheet is publicly accessible

**Problem**: Orders not saving
- **Solution**: Check `ORDERS_WEBHOOK_URL` in Render environment variables
- Test webhook URL directly in browser

### Frontend Issues

**Problem**: Can't connect to backend
- **Solution**: Check `VITE_BACKEND_URL` in Vercel environment variables
- Ensure backend is deployed and running

**Problem**: CORS errors
- **Solution**: Backend already has CORS enabled. Check browser console for actual error.

---

## 📊 Monitoring

### Render Dashboard
- View logs: https://dashboard.render.com → Your Service → Logs
- Monitor uptime and performance

### Vercel Dashboard
- View deployments: https://vercel.com/dashboard
- Check analytics and performance

---

## 💰 Cost Breakdown

- **Render Free Tier**: 750 hours/month (enough for 1 service)
- **Vercel Free Tier**: Unlimited deployments, 100GB bandwidth
- **Total Cost**: $0/month 🎉

---

## 🎯 Production Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Google Sheets menu accessible
- [ ] Orders webhook working
- [ ] Email notifications working
- [ ] Test order placed successfully
- [ ] Order appears in Google Sheets
- [ ] Customer receives email confirmation

---

## 📱 Share Your App

Your restaurant menu is now live! Share this URL with customers:

```
https://your-project.vercel.app
```

Customers can:
- ✅ Scan QR code to access menu
- ✅ Browse menu items
- ✅ Place orders directly
- ✅ Receive order confirmation via email
- ✅ Track order status

No app download required - works in any browser! 🎉
