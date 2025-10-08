# 🚀 Complete GitHub Pages Deployment Guide

## 📋 Overview
Ye guide tumhe step-by-step batayega ki apne Restaurant Menu System ko **GitHub Pages** par kaise deploy karo - **100% FREE!**

---

## ✅ Prerequisites (Pehle ye check karo)

1. **GitHub Account** - [github.com](https://github.com) par account banao
2. **Git Installed** - Check karo: `git --version`
3. **Google Account** - Google Sheets aur Apps Script ke liye
4. **Text Editor** - VS Code, Notepad++, ya koi bhi

---

## 🎯 Deployment Steps

### **STEP 1: Google Sheets Setup (5 minutes)**

#### 1.1 Create Google Sheet
1. [Google Sheets](https://sheets.google.com) par jao
2. **New Spreadsheet** banao
3. Name do: "Restaurant Menu System"

#### 1.2 Create Menu Sheet
Sheet ka naam `menu1` rakho aur ye columns banao:

| ID | Name | Description | Price | Category | Image |
|----|------|-------------|-------|----------|-------|
| 1 | Paneer Tikka | Grilled cottage cheese with spices | 250 | Starters | https://example.com/image.jpg |
| 2 | Butter Chicken | Creamy tomato curry | 350 | Main Course | |
| 3 | Gulab Jamun | Sweet dessert | 80 | Desserts | |

**Tips:**
- ID column me unique numbers dalo (1, 2, 3...)
- Price me sirf numbers (250, 350, 80)
- Image optional hai - blank chhod sakte ho
- Category: Starters, Main Course, Desserts, Beverages, etc.

#### 1.3 Create Orders Sheet
Naya sheet banao naam `Orders` aur ye columns add karo:

| Timestamp | Order ID | Table | Customer Name | Mobile | Email | Items | Total |
|-----------|----------|-------|---------------|--------|-------|-------|-------|

**Note:** Ye sheet khali rakho - orders automatically save honge

---

### **STEP 2: Google Apps Script Backend (10 minutes)**

#### 2.1 Open Apps Script Editor
1. Google Sheet me jao
2. **Extensions → Apps Script** click karo
3. Naya project khulega

#### 2.2 Copy Backend Code
1. `GOOGLE_APPS_SCRIPT_BACKEND.js` file kholo (tumhare project me hai)
2. **Pura code copy karo**
3. Apps Script editor me paste karo (default code delete karke)

#### 2.3 Configure Settings
Code me ye lines dhundo aur apni details dalo:

```javascript
const CONFIG = {
  RESTAURANT_NAME: 'My Restaurant',              // ⬅️ Apna restaurant naam
  RESTAURANT_TAGLINE: 'Delicious Food, Great Service',  // ⬅️ Tagline
  MENU_SHEET_NAME: 'menu1',                      // ⬅️ Menu sheet ka naam
  ORDERS_SHEET_NAME: 'Orders',                   // ⬅️ Orders sheet ka naam
  MAX_ROWS_PER_SHEET: 10000,
  OWNER_EMAIL: 'owner@example.com',              // ⬅️ Apna email (order notifications ke liye)
  CUSTOMER_EMAIL_ENABLED: true
};
```

#### 2.4 Deploy as Web App
1. **Save** karo (Ctrl+S)
2. Upar **Deploy → New deployment** click karo
3. Settings:
   - **Type:** Web app
   - **Execute as:** Me
   - **Who has access:** Anyone
4. **Deploy** button click karo
5. **Authorize** karo (Google permission dega)
6. **Web App URL copy karo** - Ye bahut important hai! 
   - Format: `https://script.google.com/macros/s/XXXXX/exec`

**⚠️ Important:** Is URL ko safe jagah save karo - ye tumhara backend URL hai!

---

### **STEP 3: Update Frontend Config (2 minutes)**

#### 3.1 Edit config.js
`config.js` file kholo aur line 8 me apna Web App URL paste karo:

```javascript
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';  // ⬅️ Yahan paste karo
```

**Example:**
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-T0cU0YCsZORxug5UNAZMYFIbHAPsYBpC4Q8Pf5EOvTqcA5yLOswYoM4qYq8uheJr/exec';
```

#### 3.2 Save File
File save karo (Ctrl+S)

---

### **STEP 4: Push to GitHub (5 minutes)**

#### 4.1 Initialize Git Repository
Terminal/Command Prompt kholo aur project folder me jao:

```bash
cd e:\EDUBOSS\menu
```

#### 4.2 Git Commands Run Karo

```bash
# Git repository initialize karo
git init

# All files add karo
git add .

# First commit banao
git commit -m "Initial commit: Restaurant Menu System"
```

#### 4.3 Create GitHub Repository
1. [GitHub](https://github.com) par jao
2. **New repository** click karo
3. Repository name: `restaurant-menu` (ya koi bhi naam)
4. **Public** select karo
5. **Create repository** click karo

#### 4.4 Push Code to GitHub

GitHub par jo commands dikhenge, wo run karo:

```bash
# Remote repository add karo
git remote add origin https://github.com/YOUR_USERNAME/restaurant-menu.git

# Code push karo
git branch -M main
git push -u origin main
```

**Replace karo:**
- `YOUR_USERNAME` → Tumhara GitHub username

---

### **STEP 5: Enable GitHub Pages (2 minutes)**

#### 5.1 GitHub Pages Settings
1. GitHub repository me jao
2. **Settings** tab click karo
3. Left sidebar me **Pages** click karo

#### 5.2 Configure Pages
1. **Source:** Deploy from a branch
2. **Branch:** `main`
3. **Folder:** `/ (root)`
4. **Save** button click karo

#### 5.3 Wait for Deployment
- 1-2 minutes wait karo
- Page refresh karo
- Upar green box me **URL dikhega**
- Format: `https://YOUR_USERNAME.github.io/restaurant-menu/`

---

### **STEP 6: Test Your Website (3 minutes)**

#### 6.1 Open Website
GitHub Pages URL kholo browser me

#### 6.2 Test Features
✅ **Menu Loading:**
- Menu items dikh rahe hain?
- Categories filter kaam kar raha hai?

✅ **Add to Cart:**
- Items cart me add ho rahe hain?
- Quantity change ho rahi hai?

✅ **Place Order:**
- Order form khul raha hai?
- Order successfully place ho raha hai?
- Email aa raha hai? (check spam folder bhi)

✅ **View Order:**
- `view-order.html` page kholo
- Mobile number ya Order ID se search karo
- Order details dikh rahe hain?

---

### **STEP 7: Generate QR Code (2 minutes)**

#### 7.1 Create QR Code
1. [QR Code Generator](https://www.qr-code-generator.com/) par jao
2. **URL** option select karo
3. Apna GitHub Pages URL paste karo
4. **Create QR Code** click karo
5. **Download** karo (PNG format)

#### 7.2 Print & Place
1. QR code print karo (A4 size paper par)
2. Restaurant tables par lagao
3. "Scan to Order" text add karo

---

## 🎨 Customization (Optional)

### Change Colors
`styles.css` me ye lines edit karo:

```css
:root {
    --primary-color: #ff6b35;      /* Main color */
    --secondary-color: #f7931e;    /* Secondary color */
    --dark-color: #2c3e50;         /* Text color */
}
```

### Change Restaurant Info
`GOOGLE_APPS_SCRIPT_BACKEND.js` me CONFIG section edit karo

---

## 🔄 Update Menu Items

### Method 1: Google Sheets (Recommended)
1. Google Sheet kholo
2. `menu1` sheet me items add/edit/delete karo
3. Website automatically update ho jayega (refresh karo)

### Method 2: Add New Items
Google Sheet me naya row add karo:
- ID: Next number (4, 5, 6...)
- Name: Item ka naam
- Description: Short description
- Price: Number only (250, 350)
- Category: Existing category ya new
- Image: Optional URL

---

## 📧 Email Notifications Setup

### Enable Gmail API (If emails not working)
1. Google Apps Script editor me jao
2. Left sidebar me **Services** click karo
3. **Gmail API** add karo
4. Save karo

### Test Email
1. Order place karo
2. Check inbox (aur spam folder)
3. Owner aur customer dono ko email aana chahiye

---

## 🐛 Troubleshooting

### Menu Not Loading?
**Problem:** Menu items nahi dikh rahe

**Solution:**
1. `config.js` me Web App URL check karo
2. Google Sheet publicly accessible hai? (Share → Anyone with link → Viewer)
3. Apps Script deployment "Anyone" ke liye accessible hai?
4. Browser console check karo (F12 → Console tab)

### Orders Not Saving?
**Problem:** Order place hone par error

**Solution:**
1. `Orders` sheet exist karta hai?
2. Apps Script me CONFIG sahi hai?
3. Web App URL sahi hai `config.js` me?
4. Browser console me error check karo

### Email Not Received?
**Problem:** Order confirmation email nahi aa raha

**Solution:**
1. Spam folder check karo
2. `CONFIG.OWNER_EMAIL` sahi hai?
3. Gmail API enabled hai?
4. Customer email field fill kiya tha?

### GitHub Pages Not Working?
**Problem:** Website nahi khul raha

**Solution:**
1. GitHub Pages enabled hai Settings me?
2. Branch `main` select kiya hai?
3. 2-3 minutes wait karo deployment ke liye
4. URL sahi hai? Format: `https://username.github.io/repo-name/`

### CORS Error?
**Problem:** Browser console me CORS error

**Solution:**
1. Google Apps Script me `doOptions` function hai?
2. Web App deployment "Anyone" ke liye hai?
3. Hard refresh karo (Ctrl+Shift+R)

---

## 🔒 Security Tips

1. **Never commit sensitive data** to GitHub
2. **Owner email** ko private rakho (CONFIG me change karo production me)
3. **Google Sheet** ko "View only" rakho publicly
4. **Apps Script** code me API keys mat dalo

---

## 📱 Mobile Testing

1. Mobile browser me website kholo
2. QR code scan karo
3. Order place karo
4. Responsive design check karo

---

## 🎉 Success Checklist

- ✅ Google Sheets setup with menu items
- ✅ Google Apps Script deployed as Web App
- ✅ Frontend config.js updated with Web App URL
- ✅ Code pushed to GitHub
- ✅ GitHub Pages enabled and working
- ✅ Menu loading correctly
- ✅ Orders placing successfully
- ✅ Email notifications working
- ✅ QR code generated and printed
- ✅ Mobile responsive working

---

## 📞 Support

Agar koi problem ho to:
1. Browser console check karo (F12)
2. Google Apps Script logs dekho (View → Logs)
3. GitHub repository me issue create karo

---

## 🚀 Next Steps

1. **Add more menu items** in Google Sheets
2. **Customize colors** in styles.css
3. **Add restaurant logo** in index.html
4. **Share QR code** with customers
5. **Monitor orders** in Google Sheets

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| GitHub Pages | **FREE** |
| Google Apps Script | **FREE** |
| Google Sheets | **FREE** |
| Gmail (100 emails/day) | **FREE** |
| Domain (optional) | $10/year |
| **Total Monthly Cost** | **₹0** 🎉 |

---

## 🎯 Pro Tips

1. **Backup Google Sheet** regularly
2. **Test on multiple devices** before going live
3. **Add menu item images** for better UX
4. **Monitor orders** in real-time via Google Sheets
5. **Update menu** seasonally
6. **Collect customer feedback** via email

---

**🎊 Congratulations! Tumhara Restaurant Menu System ab live hai!**

**Live URL:** `https://YOUR_USERNAME.github.io/restaurant-menu/`

Share karo QR code customers ke saath aur orders receive karo! 🍽️
