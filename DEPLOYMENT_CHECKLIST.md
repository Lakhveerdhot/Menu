# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly before going live.

---

## 📋 Pre-Deployment Checklist

### **1. Google Sheets Setup**
- [ ] Created Google Spreadsheet named "Restaurant Menu System"
- [ ] Created sheet named exactly `menu1` (case-sensitive)
- [ ] Added headers: `ID | Name | Description | Price | Category | Image`
- [ ] Added at least 3-5 menu items for testing
- [ ] Created sheet named exactly `Orders`
- [ ] Added headers: `Timestamp | Order ID | Table | Customer Name | Mobile | Email | Items | Total`
- [ ] Made sheet public (Share → Anyone with link → Viewer)
- [ ] Copied and saved the sheet URL

### **2. Google Apps Script Backend**
- [ ] Opened Google Sheet → Extensions → Apps Script
- [ ] Copied entire code from `GOOGLE_APPS_SCRIPT_BACKEND.js`
- [ ] Updated CONFIG section:
  - [ ] `RESTAURANT_NAME` - Your restaurant name
  - [ ] `RESTAURANT_TAGLINE` - Your tagline
  - [ ] `MENU_SHEET_NAME` - Set to `menu1`
  - [ ] `ORDERS_SHEET_NAME` - Set to `Orders`
  - [ ] `OWNER_EMAIL` - Your email address
  - [ ] `CUSTOMER_EMAIL_ENABLED` - Set to `true` or `false`
- [ ] Saved the script (Ctrl+S or Cmd+S)
- [ ] Deployed as Web App:
  - [ ] Deploy → New deployment
  - [ ] Type: Web app
  - [ ] Execute as: **Me**
  - [ ] Who has access: **Anyone**
  - [ ] Clicked "Deploy"
- [ ] Authorized the script (first time only)
- [ ] Copied and saved the Web App URL
- [ ] Tested the deployment (optional: use test endpoint)

### **3. Frontend Configuration**
- [ ] Opened `frontend/config.js`
- [ ] Replaced `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with actual Web App URL
- [ ] Saved the file
- [ ] Verified URL has no trailing slash
- [ ] Verified URL starts with `https://script.google.com/macros/s/`

### **4. Local Testing (Optional but Recommended)**
- [ ] Opened `frontend/index.html` in browser
- [ ] Menu items loaded successfully
- [ ] Added items to cart
- [ ] Filled order form with test data
- [ ] Placed test order
- [ ] Checked Google Sheets `Orders` tab - order appeared
- [ ] Checked email inbox - confirmation received (if email enabled)
- [ ] Tested on mobile device or responsive mode

### **5. GitHub Repository**
- [ ] Initialized Git: `git init`
- [ ] Added all files: `git add .`
- [ ] Committed: `git commit -m "Initial commit"`
- [ ] Created GitHub repository (public)
- [ ] Added remote: `git remote add origin YOUR_REPO_URL`
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Verified all files uploaded correctly
- [ ] Checked that `frontend/` folder is present

### **6. GitHub Pages Deployment**
- [ ] Opened GitHub repository in browser
- [ ] Went to Settings → Pages (left sidebar)
- [ ] Selected Source: **Deploy from a branch**
- [ ] Selected Branch: **main**
- [ ] Selected Folder: **/frontend** (important!)
- [ ] Clicked "Save"
- [ ] Waited 2-3 minutes for deployment
- [ ] Copied the GitHub Pages URL
- [ ] Opened the URL in browser
- [ ] Verified website loads correctly

### **7. Production Testing**
- [ ] Menu loads from Google Sheets
- [ ] All categories display correctly
- [ ] Images load (if using image URLs)
- [ ] Cart functionality works
- [ ] Order form validation works
- [ ] Can place an order successfully
- [ ] Order appears in Google Sheets
- [ ] Email notifications work (if enabled)
- [ ] Tested on mobile device
- [ ] Tested on different browsers (Chrome, Safari, Firefox)

