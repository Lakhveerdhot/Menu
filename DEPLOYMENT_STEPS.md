# 🚀 Your Deployment is Ready!

Your code has been prepared and pushed to GitHub. Now follow these simple steps to deploy:

---

## 📦 Step 1: Deploy Backend to Render (5 minutes)

### Option A: One-Click Deploy (Easiest)

1. **Visit Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub**: 
   - Click "Connect account" if not connected
   - Select repository: `Lakhveerdhot/Menu`
4. **Configure Service**:
   ```
   Name: restaurant-menu-backend
   Region: Oregon (or closest to you)
   Branch: dev
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   RESTAURANT_NAME=My Restaurant
   RESTAURANT_TAGLINE=Delicious Food, Great Service
   MENU_SHEET_URL=<Your Google Sheets Menu URL>
   ORDERS_WEBHOOK_URL=<Your Google Apps Script Webhook URL>
   EMAIL_USER=<Your Gmail>
   EMAIL_PASSWORD=<Your Gmail App Password>
   OWNER_EMAIL=<Owner Email>
   ```

6. **Click "Create Web Service"**
7. **Wait 3-5 minutes** for deployment
8. **Copy your backend URL**: It will look like:
   ```
   https://restaurant-menu-backend-xxxx.onrender.com
   ```

### Test Backend
Visit: `https://restaurant-menu-backend-xxxx.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "googleSheets": "enabled",
  "ordersWebhook": "configured"
}
```

---

## 🎨 Step 2: Deploy Frontend to Vercel (3 minutes)

### Option A: Vercel Dashboard (Recommended)

1. **Visit Vercel**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select: `Lakhveerdhot/Menu`
   - Click "Import"

3. **Configure Project**:
   ```
   Framework Preset: Other
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .
   Install Command: echo 'No dependencies'
   ```

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_BACKEND_URL
     Value: <Paste your Render backend URL from Step 1>
     ```
   - Select: Production, Preview, Development

5. **Click "Deploy"**
6. **Wait 1-2 minutes**
7. **Your frontend URL**: 
   ```
   https://menu-xxxx.vercel.app
   ```

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable
vercel env add VITE_BACKEND_URL production
# Paste your Render backend URL when prompted

# Deploy to production
vercel --prod
```

---

## ✅ Step 3: Test Your Live Application

### 1. Test Backend API
```bash
curl https://your-backend.onrender.com/api/health
```

### 2. Test Frontend
1. Open: `https://your-frontend.vercel.app`
2. Menu should load from Google Sheets
3. Add items to cart
4. Place a test order with:
   - Table Number: 1
   - Name: Test Customer
   - Mobile: 1234567890
   - Email: your-email@gmail.com

### 3. Verify Order
- Check your Google Sheets - order should appear
- Check email - confirmation should arrive

---

## 🎉 Deployment Complete!

### Your Live URLs:

**Frontend (Share with customers):**
```
https://your-project.vercel.app
```

**Backend API:**
```
https://your-backend.onrender.com
```

### Create QR Code:
1. Visit: https://www.qr-code-generator.com/
2. Enter your frontend URL
3. Download and print for restaurant tables

---

## 🔄 Future Updates

Any changes you push to GitHub will auto-deploy:

```bash
# Make changes to your code
git add .
git commit -m "Update menu"
git push origin dev

# Wait 2-3 minutes - auto-deploys to both Render & Vercel! 🚀
```

---

## 📊 Important Notes

### Render Free Tier:
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after inactivity takes 30-60 seconds
- 750 hours/month free (enough for 1 service)

### Vercel Free Tier:
- ✅ Always online, no spin-down
- 100GB bandwidth/month
- Unlimited deployments

### Solution for Render Spin-Down:
- Use a service like **UptimeRobot** (free) to ping your backend every 5 minutes
- Visit: https://uptimerobot.com/
- Add monitor: `https://your-backend.onrender.com/api/health`
- Interval: 5 minutes

---

## 🐛 Troubleshooting

### Backend not responding:
- Wait 60 seconds (free tier spin-up time)
- Check Render logs: https://dashboard.render.com

### Frontend can't connect to backend:
- Verify `VITE_BACKEND_URL` in Vercel settings
- Check browser console (F12) for errors
- Ensure backend is running

### Menu not loading:
- Check Google Sheets URL is correct
- Ensure sheet is publicly accessible
- Check backend logs

### Orders not saving:
- Verify Google Apps Script webhook URL
- Test webhook directly in browser
- Check backend logs

---

## 📞 Need Help?

1. **Check Logs**:
   - Render: https://dashboard.render.com → Your Service → Logs
   - Vercel: https://vercel.com/dashboard → Your Project → Deployments

2. **Test Endpoints**:
   - Backend health: `/api/health`
   - Restaurant info: `/api/restaurant-info`
   - Menu: `/api/menu`

3. **Browser Console**: Press F12 → Console tab

---

## 🎯 Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads successfully
- [ ] Menu displays from Google Sheets
- [ ] Test order placed successfully
- [ ] Order appears in Google Sheets
- [ ] Email confirmation received
- [ ] QR code created
- [ ] Shared URL with customers

**Your restaurant menu is now LIVE! 🎊**

Anyone can access it from any browser - no download needed!
