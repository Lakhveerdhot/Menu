# 🍽️ COMPLETE WEBSITE DOCUMENTATION
## Restaurant QR Menu & Ordering System

---

## 📋 PROJECT OVERVIEW

### What is This Website?
A **serverless restaurant ordering system** that allows:
- Customers scan QR codes on tables
- Browse digital menu on mobile phones
- Place orders directly from phones
- Track order status in real-time
- Add more items to existing orders
- Owner manages menu and views orders

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Google Apps Script (Serverless)
- **Database**: Google Sheets
- **Hosting**: GitHub Pages / Vercel / Netlify
- **Email**: Gmail (via Google Apps Script)
- **Cost**: $0/month (100% Free)

### Key Statistics
- **Total Lines of Code**: ~5,000+ lines
- **Setup Time**: 10-15 minutes
- **Monthly Cost**: $0
- **Max Orders**: Unlimited (auto-rotation)
- **Uptime**: 99.9% (Google infrastructure)

---

## 🏗️ ARCHITECTURE

### System Flow
```
Customer → QR Code → Website → API → Google Sheets → Email
```

### Components
1. **Frontend** (GitHub Pages) - Customer interface
2. **Backend** (Google Apps Script) - API & business logic
3. **Database** (Google Sheets) - Data storage
4. **Email** (Gmail) - Notifications

---

## 📁 FILE STRUCTURE

### Frontend Files (7 files)
1. **index.html** - Main menu page (272 lines)
2. **owner.html** - Admin dashboard (115 lines)
3. **styles.css** - All styling (1657 lines)
4. **script.js** - Main logic (824 lines)
5. **owner.js** - Dashboard logic (12KB)
6. **config.js** - API config (39 lines)
7. **view-order.html** - Integrated in index.html

### Backend File (1 file)
1. **GOOGLE_APPS_SCRIPT_BACKEND.js** - Complete API (1295 lines)

### Documentation Files (8 files)
1. README.md
2. DEPLOYMENT_GUIDE_GITHUB.md
3. DEPLOYMENT_CHECKLIST.md
4. DEPLOYMENT_FLOW.md
5. FIX_CORS_ERROR.md
6. QUICK_DEPLOY_COMMANDS.md
7. START_HERE.md
8. TODO.md

---

## 🎨 FRONTEND COMPONENTS

### 1. index.html - Customer Interface

**Sections:**
- Header (Restaurant name, tagline)
- Sticky Cart Summary (Items count, total)
- Menu Section (Search, categories, grid)
- Cart Sidebar (Items list, checkout)
- Checkout Modal (Customer details form)
- Success Modal (Order confirmation)
- View Order Modal (Order tracking)

**Key Features:**
- Mobile-only access (5-factor detection)
- Real-time cart updates
- Search & filter menu
- Order placement
- Order tracking

### 2. owner.html - Admin Dashboard

