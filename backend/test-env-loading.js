// Test if .env is loading properly with plain node
const dotenv = require('dotenv');
const path = require('path');

console.log('\n🔍 Testing .env Loading\n');
console.log('Current Directory:', __dirname);
console.log('ENV File Path:', path.join(__dirname, '.env'));

// Load .env
const result = dotenv.config();

if (result.error) {
    console.log('❌ Error loading .env:', result.error);
} else {
    console.log('✅ .env loaded successfully');
}

console.log('\n📋 Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ ' + process.env.EMAIL_USER : '❌ NOT LOADED');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT LOADED');
console.log('OWNER_EMAIL:', process.env.OWNER_EMAIL ? '✅ ' + process.env.OWNER_EMAIL : '❌ NOT LOADED');
console.log('PORT:', process.env.PORT ? '✅ ' + process.env.PORT : '❌ NOT LOADED');
console.log('RESTAURANT_NAME:', process.env.RESTAURANT_NAME ? '✅ ' + process.env.RESTAURANT_NAME : '❌ NOT LOADED');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ PROBLEM: Environment variables not loading!');
    console.log('\n🔧 Possible fixes:');
    console.log('1. Make sure .env file is in backend folder');
    console.log('2. Check .env file has no syntax errors');
    console.log('3. Restart terminal/PowerShell');
} else {
    console.log('\n✅ All environment variables loaded correctly!');
}
