// API Configuration
// Pure HTML/CSS/JS - Using Google Apps Script as Backend
(function() {
    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    // After deploying the script, you'll get a URL like:
    // https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-T0cU0YCsZORxug5UNAZMYFIbHAPsYBpC4Q8Pf5EOvTqcA5yLOswYoM4qYq8uheJr/exec';
    
    // Set as direct string for consistency
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
