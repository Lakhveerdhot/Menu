# Task: Implement and Fix Add to Cart with Quantity Controls (+/-) in Orange Bar Layout

## Steps to Complete

- [x] **Step 1: Fix JS Logic in script.js**  
  Update `addToCart` and `updateQuantity` functions:  
  - Add fallback to find item by name if not found by id.  
  - Call `renderMenu()` after cart changes to refresh menu UI and show quantity controls.  
  - Ensure `mergeCartDuplicates()` is called explicitly after updates.  
  - Add console logs for debugging (e.g., item added/updated).  
  - Remove nested `window.onload` in `DOMContentLoaded` to avoid conflicts; integrate addMore logic directly.

- [x] **Step 2: Update Menu Rendering in script.js**  
  In `renderMenu()`, replace conditional `actionHtml` with unified `.order-bar` structure:  
  - Always use `<div class="order-bar">`.  
  - If `currentQty === 0`: `<button class="add-btn" onclick="addToCart('${item.id}')">Add to Cart</button>`.  
  - If `currentQty > 0`: `<button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">−</button> <span class="qty-display">${currentQty}</span> <button class="qty-btn plus" onclick="addToCart('${item.id}')">+</button>`.  
  - Ensure id fallback in HTML generation if needed.

- [x] **Step 3: Update Cart Sidebar Consistency (Optional Enhancement in script.js)**  
  In `updateCart()`, style cart item quantity controls similarly (flex bar), but keep simple for now as focus is menu.

- [x] **Step 4: Add Unified Styling in styles.css**  
  - Introduce `.order-bar`: flex, center, orange background (`var(--primary-color)`), white text, border-radius 25px, padding 12px, height 45px, gap 15px, full width.  
  - `.order-bar .add-btn`: flex 1, no bg, centered text.  
  - `.order-bar .qty-btn`: 40px round, semi-transparent white bg, hover brighter; distinguish .minus/.plus if needed.  
  - `.order-bar .qty-display`: bold, centered.  
  - Hover effects: darker orange, lift.  
  - Deprecate/hide old `.add-to-cart` and `.quantity-controls` styles (set display: none or override).  
  - Ensure responsive on mobile.

- [x] **Step 5: Verify and Test**  
  - Reload index.html.  
  - Click "Add to Cart" on an item: Should update to orange bar with "- 1 +", cart count increase.  
  - Click +: Quantity increases, bar updates.  
  - Click -: Quantity decreases, back to "Add to Cart" at 0.  
  - Open cart sidebar: Items show with controls.  
  - Check console for no errors.  
  - Use browser_action for screenshots if needed.

- [x] **Step 6: Cleanup**  
  - Mark complete in TODO.md.  
  - No backend changes; if API id issues persist, name fallback handles.

**Notes:**  
- Changes are frontend-only; no installs.  
- Assumes menu API loads items with ids (fallback to name if not).  
- After all steps, use `attempt_completion` to finalize.

---

# Task: Fix Modal Background Interaction Issue

## Steps to Complete

- [ ] **Step 1: Update styles.css**  
  Add CSS rules for `body.modal-open` to disable pointer events on the body and hide overflow when modals are open.  
  - `body.modal-open { pointer-events: none; overflow: hidden; }`  
  - Ensure `.modal` and `.modal-content` have `pointer-events: auto;` to allow interactions within the modal.  
  - Apply to overlay if needed, but body-level should suffice.

- [ ] **Step 2: Update script.js**  
  Modify modal opening functions (`showCheckout()`, `showViewOrder()`, and any others like success modal if applicable) to add `document.body.classList.add('modal-open');` when opening.  
  - Modify closing functions (`closeCheckout()`, `closeViewOrder()`, `closeSuccess()`, `closeAll()`) to remove `document.body.classList.remove('modal-open');`.  
  - Ensure `closeAll()` handles it comprehensively.  
  - In `placeOrder()`, when transitioning from checkout to success modal, maintain the class.

- [ ] **Step 3: Verify No Conflicts**  
  - Check that cart sidebar toggle doesn't interfere (it uses overlay but not modal class).  
  - Ensure pointer-events don't affect modal internals.

- [ ] **Step 4: Test the Fix**  
  - Open a modal (e.g., checkout via cart).  
  - Try clicking "Add to Cart" or other background elements: Should be blocked.  
  - Interact with modal (close button, form): Should work.  
  - Close modal: Background interactions resume.  
  - Test on mobile for touch events.  
  - Use browser dev tools to inspect pointer-events.

- [ ] **Step 5: Cleanup and Finalize**  
  - Update TODO.md to mark complete.  
  - No backend changes needed.

**Notes:**
- This fix uses CSS pointer-events for efficiency; no JS event capturing needed.
- After implementation, use `attempt_completion` to present the result.

---

# Task: Add Mobile-Only Access Restriction

## Steps to Complete

- [x] **Step 1: Update index.html**
  Add a hidden div with id "desktop-message" containing the message "This site is available only on mobile devices." before the .container div.

- [x] **Step 2: Update styles.css**
  Add CSS for #desktop-message: full-screen overlay, centered text, clean design using existing color variables.

- [x] **Step 3: Update script.js**
  Add isMobile() function to detect mobile devices based on screen width <=768 or user agent.
  In DOMContentLoaded, check if not mobile: hide .container, show #desktop-message, and stop further initialization.

- [x] **Step 4: Test the Implementation**
  - Resize browser window to simulate desktop/tablet: Should show the message and hide main content.
  - Resize to mobile width: Should show normal menu.
  - Test on actual mobile device if possible.

- [x] **Step 5: Cleanup**
  - Mark complete in TODO.md.
  - No backend changes needed.

**Notes:**
- Uses screen width and user agent detection for reliability.
- Stops app initialization on non-mobile to prevent unnecessary API calls.
- After implementation, use `attempt_completion` to finalize.
