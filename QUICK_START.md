# ⚡ Quick Start - Deploy in 10 Minutes

## 🎯 What You're Building
A complete restaurant menu ordering system with:
- ✅ Pure HTML/CSS/JavaScript (No Node.js!)
- ✅ Google Apps Script backend (Free, serverless)
- ✅ Google Sheets database (Free, unlimited)
- ✅ Email notifications (Built-in)
- ✅ GitHub Pages hosting (Free)

---

## 📝 Prerequisites
- Google account
- GitHub account
- Your menu items ready

---

## 🚀 5-Step Deployment

### **Step 1: Setup Google Sheet (2 minutes)**

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet: "Restaurant Menu"
3. Create two sheets:

**Sheet 1: `menu1`**
```
ID | Name | Description | Price | Category | Image
1  | Paneer Tikka | Grilled cottage cheese | 250 | Starters | 
2  | Butter Chicken | Creamy tomato curry | 350 | Main Course |
```

**Sheet 2: `Orders`**
```
Timestamp | Order ID | Table | Customer Name | Mobile | Email | Items | Total
```

4. Share → Anyone with link → Viewer
5. Copy sheet URL

---

### **Step 2: Deploy Backend (3 minutes)**

1. In Google Sheet: **Extensions → Apps Script**
2. Delete existing code
3. Copy code from `GOOGLE_APPS_SCRIPT_BACKEND.js`
4. Update CONFIG:
   ```javascript
   RESTAURANT_NAME: 'Your Restaurant',
   OWNER_EMAIL: 'your@email.com'
   ```
5. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Access: Anyone
6. **Copy Web App URL**
7. Authorize when prompted

---

### **Step 3: Update Frontend (1 minute)**

1. Open `frontend/config.js`
2. Replace:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_URL_HERE';
   ```
   With your Web App URL from Step 2

---

### **Step 4: Push to GitHub (2 minutes)**

```bash
git init
git add .
git commit -m "Restaurant menu system"
git remote add origin https://github.com/YOUR_USERNAME/restaurant-menu.git
git push -u origin main
```

---

### **Step 5: Deploy to GitHub Pages (2 minutes)**

1. Go to your GitHub repository
2. **Settings → Pages**
3. Source: `main` branch
4. Folder: `/frontend`
5. Save

**Done! Your site is live at:**
`https://YOUR_USERNAME.github.io/restaurant-menu/`

---

## ✅ Test Your Website

1. Open your GitHub Pages URL
2. Menu should load from Google Sheets
3. Add items to cart
4. Place test order
5. Check Google Sheets → Orders tab
6. Check your email for notifications

---

## 🎨 Customize

### **Update Menu**
- Edit Google Sheet `menu1` → Changes appear instantly

### **Change Branding**
- Edit `CONFIG` in Google Apps Script
- Redeploy: Deploy → Manage deployments → Edit → Deploy

### **Styling**
- Edit `frontend/styles.css`
- Commit and push to GitHub

---

## 🐛 Common Issues

**Menu not loading?**
- Check Google Sheet is public
- Verify Apps Script URL in config.js

**Orders not saving?**
- Check Apps Script deployment (Anyone access)
- Check Apps Script logs

**GitHub Pages not working?**
- Wait 2-3 minutes after enabling
- Check repository is public

---

## 📁 File Structure

```
restaurant-menu/
├── frontend/                    ← Deploy this folder
│   ├── index.html              ← Main page
│   ├── view-order.html         ← Order tracking
│   ├── styles.css              ← Styling
│   ├── script.js               ← Logic
│   └── config.js               ← Update this!
│
├── GOOGLE_APPS_SCRIPT_BACKEND.js  ← Copy to Apps Script
├── DEPLOY_GITHUB_PAGES.md         ← Full guide
└── QUICK_START.md                 ← This file
```

---

## 🎉 You're Live!

Share your URL: `https://YOUR_USERNAME.github.io/restaurant-menu/`

**Total Cost: $0/month** 🎊
**Total Time: 10 minutes** ⚡
**Maintenance: Zero** 🚀

---

## 📞 Need Help?

1. Read full guide: `DEPLOY_GITHUB_PAGES.md`
2. Check browser console (F12)
3. Check Apps Script logs
4. Verify all URLs match

**Happy Ordering! 🍽️**
