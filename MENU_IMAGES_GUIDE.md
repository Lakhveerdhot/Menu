# 📸 Menu Images Setup Guide

## ✅ What's Been Added

Your menu now supports **custom images** for each item! 

### Features:
- ✅ **Custom Images** - Owner can add image URLs in Google Sheets Column F
- ✅ **Optional** - Items without images show as clean text-only cards
- ✅ **Hover Effects** - Images zoom on hover (when present)
- ✅ **Responsive Design** - Works on all devices
- ✅ **Owner Control** - Add images only when ready, no automatic placeholders

---

## 🎨 How Images Work

### 1. **With Image URL (Column F filled)**
- Shows beautiful image card
- 200px height image
- Zoom effect on hover
- Professional look

### 2. **Without Image URL (Column F blank)**
- Shows clean text-only card
- Name, description, price, category
- Compact and professional
- **No placeholder images**

---

## 📋 Adding Images to Google Sheet

### Step 1: Update Google Sheet Structure

Your Google Sheet should have these columns:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **ID** | **Name** | **Description** | **Price** | **Category** | **Image URL** |
| item1 | Paneer Tikka | Grilled cottage cheese | 250 | Starters | https://example.com/image.jpg |
| item2 | Butter Chicken | Creamy chicken curry | 350 | Main Course | |

**Column F (Image URL)** is optional. Leave blank for automatic placeholder.

---

## 🖼️ Where to Get Image URLs

### Option 1: Upload to Google Drive (Recommended)

1. **Upload Image to Google Drive**
2. **Right-click** → Get link
3. **Change sharing** to "Anyone with the link can view"
4. **Copy the link** (looks like: `https://drive.google.com/file/d/ABC123/view`)
5. **Convert to direct link**:
   - Original: `https://drive.google.com/file/d/ABC123/view`
   - Direct: `https://drive.google.com/uc?export=view&id=ABC123`
6. **Paste in Google Sheet Column F**

### Option 2: Use Image Hosting Services

**Free Image Hosting:**
- **ImgBB** - https://imgbb.com/
- **Imgur** - https://imgur.com/
- **Cloudinary** - https://cloudinary.com/ (free tier)
- **Postimages** - https://postimages.org/

**Steps:**
1. Upload image to any service
2. Get direct image URL (should end with .jpg, .png, etc.)
3. Paste in Google Sheet Column F

### Option 3: Use Unsplash (Free Stock Photos)

1. Go to https://unsplash.com/
2. Search for food images (e.g., "pizza", "burger", "indian food")
3. Click on image
4. Right-click → Copy image address
5. Paste in Google Sheet Column F

**Example URLs:**
```
https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400
https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400
```

---

## 📝 Example Google Sheet Setup

```
ID      | Name           | Description              | Price | Category    | Image URL
--------|----------------|--------------------------|-------|-------------|------------------------------------------
item1   | Paneer Tikka   | Grilled cottage cheese   | 250   | Starters    | https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8
item2   | Butter Chicken | Creamy chicken curry     | 350   | Main Course | https://drive.google.com/uc?export=view&id=ABC123
item3   | Gulab Jamun    | Sweet milk dumplings     | 120   | Desserts    |
item4   | Masala Dosa    | Crispy rice crepe        | 180   | Main Course | https://i.imgur.com/xyz123.jpg
```

**Note:** item3 has no image URL, so it will show automatic dessert placeholder.

---

## 🎯 Image Requirements

