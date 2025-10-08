// API Configuration
// Pure HTML/CSS/JS - Using Google Apps Script as Backend
(function() {
    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    // After deploying the script, you'll get a URL like:
    // https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxq94pI1e3lLjP60aKWhPLNgrr5B1TZLDkffpTyaCaJM2ZpppvUUpw_uY2Emety0kPG/exec';
    
    // Set as direct string for consistency (for index.html)
    window.API_BASE_URL = GOOGLE_APPS_SCRIPT_URL;
    
    console.log('🔧 API Config (Google Apps Script):', window.API_BASE_URL);
    
    // Helper function to make API calls to Google Apps Script
    window.apiCall = async function(endpoint, method = 'GET', data = null) {
        const url = method === 'GET' 
            ? `${GOOGLE_APPS_SCRIPT_URL}?path=${endpoint}`
            : GOOGLE_APPS_SCRIPT_URL;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (method === 'POST' && data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        return await response.json();
    };
})();
