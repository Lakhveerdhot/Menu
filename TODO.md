# Mobile-Only Website Implementation

## Tasks
- [x] Update `isMobile()` function in `script.js` with strong detection using userAgent, screen DPI, touch support, orientation
- [x] Add mobile detection to `view-order.html` with full-screen block message
- [x] Style the desktop message in `styles.css` to cover full screen
- [x] Update desktop message content in `index.html` to match requirements
- [x] Test implementation on mobile and desktop devices
- [x] Verify bypass prevention via inspect element emulation

## Notes
- Detection must use multiple reliable methods to prevent spoofing
- Message should be: "This website is only available on mobile devices." and "📱 Mobile only: Please open this site on your smartphone to continue."
- Block should be full-screen and non-bypassable