### Recommended Specifications:
- **Format:** JPG, PNG, WebP
- **Size:** 400-800px width (auto-optimized)
- **Aspect Ratio:** 4:3 or 16:9 (landscape)
- **File Size:** Under 500KB for fast loading
- **Quality:** Medium to high (don't need ultra-high resolution)

### Image Tips:
✅ Use well-lit, appetizing food photos  
✅ Show the dish clearly  
✅ Use consistent style across all images  
✅ Avoid watermarked images  
✅ Use landscape orientation (horizontal)  

❌ Don't use blurry images  
❌ Don't use images with text overlays  
❌ Don't use portrait orientation (vertical)  

---

## 🔧 Testing Images

### 1. **Add Image URL to Google Sheet**
```
Column F: https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400
```

### 2. **Refresh Menu Page**
- Open your menu page
- Press `Ctrl + F5` (hard refresh)
- Images should load

### 3. **Check if Image Works**
- If image shows → ✅ Success!
- If placeholder shows → Check URL or leave blank for auto-placeholder

---

## 🚀 Quick Start (5 Minutes)

### For Testing (Use Free Stock Photos):

1. **Open your Google Sheet**
2. **Add Column F header**: "Image URL"
3. **Copy these example URLs** into Column F:

**Pizza:**
```
https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop
```

**Burger:**
```
https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop
```

**Indian Food:**
```
https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop
```

**Dessert:**
```
https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop
```

**Beverage:**
```
https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop
```

4. **Save the sheet**
5. **Refresh your menu page**

---

## 🎨 Customizing Placeholder Images

If you want to change the default placeholder images, edit `frontend/script.js`:

```javascript
function getPlaceholderImage(category) {
    const placeholders = {
        'Starters': 'YOUR_IMAGE_URL_HERE',
        'Main Course': 'YOUR_IMAGE_URL_HERE',
        'Desserts': 'YOUR_IMAGE_URL_HERE',
        // ... add more
    };
    return placeholders[category] || placeholders['Default'];
}
```

---

## 📱 Mobile Optimization

Images are automatically optimized for mobile:
- ✅ Responsive sizing
- ✅ Touch-friendly
- ✅ Fast loading
- ✅ Lazy loading support (browser native)

---

## ❓ Troubleshooting

### Images Not Showing?

**1. Check Image URL:**
```bash
# Test URL in browser - should show image directly
https://your-image-url.com/image.jpg
```

**2. Check Google Sheet:**
- Column F should have image URLs
- URLs should be complete (start with https://)
- No extra spaces before/after URL

**3. Check Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for "Failed to load image" errors

**4. CORS Issues:**
- Some websites block direct image linking
- Use Google Drive, ImgBB, or Imgur instead
- Unsplash images work perfectly

**5. Google Drive Images Not Working:**
- Make sure sharing is set to "Anyone with link"
- Use direct link format: `https://drive.google.com/uc?export=view&id=FILE_ID`
- Not: `https://drive.google.com/file/d/FILE_ID/view`

### Placeholder Images Not Showing?

- Check internet connection (placeholders use Unsplash)
- Placeholders are category-based
- If category doesn't match, uses "Default" placeholder

---

## 🎯 Best Practices

### For Restaurant Owners:

1. **Take Your Own Photos**
   - Use smartphone camera (good lighting)
   - Upload to Google Drive
   - Use direct links in sheet

2. **Consistent Style**
   - Same background/lighting for all dishes
   - Same angle (top-down or 45°)
   - Same plate style if possible

3. **Update Regularly**
   - Change images seasonally
   - Update when dish presentation changes
   - Remove images for discontinued items

4. **Organize Images**
   - Create Google Drive folder: "Menu Images"
   - Name files clearly: "paneer-tikka.jpg"
   - Keep backups

---

## 📊 Image Performance

### Current Setup:
- **Loading:** Lazy (images load as user scrolls)
- **Caching:** Browser automatically caches images
- **Fallback:** Placeholder if image fails
- **Optimization:** Unsplash auto-optimizes placeholder images

### To Improve Performance:
1. Compress images before uploading (use TinyPNG.com)
2. Use WebP format (modern, smaller file size)
3. Use CDN (Cloudinary, ImgBB have free CDN)

---

## 🔗 Useful Links

**Free Image Hosting:**
- ImgBB: https://imgbb.com/
- Imgur: https://imgur.com/
- Postimages: https://postimages.org/

**Free Stock Photos:**
- Unsplash: https://unsplash.com/s/photos/food
- Pexels: https://www.pexels.com/search/food/
- Pixabay: https://pixabay.com/images/search/food/

**Image Compression:**
- TinyPNG: https://tinypng.com/
- Compressor.io: https://compressor.io/

**Google Drive Direct Link Converter:**
- https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/

---

## 📝 Summary

### What Owner Needs to Do:

1. ✅ Add "Image URL" column (Column F) in Google Sheet
2. ✅ Add image URLs for menu items (optional)
3. ✅ Leave blank for automatic category-based placeholders
4. ✅ Use Google Drive, ImgBB, or Unsplash for images
5. ✅ Test by refreshing menu page

### What Happens Automatically:

✅ Images display beautifully on menu cards  
✅ Hover effects (zoom on hover)  
✅ Fallback to placeholders if URL fails  
✅ Category-based placeholders if no URL  
✅ Mobile-responsive  
✅ Fast loading  

---

**Setup Complete! 🎉**

Aapka menu ab images ke saath beautiful dikhega. Owner Google Sheet me image URLs add kar sakta hai ya blank chhod sakta hai automatic placeholders ke liye.

**Need Help?** Check troubleshooting section above or contact support.
