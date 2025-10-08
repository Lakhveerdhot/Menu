# 🚀 Deploy Pure HTML/CSS/JS Website to GitHub Pages

## ✅ What You Have Now
- **Pure HTML/CSS/JavaScript frontend** (No Node.js needed!)
- **Google Apps Script backend** (Serverless, free forever)
- **Google Sheets database** (Free, unlimited storage)
- **Ready to deploy to GitHub Pages** (Free hosting)

---

## 📋 Step-by-Step Deployment Guide

### **Step 1: Setup Google Sheets**

1. **Create a new Google Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it: "Restaurant Menu System"

2. **Create Menu Sheet**
   - Rename first sheet to: `menu1`
   - Add headers in Row 1:
     ```
     ID | Name | Description | Price | Category | Image
     ```
   - Add your menu items starting from Row 2:
     ```
     1 | Paneer Tikka | Grilled cottage cheese | 250 | Starters | https://example.com/image.jpg
     2 | Butter Chicken | Creamy tomato curry | 350 | Main Course |
     ```

3. **Create Orders Sheet**
   - Add a new sheet named: `Orders`
   - Add headers in Row 1:
     ```
     Timestamp | Order ID | Table | Customer Name | Mobile | Email | Items | Total
     ```

4. **Make Menu Sheet Public**
   - Click "Share" button (top right)
   - Click "Change to anyone with the link"
   - Set to "Viewer"
   - Copy the sheet URL

---

### **Step 2: Deploy Google Apps Script Backend**

1. **Open Script Editor**
   - In your Google Sheet, go to: **Extensions → Apps Script**
   - Delete any existing code

2. **Copy Backend Code**
   - Open file: `GOOGLE_APPS_SCRIPT_BACKEND.js` from your project
   - Copy ALL the code
   - Paste it into the Apps Script editor

3. **Configure Settings** (in the script)
   - Update these values at the top:
     ```javascript
     const CONFIG = {
       RESTAURANT_NAME: 'Your Restaurant Name',
       RESTAURANT_TAGLINE: 'Your Tagline',
       MENU_SHEET_NAME: 'menu1',
       ORDERS_SHEET_NAME: 'Orders',
       MAX_ROWS_PER_SHEET: 10000,
       OWNER_EMAIL: 'your-email@gmail.com',
       CUSTOMER_EMAIL_ENABLED: true
     };
     ```

4. **Deploy as Web App**
   - Click **Deploy → New deployment**
   - Click gear icon ⚙️ → Select "Web app"
   - Settings:
     - **Description**: Restaurant Menu Backend
     - **Execute as**: Me
     - **Who has access**: Anyone
   - Click **Deploy**
   - **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)
   - Click **Done**

5. **Authorize the Script**
   - First time: Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"

---

### **Step 3: Update Frontend Configuration**

1. **Open `frontend/config.js`**

2. **Replace the Google Apps Script URL**:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
   - Paste your Web App URL from Step 2

3. **Save the file**

---

### **Step 4: Push to GitHub**

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Pure HTML/CSS/JS restaurant menu"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name: `restaurant-menu`
   - Make it **Public**
   - Don't initialize with README
   - Click "Create repository"

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/restaurant-menu.git
   git branch -M main
   git push -u origin main
   ```

---

### **Step 5: Deploy to GitHub Pages**

#### **Option A: Using GitHub Pages (Recommended)**

1. **Go to Repository Settings**:
   - Open your GitHub repository
   - Click "Settings" tab
   - Scroll to "Pages" section (left sidebar)

2. **Configure GitHub Pages**:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/frontend` (if your HTML files are in frontend folder)
   - Click **Save**

3. **Wait for Deployment** (1-2 minutes)
   - GitHub will show: "Your site is live at `https://YOUR_USERNAME.github.io/restaurant-menu/`"

4. **Access Your Website**:
   - Open the URL provided
   - Your restaurant menu is now live! 🎉

#### **Option B: Using Vercel (Alternative)**

