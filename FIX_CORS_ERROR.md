# 🔴 CORS Error Fix Guide

## ❌ Error Message

```
Access to fetch at 'https://script.google.com/...' from origin 'https://lakhveerdhot.github.io' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## 🎯 Root Cause

Google Apps Script deployment me CORS headers properly set nahi hain ya deployment purani hai.

---

## ✅ SOLUTION - Follow These Steps Carefully

### **Step 1: Open Google Apps Script**

1. Apni Google Sheet kholo (jisme menu items hain)
2. **Extensions → Apps Script** click karo
3. Code editor khulega

---

### **Step 2: Verify Code Has doOptions Function**

Code me ye function **MUST** hai (lines 24-32):

```javascript
// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

**✅ Agar ye function hai:** Next step par jao  
**❌ Agar ye function nahi hai:** Code me add karo aur save karo

---

### **Step 3: Create NEW Deployment (CRITICAL)**

⚠️ **Important:** Purana deployment update nahi hota. **Naya deployment** banana padega!

#### 3.1 Archive Old Deployment

1. Top-right corner me **Deploy** button click karo
2. **Manage deployments** select karo
3. Purane deployment ke saamne **pencil icon** (edit) click karo
4. **Archive** button click karo
5. Confirm karo

#### 3.2 Create New Deployment

1. **Deploy** button click karo
2. **New deployment** select karo
3. Settings configure karo:

```
┌─────────────────────────────────────────┐
│ New Deployment                          │
├─────────────────────────────────────────┤
│ Type: Web app                           │
│                                         │
│ Description: Restaurant Menu v2         │
│                                         │
│ Execute as: Me                          │
│ (YOUR_EMAIL@gmail.com)                  │
│                                         │
│ Who has access: Anyone                  │
│ ⚠️ MUST BE "Anyone" NOT "Anyone with    │
│    Google Account"                      │
└─────────────────────────────────────────┘
```

4. **Deploy** button click karo

#### 3.3 Authorize Access

1. **Authorize access** popup aayega
2. Apna Google account select karo
3. **Advanced** click karo (agar warning aaye)
4. **Go to [Project Name] (unsafe)** click karo
5. **Allow** all permissions

#### 3.4 Copy New Web App URL

1. Deployment success message me **Web app URL** dikhega
2. **Copy** button click karo
3. URL save karo - format:
   ```
   https://script.google.com/macros/s/NEW_DEPLOYMENT_ID/exec
   ```

---

### **Step 4: Test Web App URL Directly**

Browser me naya URL paste karo aur test karo:

```
https://YOUR_NEW_WEB_APP_URL/exec?path=health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-08T...",
  "backend": "Google Apps Script",
  "dataStorage": "Google Sheets"
}
```

**✅ Agar ye response aaya:** Web App working hai  
**❌ Agar error aaya:** Deployment settings check karo

---

### **Step 5: Update config.js with NEW URL**

1. Project folder me `config.js` file kholo
2. **Line 8** me naya URL paste karo:

```javascript
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_NEW_WEB_APP_URL_HERE';
```

**Example:**
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
```

3. **Save file** (Ctrl+S)

---

### **Step 6: Push Updated Code to GitHub**

```bash
# Navigate to project folder
cd e:\EDUBOSS\menu

# Check what changed
git status

# Add changed file
git add config.js

# Commit with message
git commit -m "Updated Google Apps Script URL - Fixed CORS"

