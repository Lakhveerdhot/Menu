require('dotenv').config();

console.log('\n📧 EMAIL CONFIGURATION CHECK\n');
console.log('================================');

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing');
console.log('   OWNER_EMAIL:', process.env.OWNER_EMAIL ? '✅ Set' : '⚠️  Optional (not set)');
console.log('   SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '⚠️  Optional (not set)');

// Check dependencies
console.log('\n2. Dependencies:');
try {
    require('nodemailer');
    console.log('   nodemailer: ✅ Installed');
} catch (e) {
    console.log('   nodemailer: ❌ NOT INSTALLED - Run: npm install');
}

try {
    require('@sendgrid/mail');
    console.log('   @sendgrid/mail: ✅ Installed');
} catch (e) {
    console.log('   @sendgrid/mail: ❌ NOT INSTALLED - Run: npm install');
}

// Test email sending
console.log('\n3. Testing Email Service:');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ CANNOT TEST - EMAIL_USER and EMAIL_PASSWORD not configured in .env file');
    console.log('\n📝 TO FIX:');
    console.log('   1. Open backend/.env file');
    console.log('   2. Set EMAIL_USER=your-gmail@gmail.com');
    console.log('   3. Set EMAIL_PASSWORD=your-app-password (NOT your regular Gmail password)');
    console.log('   4. To create Gmail App Password:');
    console.log('      - Go to https://myaccount.google.com/apppasswords');
    console.log('      - Generate new app password');
    console.log('      - Copy the 16-character password to .env');
    process.exit(1);
}

const { sendOrderConfirmation } = require('./utils/emailService');

const testOrder = {
    orderId: 'TEST-' + Date.now(),
    tableNumber: '5',
    customerName: 'Test Customer',
    mobile: '9876543210',
    email: process.env.EMAIL_USER, // Send to yourself for testing
    items: [
        { name: 'Test Item', quantity: 1, price: 100 }
    ],
    total: 100,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
};

console.log('   Sending test email to:', testOrder.email);

sendOrderConfirmation(testOrder)
    .then(result => {
        if (result.success) {
            console.log('\n✅ SUCCESS! Email sent successfully!');
            console.log('   Check your inbox:', testOrder.email);
        } else {
            console.log('\n❌ FAILED:', result.error);
            console.log('\n📝 Common fixes:');
            console.log('   1. Use Gmail App Password (not regular password)');
            console.log('   2. Enable 2-Step Verification on Gmail');
            console.log('   3. Check if EMAIL_USER and EMAIL_PASSWORD are correct in .env');
        }
    })
    .catch(error => {
        console.log('\n❌ ERROR:', error.message);
    });
