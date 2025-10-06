require('dotenv').config();

console.log('\n🔍 COMPLETE EMAIL SYSTEM DIAGNOSIS\n');
console.log('='.repeat(60));

// Step 1: Check Environment Variables
console.log('\n📋 STEP 1: Environment Variables Check');
console.log('-'.repeat(60));

const envVars = {
    'EMAIL_USER': process.env.EMAIL_USER,
    'EMAIL_PASSWORD': process.env.EMAIL_PASSWORD,
    'OWNER_EMAIL': process.env.OWNER_EMAIL,
    'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY,
    'RESTAURANT_NAME': process.env.RESTAURANT_NAME
};

let hasEmailConfig = false;
for (const [key, value] of Object.entries(envVars)) {
    if (key === 'EMAIL_USER' || key === 'EMAIL_PASSWORD') {
        if (value) {
            console.log(`✅ ${key}: ${value.substring(0, 3)}***${value.substring(value.length - 3)}`);
            hasEmailConfig = true;
        } else {
            console.log(`❌ ${key}: NOT SET`);
        }
    } else if (key === 'EMAIL_PASSWORD') {
        console.log(`✅ ${key}: ${value ? '***SET***' : 'NOT SET'}`);
    } else {
        console.log(`${value ? '✅' : '⚠️ '} ${key}: ${value || 'Not set (optional)'}`);
    }
}

if (!hasEmailConfig) {
    console.log('\n❌ CRITICAL: EMAIL_USER and EMAIL_PASSWORD not configured!');
    console.log('\n📝 FIX:');
    console.log('   1. Open backend/.env file');
    console.log('   2. Add: EMAIL_USER=your-email@gmail.com');
    console.log('   3. Add: EMAIL_PASSWORD=your-gmail-app-password');
    console.log('   4. Create Gmail App Password: https://myaccount.google.com/apppasswords');
    process.exit(1);
}

// Step 2: Check Dependencies
console.log('\n📦 STEP 2: Dependencies Check');
console.log('-'.repeat(60));

let nodemailerOk = false;
let sendgridOk = false;

try {
    require('nodemailer');
    console.log('✅ nodemailer: Installed');
    nodemailerOk = true;
} catch (e) {
    console.log('❌ nodemailer: NOT INSTALLED');
    console.log('   Fix: npm install nodemailer');
}

try {
    require('@sendgrid/mail');
    console.log('✅ @sendgrid/mail: Installed');
    sendgridOk = true;
} catch (e) {
    console.log('❌ @sendgrid/mail: NOT INSTALLED');
    console.log('   Fix: npm install @sendgrid/mail');
}

if (!nodemailerOk || !sendgridOk) {
    console.log('\n❌ CRITICAL: Missing dependencies!');
    console.log('   Run: npm install');
    process.exit(1);
}

// Step 3: Test Email Service Import
console.log('\n📧 STEP 3: Email Service Check');
console.log('-'.repeat(60));

let emailService;
try {
    emailService = require('./utils/emailService');
    console.log('✅ Email service loaded successfully');
    console.log('✅ sendOrderConfirmation function:', typeof emailService.sendOrderConfirmation);
} catch (e) {
    console.log('❌ Failed to load email service:', e.message);
    process.exit(1);
}

// Step 4: Test SMTP Connection
console.log('\n🔌 STEP 4: Testing Gmail SMTP Connection');
console.log('-'.repeat(60));

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('Testing connection...');

transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ SMTP Connection FAILED:', error.message);
        console.log('\n📝 COMMON ISSUES:');
        console.log('   1. Using regular Gmail password instead of App Password');
        console.log('   2. 2-Step Verification not enabled on Gmail');
        console.log('   3. Wrong email or password in .env file');
        console.log('\n🔧 HOW TO FIX:');
        console.log('   1. Go to: https://myaccount.google.com/apppasswords');
        console.log('   2. Enable 2-Step Verification if not enabled');
        console.log('   3. Create new App Password for "Mail"');
        console.log('   4. Copy the 16-character password (remove spaces)');
        console.log('   5. Update EMAIL_PASSWORD in .env file');
        console.log('   6. Restart server and run this test again');
        process.exit(1);
    } else {
        console.log('✅ SMTP Connection SUCCESS!');
        
        // Step 5: Send Test Email
        console.log('\n📨 STEP 5: Sending Test Email');
        console.log('-'.repeat(60));
        
        const testOrder = {
            orderId: 'TEST-' + Date.now(),
            tableNumber: '99',
            customerName: 'Test Customer',
            mobile: '9999999999',
            email: process.env.EMAIL_USER,
            items: [
                { name: 'Test Pizza', quantity: 1, price: 299 },
                { name: 'Test Coke', quantity: 2, price: 50 }
            ],
            total: 399,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };
        
        console.log('Sending test order email to:', testOrder.email);
        console.log('Order ID:', testOrder.orderId);
        
        emailService.sendOrderConfirmation(testOrder)
            .then(result => {
                console.log('\n' + '='.repeat(60));
                if (result.success) {
                    console.log('✅✅✅ SUCCESS! EMAIL SYSTEM WORKING! ✅✅✅');
                    console.log('='.repeat(60));
                    console.log('\n📬 Check your inbox:', testOrder.email);
                    console.log('📬 Check spam folder if not in inbox');
                    console.log('\n✅ Your email system is ready for production!');
                    console.log('✅ Orders will automatically send emails to customers');
                    if (process.env.OWNER_EMAIL) {
                        console.log('✅ Owner will also receive notifications at:', process.env.OWNER_EMAIL);
                    }
                } else {
                    console.log('❌❌❌ EMAIL SENDING FAILED ❌❌❌');
                    console.log('='.repeat(60));
                    console.log('\nError:', result.error);
                    console.log('\n📝 Check the error above and fix the issue');
                }
            })
            .catch(error => {
                console.log('\n❌ ERROR:', error.message);
                console.log('Stack:', error.stack);
            });
    }
});