1. **Go to [Vercel](https://vercel.com)**
2. Click "Import Project"
3. Import your GitHub repository
4. **Root Directory**: Set to `frontend`
5. Click "Deploy"
6. Done! You'll get a URL like: `https://restaurant-menu.vercel.app`

#### **Option C: Using Netlify (Alternative)**

1. **Go to [Netlify](https://netlify.com)**
2. Drag and drop your `frontend` folder
3. Done! Instant deployment

---

### **Step 6: Test Your Website**

1. **Open your deployed URL**
2. **Test Menu Loading**:
   - Menu items should load from Google Sheets
   - Check browser console for any errors

3. **Test Order Placement**:
   - Select items and add to cart
   - Fill in customer details
   - Place an order
   - Check Google Sheets "Orders" tab - order should appear

4. **Test Email Notifications**:
   - If you provided email, check inbox
   - Owner should receive notification

---

## 🎯 Project Structure (GitHub Ready)

```
restaurant-menu/
├── frontend/                    # Pure HTML/CSS/JS (Deploy this)
│   ├── index.html              # Main menu page
│   ├── view-order.html         # Order tracking page
│   ├── styles.css              # All styles
│   ├── script.js               # Frontend logic
│   ├── config.js               # API configuration ⚙️
│   └── vercel.json             # Vercel config (optional)
│
├── GOOGLE_APPS_SCRIPT_BACKEND.js  # Copy to Google Apps Script
├── DEPLOY_GITHUB_PAGES.md         # This guide
├── README.md                      # Project documentation
└── .gitignore                     # Git ignore rules
```

---

## 🔧 Configuration Summary

### **What You Need to Update**:

1. **Google Sheets**:
   - Create `menu1` sheet with menu items
   - Create `Orders` sheet for orders

2. **Google Apps Script**:
   - Update `CONFIG` object with your details
   - Deploy as Web App
   - Copy Web App URL

3. **Frontend config.js**:
   - Replace `GOOGLE_APPS_SCRIPT_URL` with your Web App URL

4. **GitHub**:
   - Push code to GitHub
   - Enable GitHub Pages

---

## ✅ Advantages of This Setup

| Feature | Benefit |
|---------|---------|
| **No Backend Server** | No Node.js, Express, or hosting costs |
| **100% Free** | GitHub Pages + Google Apps Script = $0/month |
| **Serverless** | Auto-scales, never goes down |
| **Easy Updates** | Just edit Google Sheets for menu changes |
| **Email Notifications** | Built-in Gmail integration |
| **Auto Sheet Rotation** | Creates new sheet at 10,000 orders |
| **Mobile Friendly** | Responsive design works everywhere |
| **Fast Deployment** | Push to GitHub → Live in 2 minutes |

---

## 🐛 Troubleshooting

### **Menu Not Loading?**
- Check if Google Sheet is public (Anyone with link can view)
- Verify sheet name is exactly `menu1`
- Check browser console for errors
- Verify Google Apps Script URL in `config.js`

### **Orders Not Saving?**
- Check Google Apps Script deployment (must be "Anyone" access)
- Verify `Orders` sheet exists
- Check Apps Script execution logs: Apps Script → Executions

### **Emails Not Sending?**
- Verify `OWNER_EMAIL` in Google Apps Script CONFIG
- Check Gmail quota (100 emails/day for free accounts)
- Check Apps Script logs for email errors

### **GitHub Pages Not Working?**
- Ensure repository is public
- Check Pages settings: Settings → Pages
- Wait 2-3 minutes after enabling
- Verify `frontend` folder contains `index.html`

---

## 🔄 How to Update Menu Items

1. Open your Google Sheet
2. Edit the `menu1` sheet
3. Add/remove/modify items
4. Changes appear instantly on website (no deployment needed!)

---

## 📊 How to View Orders

1. Open your Google Sheet
2. Go to `Orders` tab
3. All orders appear in real-time
4. Export to Excel/CSV for analysis

---

## 🎉 You're Done!

Your restaurant menu website is now:
- ✅ Live on the internet
- ✅ 100% free hosting
- ✅ No backend server needed
- ✅ Easy to update
- ✅ Automatic email notifications
- ✅ Mobile-friendly

**Share your website URL with customers and start taking orders!** 🚀

---

## 📞 Support

If you need help:
1. Check browser console for errors (F12)
2. Check Google Apps Script logs
3. Verify all URLs are correct
4. Test each component separately

---

## 🔐 Security Notes

- Google Apps Script handles all backend logic securely
- No API keys exposed in frontend code
- Google Sheets access controlled by Google permissions
- Email sending uses your Google account (secure)

---

**Happy Deploying! 🎊**