### **8. QR Code Generation**
- [ ] Copied GitHub Pages URL
- [ ] Generated QR code at [qr-code-generator.com](https://www.qr-code-generator.com/)
- [ ] Downloaded QR code image (PNG or SVG)
- [ ] Tested QR code with phone camera
- [ ] Created printable version with restaurant name
- [ ] Printed QR codes for tables

### **9. Final Touches**
- [ ] Updated restaurant branding (name, tagline)
- [ ] Customized colors in `styles.css` (optional)
- [ ] Added restaurant logo (optional)
- [ ] Set up custom domain (optional)
- [ ] Tested complete customer journey
- [ ] Documented any custom changes

### **10. Go Live!**
- [ ] Placed QR codes on restaurant tables
- [ ] Trained staff on order notification system
- [ ] Set up order monitoring process
- [ ] Shared website URL with team
- [ ] Announced to customers (social media, etc.)

---

## 🔍 Verification Tests

### **Test 1: Menu Loading**
```
1. Open your GitHub Pages URL
2. Check browser console (F12)
3. Should see: "🔧 API Config (Google Apps Script): https://script.google.com..."
4. Menu items should load within 2-3 seconds
5. No errors in console
```

### **Test 2: Order Placement**
```
1. Add 2-3 items to cart
2. Fill in order form:
   - Table: 5
   - Name: Test Customer
   - Mobile: 1234567890
   - Email: test@example.com (optional)
3. Click "Place Order"
4. Should see success message
5. Check Google Sheets Orders tab
6. Order should appear with all details
```

### **Test 3: Email Notifications**
```
1. Place order with valid email
2. Check customer email inbox
3. Should receive order confirmation
4. Check owner email inbox
5. Should receive order notification
```

---

## 🐛 Troubleshooting Checklist

### **Menu Not Loading?**
- [ ] Checked Google Sheet is public
- [ ] Verified sheet name is exactly `menu1`
- [ ] Checked Apps Script URL in `config.js`
- [ ] Opened browser console for errors
- [ ] Verified Apps Script deployment is "Anyone" access

### **Orders Not Saving?**
- [ ] Checked Apps Script deployment settings
- [ ] Verified `Orders` sheet exists
- [ ] Checked Apps Script execution logs
- [ ] Tested Apps Script authorization
- [ ] Checked for errors in browser console

### **Emails Not Sending?**
- [ ] Verified `OWNER_EMAIL` in CONFIG
- [ ] Checked `CUSTOMER_EMAIL_ENABLED` is true
- [ ] Verified Gmail quota (100/day for free)
- [ ] Checked Apps Script logs for email errors
- [ ] Tested with different email addresses

### **GitHub Pages Not Working?**
- [ ] Waited 2-3 minutes after enabling
- [ ] Verified repository is public
- [ ] Checked folder is set to `/frontend`
- [ ] Verified `index.html` exists in frontend folder
- [ ] Cleared browser cache and tried again

---

## 📊 Post-Deployment Monitoring

### **Daily Tasks**
- [ ] Check Google Sheets for new orders
- [ ] Respond to customer orders promptly
- [ ] Monitor email notifications

### **Weekly Tasks**
- [ ] Review order volume and trends
- [ ] Update menu items if needed
- [ ] Check for any error reports
- [ ] Backup Google Sheets data (optional)

### **Monthly Tasks**
- [ ] Review customer feedback
- [ ] Update menu prices if needed
- [ ] Check Apps Script quota usage
- [ ] Verify QR codes are still working

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Website loads on GitHub Pages
- ✅ Menu displays correctly from Google Sheets
- ✅ Orders can be placed successfully
- ✅ Orders appear in Google Sheets immediately
- ✅ Email notifications work (if enabled)
- ✅ Mobile responsive design works
- ✅ QR codes scan and open website
- ✅ No errors in browser console
- ✅ All team members can access admin panel (Google Sheets)

---

## 📞 Support Resources

- **Full Guide**: `DEPLOY_GITHUB_PAGES.md`
- **Quick Start**: `QUICK_START.md`
- **Backend Code**: `GOOGLE_APPS_SCRIPT_BACKEND.js`
- **Main README**: `README.md`

---

## 🔄 Update Procedures

### **To Update Menu:**
1. Open Google Sheet
2. Edit `menu1` sheet
3. Changes appear instantly (no deployment needed!)

### **To Update Configuration:**
1. Open Google Apps Script
2. Edit CONFIG section
3. Deploy → Manage deployments → Edit → Deploy
4. Changes take effect immediately

### **To Update Frontend:**
1. Edit files in `frontend/` folder
2. Commit: `git add . && git commit -m "Update"`
3. Push: `git push origin main`
4. GitHub Pages auto-deploys in 1-2 minutes

---

**🎊 Congratulations! Your restaurant menu system is live!**

**Total Cost: $0/month | Total Time: 10 minutes | Maintenance: Zero**
