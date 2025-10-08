# 🍽️ Restaurant QR Menu & Ordering System

A modern, **pure HTML/CSS/JavaScript** restaurant ordering system with QR code menu scanning, real-time order management, and Google Sheets integration. **No backend server needed!**

## ✨ Features

- 📱 **QR Code Menu Access** - Customers scan and browse menu instantly
- 🛒 **Shopping Cart** - Add items, customize quantities
- 📝 **Order Placement** - Simple checkout with customer details
- 📊 **Google Sheets Integration** - All orders saved automatically
- 📧 **Email Notifications** - Instant confirmations to customers and owner
- 🔄 **Auto Sheet Rotation** - Creates new sheet at 10,000 orders
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful, intuitive interface
- ⚡ **Serverless** - No Node.js or Express needed
- 💰 **100% Free** - GitHub Pages + Google Apps Script

## 🚀 Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript** (Pure vanilla - no frameworks!)
- Responsive design
- No build process needed
- Deploy anywhere (GitHub Pages, Vercel, Netlify)

### Backend
- **Google Apps Script** (Serverless, free forever)
- Runs on Google's infrastructure
- Auto-scales, never goes down
- Built-in email service

### Database
- **Google Sheets** (Free, unlimited storage)
- Real-time updates
- Easy to view and export
- Auto-rotation at 10,000 rows

## 📁 Project Structure

```
restaurant-menu-system/
├── frontend/                          # Pure HTML/CSS/JS (Deploy this!)
│   ├── index.html                    # Main menu page
│   ├── view-order.html               # Order tracking page
│   ├── styles.css                    # All styles
│   ├── script.js                     # Frontend logic
│   ├── config.js                     # API configuration ⚙️
│   └── vercel.json                   # Vercel config
│
├── GOOGLE_APPS_SCRIPT_BACKEND.js     # Copy to Google Apps Script
├── DEPLOY_GITHUB_PAGES.md            # Full deployment guide
├── QUICK_START.md                    # 10-minute setup
└── README.md                         # This file
```

## 🚀 Quick Start - Deploy in 10 Minutes!

**📖 Complete Guides Available:**
- **Hindi Guide:** `DEPLOYMENT_GUIDE_GITHUB.md` - Step-by-step Hindi me
- **Quick Commands:** `QUICK_DEPLOY_COMMANDS.md` - Copy-paste commands
- **Checklist:** `DEPLOYMENT_CHECKLIST.md` - Complete verification checklist

---

## 🛠️ Quick Setup (10 Minutes)

### **Step 1: Setup Google Sheets** (2 min)

1. Create new spreadsheet: "Restaurant Menu"
2. Create sheet `menu1`:
   ```
   ID | Name | Description | Price | Category | Image
   1  | Paneer Tikka | Grilled cottage cheese | 250 | Starters |
   ```
3. Create sheet `Orders`:
   ```
   Timestamp | Order ID | Table | Customer Name | Mobile | Email | Items | Total
   ```
4. Share → Anyone with link → Viewer

### **Step 2: Deploy Backend** (3 min)

1. In Google Sheet: **Extensions → Apps Script**
2. Copy code from `GOOGLE_APPS_SCRIPT_BACKEND.js`
3. Update CONFIG (restaurant name, owner email)
4. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Access: Anyone
5. Copy Web App URL

### **Step 3: Update Frontend** (1 min)

Edit `frontend/config.js`:
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
```

### **Step 4: Push to GitHub** (2 min)

```bash
git init
git add .
git commit -m "Restaurant menu system"
git remote add origin https://github.com/YOUR_USERNAME/restaurant-menu.git
git push -u origin main
```

### **Step 5: Deploy to GitHub Pages** (2 min)

1. GitHub repo → **Settings → Pages**
2. Source: `main` branch
3. Folder: `/frontend`
4. Save

**Done! Live at:** `https://YOUR_USERNAME.github.io/restaurant-menu/`

## 📖 Full Documentation

- **Quick Start**: See `QUICK_START.md`
- **Detailed Guide**: See `DEPLOY_GITHUB_PAGES.md`
- **Backend Code**: See `GOOGLE_APPS_SCRIPT_BACKEND.js`

## 🌐 Deployment Options

| Platform | Cost | Setup Time | Best For |
|----------|------|------------|----------|
| **GitHub Pages** | Free | 2 min | Recommended |
| **Vercel** | Free | 1 min | Auto-deploy |
| **Netlify** | Free | 1 min | Drag & drop |
| **Any Static Host** | Free | Varies | Flexibility |

## 📊 How It Works

```
Customer → QR Code → Website (GitHub Pages)
                          ↓
                    Browse Menu (from Google Sheets)
                          ↓
                    Place Order
                          ↓
              Google Apps Script Backend
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
  Save to Sheet    Send Email (Customer)  Send Email (Owner)
```

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| GitHub Pages | **Free** |
| Google Apps Script | **Free** |
| Google Sheets | **Free** |
| Gmail (100 emails/day) | **Free** |
| Domain (optional) | $10/year |
| **Total** | **$0/month** 🎉 |

## 📱 Generate QR Code

1. Deploy your frontend to a public URL (see Deployment section below)
2. Go to [QR Code Generator](https://www.qr-code-generator.com/)
3. Enter your frontend URL
4. Download and print the QR code
5. Place on restaurant tables

## 📦 Deployment

**Complete deployment guides available:**

- **Quick Start:** See `DEPLOYMENT_GUIDE.md` for overview
- **Backend (Render):** See `DEPLOY_RENDER.md` for detailed steps
- **Frontend (Vercel):** See `DEPLOY_VERCEL.md` for detailed steps

**Quick Summary:**
1. Deploy backend to Render (free tier available)
2. Update `frontend/config.js` with backend URL
3. Deploy frontend to Vercel (free tier available)
4. Generate QR code with your frontend URL
5. Print and place on tables

## 🔧 Troubleshooting

**Menu not loading?**
- Check if backend is running (`http://localhost:5000/api/health`)
- Verify `API_BASE_URL` in frontend matches backend URL
- If using Google Sheets, ensure sheet is publicly viewable

**Orders not saving?**
- Check backend console for errors
- Verify `backend/data/orders.json` file is created
- Check file permissions

**Backend not starting?**
- Port 5000 already in use? Change PORT in `.env`
- Missing dependencies? Run `npm install` in backend folder
- Check `.env` file syntax

**Frontend can't connect to backend?**
- CORS error? Backend has CORS enabled by default
- Wrong URL? Check `API_BASE_URL` in `frontend/script.js`
- Backend not running? Start it with `npm run dev`

## 📚 Additional Resources

- **Backend README:** `backend/README.md`
- **Frontend README:** `frontend/README.md`
- **Deployment Guides:** `DEPLOYMENT_GUIDE.md`, `DEPLOY_RENDER.md`, `DEPLOY_VERCEL.md`

## 💡 Tips

1. **Start Simple:** Use fallback menu first, add Google Sheets later
2. **Test Locally:** Test everything on localhost before deploying
3. **Mobile First:** Always test on mobile devices (your customers will use phones)
4. **Backup Orders:** Regularly backup `backend/data/orders.json`
5. **Monitor Orders:** Check orders file regularly or set up notifications

## 🎯 Next Steps

1. ✅ Setup backend and frontend locally
2. ✅ Test the ordering flow
3. ✅ Customize colors and restaurant name
4. ✅ Add your menu items
5. ✅ Deploy to production
6. ✅ Generate QR codes
7. ✅ Print and place QR codes on tables
8. ✅ Start receiving orders!

## 📄 License

ISC License - Free to use and modify