# Push to GitHub
git push
```

---

### **Step 7: Wait & Test**

1. **Wait 2-3 minutes** for GitHub Pages to update
2. **Hard refresh** your website (Ctrl+Shift+R)
3. **Open browser console** (F12 → Console tab)
4. Check for errors

**✅ Success:** Menu loads, no CORS errors  
**❌ Still Error:** Continue to troubleshooting below

---

## 🔍 Troubleshooting

### Issue 1: Still Getting CORS Error

**Possible Causes:**
- Old deployment still active
- "Who has access" not set to "Anyone"
- Browser cache

**Solutions:**

1. **Verify Deployment Settings:**
   - Apps Script → Deploy → Manage deployments
   - Check "Who has access" = **Anyone**
   - NOT "Anyone with Google Account"

2. **Clear Browser Cache:**
   ```
   Chrome: Ctrl+Shift+Delete → Clear cache
   Firefox: Ctrl+Shift+Delete → Clear cache
   ```

3. **Try Incognito/Private Mode:**
   - Open website in incognito
   - Test if it works

4. **Check URL in config.js:**
   - Must be the NEW deployment URL
   - Must end with `/exec`
   - No extra spaces or characters

---

### Issue 2: Authorization Error

**Error Message:**
```
Script function not found: doGet
```

**Solution:**
1. Apps Script me code save karo (Ctrl+S)
2. Naya deployment banao
3. Authorize karo properly

---

### Issue 3: Deployment Not Updating

**Problem:** Changes nahi dikh rahe

**Solution:**
1. **Archive old deployment** (zaruri hai!)
2. **Create NEW deployment** (update nahi, NEW!)
3. Use NEW URL in config.js

---

### Issue 4: "Anyone" Option Not Available

**Problem:** Deployment settings me "Anyone" option nahi hai

**Solution:**
1. Google Workspace admin settings check karo
2. Ya use: "Anyone with Google Account"
3. Then in code, remove authentication checks

---

## 🧪 Testing Checklist

After fixing, test these:

- [ ] Open website in browser
- [ ] Open console (F12)
- [ ] No CORS errors
- [ ] Menu items load
- [ ] Restaurant name shows
- [ ] Can add to cart
- [ ] Can place order

---

## 📝 Common Mistakes

### ❌ Mistake 1: Using Old URL
**Wrong:** Updating old deployment  
**Right:** Creating NEW deployment with NEW URL

### ❌ Mistake 2: Wrong Access Setting
**Wrong:** "Anyone with Google Account"  
**Right:** "Anyone"

### ❌ Mistake 3: Not Saving Code
**Wrong:** Deploying without saving  
**Right:** Save (Ctrl+S) then deploy

### ❌ Mistake 4: Not Authorizing
**Wrong:** Skipping authorization  
**Right:** Complete authorization flow

### ❌ Mistake 5: Browser Cache
**Wrong:** Testing without clearing cache  
**Right:** Hard refresh (Ctrl+Shift+R)

---

## 🔧 Advanced Debugging

### Check CORS Headers

1. Open browser console (F12)
2. Go to **Network** tab
3. Refresh page
4. Click on failed request
5. Check **Response Headers**

**Should have:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**If missing:** Deployment issue, create new deployment

---

### Test with cURL (Command Line)

```bash
# Test GET request
curl "https://YOUR_WEB_APP_URL/exec?path=health"

# Should return JSON with status: ok
```

---

### Check Apps Script Logs

1. Apps Script editor
2. Left sidebar → **Executions**
3. Check recent executions
4. Look for errors

---

## 📞 Still Not Working?

### Option 1: Verify Complete Setup

Use this checklist:

```
Google Apps Script:
- [ ] Code has doOptions function
- [ ] Code saved (Ctrl+S)
- [ ] New deployment created
- [ ] Execute as: Me
- [ ] Who has access: Anyone
- [ ] Authorization completed
- [ ] Web App URL copied

config.js:
- [ ] File opened
- [ ] Line 8 updated with NEW URL
- [ ] File saved
- [ ] Pushed to GitHub

GitHub:
- [ ] Code pushed successfully
- [ ] GitHub Pages enabled
- [ ] Waited 2-3 minutes
- [ ] Hard refresh done
```

---

### Option 2: Start Fresh

If nothing works, start from scratch:

1. **Delete old deployment:**
   - Apps Script → Deploy → Manage deployments
   - Archive all old deployments

2. **Create completely new deployment:**
   - Follow Step 3 above carefully
   - Use NEW URL

3. **Update config.js with NEW URL**

4. **Push to GitHub**

5. **Clear browser cache completely**

6. **Test in incognito mode**

---

## ✅ Success Indicators

You'll know it's fixed when:

1. **No CORS errors** in console
2. **Menu loads** from Google Sheets
3. **Restaurant name** displays
4. **Can place orders** successfully
5. **Orders save** to Google Sheets
6. **Emails send** successfully

---

## 🎯 Prevention Tips

To avoid CORS issues in future:

1. **Always use "Anyone" access** in deployment
2. **Keep doOptions function** in code
3. **Test Web App URL** before using
4. **Document your Web App URL** safely
5. **Use version control** (Git)

---

## 📚 Additional Resources

- **Google Apps Script CORS:** https://developers.google.com/apps-script/guides/web
- **CORS Explained:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Deployment Guide:** See `DEPLOYMENT_GUIDE_GITHUB.md`

---

## 🎊 Final Notes

**CORS error is the most common issue** with Google Apps Script deployments.

**Key Points to Remember:**
1. ✅ Always create NEW deployment (not update)
2. ✅ Use "Anyone" access setting
3. ✅ Test Web App URL directly first
4. ✅ Update config.js with NEW URL
5. ✅ Clear browser cache after changes

**Follow these steps carefully and CORS error will be fixed!** 🚀

---

**Need more help?** Check `DEPLOYMENT_GUIDE_GITHUB.md` → Troubleshooting section