**Sections:**
- Login (Admin/Staff secret)
- Statistics (Menu items, orders, revenue)
- Orders Table (Today's orders)
- Menu Management (Add/Edit/Delete items)

**Roles:**
- **Admin**: Full access (CRUD operations)
- **Staff**: View orders + toggle availability

### 3. styles.css - Styling

**Features:**
- CSS Variables (theming)
- Mobile-responsive design
- Smooth animations
- Gradient backgrounds
- Modal overlays
- Loading spinners

### 4. script.js - Main Logic

**Key Functions:**
- `loadMenu()` - Fetch menu from API
- `addToCart()` - Add items to cart
- `placeOrder()` - Submit order
- `searchOrder()` - Track order
- `isMobile()` - Device detection

### 5. config.js - Configuration

**Settings:**
- Google Apps Script URL
- API helper functions
- Environment variables

---

## ⚙️ BACKEND COMPONENTS

### GOOGLE_APPS_SCRIPT_BACKEND.js

**Configuration:**
```javascript
RESTAURANT_NAME: 'My Restaurant'
MENU_SHEET_NAME: 'menu1'
ORDERS_SHEET_NAME: 'orders'
MAX_ROWS_PER_SHEET: 10000
OWNER_EMAIL: 'owner@example.com'
ADMIN_SECRET: '852852'
STAFF_SECRET: '123456'
```

**API Endpoints:**

**GET Endpoints:**
- `?path=restaurant-info` - Get restaurant details
- `?path=menu` - Get menu items (cached 5 min)
- `?path=health` - Health check

**POST Endpoints:**
- `action: place-order` - Place new order
- `action: update-order` - Add items to existing order
- `action: verify-order` - Track order by mobile/ID
- `action: get-stats` - Get sheet statistics

**Admin Endpoints:**
- `action: admin-whoami` - Verify role
- `action: admin-today-orders` - Get today's orders
- `action: admin-list-menu` - Get full menu
- `action: admin-add-item` - Add menu item
- `action: admin-update-item` - Update menu item
- `action: admin-delete-item` - Delete menu item
- `action: admin-toggle-availability` - Toggle availability

---

## 🗄️ DATABASE STRUCTURE

### Sheet 1: menu1 (Menu Items)
```
Columns: ID | Name | Description | Price | Category | Image | Available
Example: 1 | Paneer Tikka | Grilled cheese | 250 | Starters | url | yes
```

### Sheet 2: orders (Customer Orders)
```
Columns: Timestamp | Order ID | Table | Customer | Mobile | Email | Items | Total
Example: 18/10/2024, 09:30 | ORD-1729... | 5 | John | 9876543210 | john@email.com | Paneer x2 (₹500) | 500
```

**Auto-Rotation:** At 10,000 rows, creates new sheet "orders_YYYYMMDD_HHMMSS"

### Sheet 3: EmailQueue (Optional)
```
Columns: Timestamp | OrderId | To | Type | Payload | Status | Attempts | LastError
Used for: Email queuing and retry mechanism
```

---

## 🔄 COMPLETE WORKING FLOW

### Customer Journey

**Step 1: Scan QR Code**
- Customer scans QR code on table
- Opens website on mobile browser

**Step 2: Browse Menu**
- Website loads restaurant info
- Fetches menu from backend API
- Backend reads Google Sheets
- Returns menu items (cached 5 min)
- Displays menu cards with images

**Step 3: Add to Cart**
- Customer clicks "Add to Cart"
- Item added to cart (in memory)
- Cart count & total updated
- Cart sidebar shows items

**Step 4: Checkout**
- Customer clicks "Proceed to Order"
- Checkout modal opens
- Fills: Table number, Name, Mobile, Email
- Reviews order summary

**Step 5: Place Order**
- Submits order form
- Frontend validates data
- POST request to backend
- Backend generates Order ID (ORD-timestamp)
- Saves to Google Sheets
- Sends email to customer
- Sends email to owner
- Returns success response

**Step 6: Order Confirmation**
- Success modal shows Order ID
- Auto-redirects to order tracking
- Customer can view order status

**Step 7: Track Order**
- Enter mobile number or Order ID
- Backend searches orders (24 hours)
- Calculates status based on time
- Shows: Received → Preparing → Cooking → Ready
- Displays estimated time

**Step 8: Add More Items (Optional)**
- Customer clicks "Add More Items"
- Returns to menu with existing order context
- Adds new items to cart
- Submits update
- Backend combines old + new items
- Sends update email with breakdown

### Owner Journey

**Step 1: Login**
- Opens owner.html
- Enters admin/staff secret
- Backend verifies secret
- Returns role (admin/staff)

**Step 2: View Dashboard**
- Statistics displayed:
  - Total menu items
  - Orders today
  - Clients today
  - Revenue today

**Step 3: View Orders**
- Table shows today's orders
- Columns: Order ID, Time, Customer, Items, Total
- Real-time updates

**Step 4: Manage Menu (Admin Only)**
- Click "Menu Management"
- View all menu items
- Add new item (form)
- Edit existing item
- Delete item
- Toggle availability

---

## 🔌 API DOCUMENTATION

### GET Requests

**1. Get Restaurant Info**
```
URL: {API_URL}?path=restaurant-info
Response: {
  success: true,
  data: {
    name: "My Restaurant",
    tagline: "Delicious Food"
  }
}
```

**2. Get Menu**
```
URL: {API_URL}?path=menu
Response: {
  success: true,
  data: [
    {
      id: "1",
      name: "Paneer Tikka",
      description: "Grilled cheese",
      price: 250,
      category: "Starters",
      image: "url"
    }
  ],
  source: "google-sheets-menu1",
  count: 15
}
```

### POST Requests

**1. Place Order**
```
URL: {API_URL}
Body: {
  action: "place-order",
  tableNumber: "5",
  customerName: "John Doe",
  mobile: "9876543210",
  email: "john@example.com",
  items: [
    { name: "Paneer Tikka", quantity: 2, price: 250 }
  ],
  total: 500
}
Response: {
  success: true,
  message: "Order placed successfully!",
  orderId: "ORD-1729234567890",
  timestamp: "18/10/2024, 09:30:45 AM"
}
```

**2. Verify Order**
```
URL: {API_URL}
Body: {
  action: "verify-order",
  mobile: "9876543210"
}
Response: {
  success: true,
  data: [
    {
      orderId: "ORD-1729234567890",
      timestamp: "18/10/2024, 09:30:45 AM",
      tableNumber: "5",
      customerName: "John Doe",
      items: [...],
      total: 500,
      orderStatus: "preparing",
      statusText: "Preparing Your Food",
      estimatedTime: "15 minutes"
    }
  ]
}
```

---

## ⚡ KEY FEATURES EXPLAINED

### 1. Mobile-Only Access
**5-Factor Detection:**
- User Agent check
- Touch support check
- Orientation API check
- Screen size check
- Platform check
- Requires 3/5 to pass

### 2. Cart Management
**Strategy: idOrName**
- Matches items by ID or Name
- Prevents duplicates
- Auto-merges quantities
- Real-time updates

### 3. Order Status Calculation
```
0-5 min: "Order Received" 🔔
5-10 min: "Preparing Your Food" 🍳
10-20 min: "Almost Ready" ⏰
20+ min: "Ready to Serve" ✓
```

### 4. Email Notifications
**Customer Email:**
- Order confirmation
- Items list
- Total amount
- Order ID

**Owner Email:**
- New order alert
- Customer details
- Items to prepare
- Table number

### 5. Auto Sheet Rotation
- At 10,000 orders
- Creates new sheet with timestamp
- Preserves old data
- Seamless transition

### 6. Menu Caching
- 5-minute TTL
- Reduces API calls
- Faster loading
- Auto-invalidates on changes

### 7. Role-Based Access
**Admin:**
- Full menu CRUD
- View all orders
- Delete items

**Staff:**
- View orders
- Toggle availability only

---

## 🚀 DEPLOYMENT PROCESS

### Step 1: Setup Google Sheets
1. Create spreadsheet "Restaurant Menu"
2. Create sheet "menu1" with columns
3. Create sheet "orders" with columns
4. Share with "Anyone with link"

### Step 2: Deploy Backend
1. Open Google Sheets
2. Extensions → Apps Script
3. Paste GOOGLE_APPS_SCRIPT_BACKEND.js
4. Update CONFIG values
5. Deploy → New deployment → Web app
6. Execute as: Me
7. Access: Anyone
8. Copy Web App URL

### Step 3: Update Frontend
1. Edit config.js
2. Replace GOOGLE_APPS_SCRIPT_URL
3. Save changes

### Step 4: Deploy Frontend
**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages
3. Source: main branch
4. Save

**Vercel:**
1. Import GitHub repo
2. Auto-deploy

### Step 5: Generate QR Code
1. Use qr-code-generator.com
2. Enter website URL
3. Download QR code
4. Print and place on tables

---

## 🔒 SECURITY FEATURES

1. **Mobile-Only Access** - Prevents desktop abuse
2. **Admin Secrets** - Password-protected dashboard
3. **Role-Based Access** - Admin vs Staff permissions
4. **Email Verification** - Required for orders
5. **24-Hour Order Window** - Limited tracking period
6. **CORS Enabled** - Secure cross-origin requests

---

## 🛠️ CONFIGURATION

### Backend Config (GOOGLE_APPS_SCRIPT_BACKEND.js)
```javascript
RESTAURANT_NAME: 'Your Restaurant Name'
RESTAURANT_TAGLINE: 'Your Tagline'
MENU_SHEET_NAME: 'menu1'
ORDERS_SHEET_NAME: 'orders'
OWNER_EMAIL: 'your@email.com'
ADMIN_SECRET: 'your-admin-secret'
STAFF_SECRET: 'your-staff-secret'
```

### Frontend Config (config.js)
```javascript
GOOGLE_APPS_SCRIPT_URL: 'your-web-app-url'
```

---

## 📊 STATISTICS & LIMITS

### Google Apps Script Limits
- **Execution time**: 6 minutes per execution
- **Emails per day**: 100 (free), 1500 (workspace)
- **URL Fetch calls**: 20,000 per day
- **Cache storage**: 100 KB per item

### Google Sheets Limits
- **Cells per sheet**: 10 million
- **Rows per sheet**: 10,000 (custom limit)
- **Columns per sheet**: 18,278

---

## 🐛 TROUBLESHOOTING

### Menu Not Loading
- Check API URL in config.js
- Verify Google Sheets is public
- Check browser console for errors

### Orders Not Saving
- Check backend deployment
- Verify sheet permissions
- Check Apps Script logs

### Emails Not Sending
- Verify owner email in CONFIG
- Check Gmail quota (100/day)
- Review Apps Script email permissions

### Mobile Detection Failing
- Clear browser cache
- Check user agent
- Test on actual mobile device

---

## 📈 FUTURE ENHANCEMENTS (TODO.md)

1. Payment gateway integration
2. Multiple restaurant support
3. Kitchen display system
4. Analytics dashboard
5. Customer loyalty program
6. Table reservation system
7. Delivery integration
8. Multi-language support

---

## 📞 SUPPORT & RESOURCES

### Documentation Files
- README.md - Overview
- DEPLOYMENT_GUIDE_GITHUB.md - GitHub setup
- DEPLOYMENT_CHECKLIST.md - Pre-launch checklist
- FIX_CORS_ERROR.md - CORS troubleshooting
- QUICK_DEPLOY_COMMANDS.md - Quick commands

### Key URLs
- Google Apps Script: script.google.com
- GitHub Pages: pages.github.com
- QR Generator: qr-code-generator.com

---

## ✅ SUMMARY

This is a **complete, production-ready restaurant ordering system** built with:
- Pure HTML/CSS/JavaScript frontend
- Google Apps Script serverless backend
- Google Sheets database
- Gmail email service
- GitHub Pages hosting

**Total Cost: $0/month**
**Setup Time: 10-15 minutes**
**Maintenance: Minimal**

Perfect for small to medium restaurants looking for an affordable, reliable digital ordering solution.

---

**Created by:** Lakhveer Singh (lakhveer.eduboss@gmail.com)
**Last Updated:** October 18, 2024
**Version:** 1.0.0
