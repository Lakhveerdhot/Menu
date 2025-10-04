# 📦 Push Your Code to GitHub - Complete Guide

## 🎯 What We'll Do

Upload your restaurant menu system to GitHub so you can:
- ✅ Backup your code
- ✅ Deploy to hosting services
- ✅ Share with others
- ✅ Track changes

---

## 📋 Step-by-Step Instructions

### Step 1: Create .env File (Important!)

Before pushing to GitHub, create your actual `.env` file:

```powershell
cd backend
copy .env.example .env
```

Edit `backend/.env` with your actual values (this file will NOT be uploaded to GitHub - it's in .gitignore)

---

### Step 2: Initialize Git (Already Done!)

You already ran `git init`, so your repository is initialized.

---

### Step 3: Add All Files to Git

```powershell
# Make sure you're in the main menu folder
cd E:\EDUBOSS\menu

# Add all files
git add .
```

This stages all your files for commit.

---

### Step 4: Commit Your Files

```powershell
git commit -m "Initial commit - Restaurant QR Menu System"
```

This saves your changes with a message.

---

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `restaurant-qr-menu` (or any name you like)
   - **Description:** Restaurant QR code menu ordering system with Google Sheets
   - **Public** or **Private** (your choice)
   - **DO NOT** check "Initialize with README" (you already have files)
4. Click **"Create repository"**

---

### Step 6: Connect to GitHub

GitHub will show you commands. Use these:

```powershell
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/restaurant-qr-menu.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

### Step 7: Enter GitHub Credentials

When you run `git push`, you'll be asked for:
- **Username:** Your GitHub username
- **Password:** Your GitHub Personal Access Token (NOT your password!)

#### How to Get Personal Access Token:

1. Go to GitHub.com
2. Click your profile picture → **Settings**
3. Scroll down → Click **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Fill in:
   - **Note:** "Restaurant Menu Upload"
   - **Expiration:** 90 days (or your choice)
   - **Select scopes:** Check ✅ **repo** (all repo permissions)
7. Click **Generate token**
8. **COPY THE TOKEN** (you won't see it again!)
9. Use this token as your password when pushing

---

### Step 8: Verify Upload

1. Go to your GitHub repository URL
2. You should see all your files!
3. Check that `.env` is NOT there (it's private)

---

## 🔒 Security Checklist

Before pushing, make sure these files are in `.gitignore`:

✅ `.env` - Your private configuration
✅ `node_modules/` - Dependencies (will be reinstalled)
✅ `*.log` - Log files

Check your `.gitignore` file:
```
node_modules/
.env
*.log
.DS_Store
```

---

## 📝 Complete Commands Summary

```powershell
# 1. Navigate to project folder
cd E:\EDUBOSS\menu

# 2. Create .env file (don't skip this!)
cd backend
copy .env.example .env
cd ..

# 3. Add all files
git add .

# 4. Commit files
git commit -m "Initial commit - Restaurant QR Menu System"

# 5. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/restaurant-qr-menu.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔄 Future Updates

When you make changes later:

```powershell
# Add changed files
git add .

# Commit with message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## ❌ Troubleshooting

### Error: "remote origin already exists"

```powershell
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/restaurant-qr-menu.git
```

### Error: "src refspec main does not match any"

This means you haven't committed yet:

```powershell
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Error: "failed to push some refs"

Someone else pushed changes, or you're pushing to wrong repo:

```powershell
# Check remote URL
git remote -v

# If wrong, update it
git remote set-url origin https://github.com/YOUR_USERNAME/restaurant-qr-menu.git
```

### Authentication Failed

- Make sure you're using Personal Access Token, NOT your password
- Token must have `repo` permissions
- Generate a new token if needed

---

## 📂 What Gets Uploaded

✅ **Uploaded to GitHub:**
- All source code files
- Documentation (.md files)
- package.json
- .gitignore
- .env.example (template)

❌ **NOT Uploaded (Private):**
- .env (your actual credentials)
- node_modules/ (dependencies)
- orders.json (customer data)

---

## 🚀 After Upload

Your code is now on GitHub! You can:

1. **Deploy to Vercel/Netlify** (frontend)
2. **Deploy to Railway/Render** (backend)
3. **Share the repository** with others
4. **Clone on other computers**

---

## 📱 Quick Reference Card

```
Create Repo on GitHub → Copy URL
↓
git add .
↓
git commit -m "message"
↓
git remote add origin YOUR_GITHUB_URL
↓
git branch -M main
↓
git push -u origin main
↓
Enter GitHub username
↓
Enter Personal Access Token
↓
✅ Done!
```

---

Need help? Check the error message and look in the Troubleshooting section above! 🎉
