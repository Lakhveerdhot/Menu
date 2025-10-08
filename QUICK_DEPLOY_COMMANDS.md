# ⚡ Quick Deploy Commands - Copy & Paste

## 🎯 Prerequisites Check

```bash
# Check Git installation
git --version

# Check current directory
pwd  # Linux/Mac
cd   # Windows
```

---

## 📝 Step-by-Step Commands

### **1. Navigate to Project Folder**

```bash
# Windows
cd e:\EDUBOSS\menu

# Linux/Mac
cd /path/to/your/menu
```

---

### **2. Initialize Git (First Time Only)**

```bash
# Initialize Git repository
git init

# Check status
git status
```

---

### **3. Add All Files**

```bash
# Add all files to staging
git add .

# Verify files added
git status
```

---

### **4. Commit Changes**

```bash
# First commit
git commit -m "Initial commit: Restaurant Menu System"

# For future updates
git commit -m "Updated menu items and styling"
```

---

### **5. Connect to GitHub**

**⚠️ Important:** Pehle GitHub par repository banao, phir ye commands run karo

```bash
# Add remote repository (REPLACE with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/restaurant-menu.git

# Verify remote added
git remote -v
```

**Example:**
```bash
git remote add origin https://github.com/lakhveerdhot/restaurant-menu.git
```

---

### **6. Push to GitHub**

```bash
# Set main branch and push
git branch -M main
git push -u origin main
```

**If you get authentication error:**
```bash
# Use Personal Access Token instead of password
# Generate token: GitHub → Settings → Developer settings → Personal access tokens
```

---

### **7. Future Updates**

Jab bhi code change karo, ye commands run karo:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with message
git commit -m "Updated menu prices"

# Push to GitHub
git push
```

---

## 🔄 Common Git Commands

### Check Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Discard All Local Changes
```bash
git reset --hard HEAD
```

### Pull Latest Changes
```bash
git pull origin main
```

### Create New Branch
```bash
git checkout -b feature-new-menu
```

### Switch Branch
```bash
git checkout main
```

---

## 🌐 GitHub Pages Deployment

### Enable GitHub Pages (Via Web Interface)
1. Go to: `https://github.com/YOUR_USERNAME/restaurant-menu/settings/pages`
2. **Source:** Deploy from a branch
3. **Branch:** main
4. **Folder:** / (root)
5. Click **Save**

### Check Deployment Status
```bash
# Visit this URL after 2-3 minutes
https://YOUR_USERNAME.github.io/restaurant-menu/
```

---

## 🔧 Troubleshooting Commands

### Remove Remote Origin (If Wrong URL)
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/correct-repo.git
```

### Force Push (Use Carefully!)
```bash
git push -f origin main
```

### Clone Repository (On Another Computer)
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-menu.git
cd restaurant-menu
```

### Update Remote URL
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/new-repo.git
```

---

## 📱 Test Deployment

```bash
# Open in browser (Windows)
start https://YOUR_USERNAME.github.io/restaurant-menu/

# Open in browser (Mac)
open https://YOUR_USERNAME.github.io/restaurant-menu/

# Open in browser (Linux)
xdg-open https://YOUR_USERNAME.github.io/restaurant-menu/
```

---

## 🎯 Complete Workflow Example

```bash
# 1. Navigate to project
cd e:\EDUBOSS\menu

# 2. Initialize Git (first time only)
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: Restaurant Menu System"

# 5. Add remote (replace with your URL)
git remote add origin https://github.com/lakhveerdhot/restaurant-menu.git

# 6. Push to GitHub
git branch -M main
git push -u origin main

# 7. Enable GitHub Pages (via web interface)
# Visit: https://github.com/lakhveerdhot/restaurant-menu/settings/pages

# 8. Wait 2-3 minutes, then visit:
# https://lakhveerdhot.github.io/restaurant-menu/
```

---

## 🔑 GitHub Authentication

### Using Personal Access Token (Recommended)

1. **Generate Token:**
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token
   - Select scopes: `repo`, `workflow`
   - Copy token (save it securely!)

2. **Use Token as Password:**
   ```bash
   Username: YOUR_GITHUB_USERNAME
   Password: ghp_YOUR_PERSONAL_ACCESS_TOKEN
   ```

### Using SSH (Alternative)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Use SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/restaurant-menu.git
```

---

## 📊 Verify Deployment

### Check Files on GitHub
```bash
# Visit repository
https://github.com/YOUR_USERNAME/restaurant-menu

# Check files are uploaded:
✓ index.html
✓ view-order.html
✓ styles.css
✓ script.js
✓ config.js
✓ GOOGLE_APPS_SCRIPT_BACKEND.js
✓ README.md
```

### Check Live Website
```bash
# Visit GitHub Pages URL
https://YOUR_USERNAME.github.io/restaurant-menu/

# Test features:
✓ Menu loads
✓ Add to cart works
✓ Order placement works
✓ View order works
```

---

## 🎉 Success!

**Your website is now live at:**
```
https://YOUR_USERNAME.github.io/restaurant-menu/
```

**Next Steps:**
1. Generate QR code with this URL
2. Print and place on tables
3. Start receiving orders!

---

## 📞 Need Help?

**Git not installed?**
- Windows: Download from [git-scm.com](https://git-scm.com/)
- Mac: `brew install git`
- Linux: `sudo apt install git`

**GitHub account needed?**
- Sign up at [github.com](https://github.com)

**Authentication issues?**
- Use Personal Access Token instead of password
- Or setup SSH keys

---

## 💡 Pro Tips

1. **Commit often** with meaningful messages
2. **Test locally** before pushing
3. **Use branches** for major changes
4. **Keep .gitignore** updated
5. **Backup important files** before force push

---

**Happy Deploying! 🚀**
