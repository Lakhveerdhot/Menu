const nodemailer = require('nodemailer');

// Create email transporter
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

// Send order confirmation email to customer
async function sendOrderConfirmation(orderDetails) {
    try {
        const transporter = createTransporter();
        
        // Customer email HTML
        const customerEmailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0;">🍽️ ${process.env.RESTAURANT_NAME || 'Our Restaurant'}</h1>
                    <p style="margin: 10px 0 0 0;">Order Confirmation</p>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #ff6b35; margin-top: 0;">✅ Order Placed Successfully!</h2>
                        <p>Thank you for your order, <strong>${orderDetails.customerName || 'Valued Customer'}</strong>!</p>
                        <p>Your order has been received and is being prepared.</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">📋 Order Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Order ID:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Table Number:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.tableNumber}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Order Time:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.timestamp}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">🍴 Your Items</h3>
                        ${orderDetails.items.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                                <div>
                                    <strong>${item.name}</strong><br>
                                    <span style="color: #666; font-size: 0.9em;">Quantity: ${item.quantity}</span>
                                </div>
                                <div style="text-align: right;">
                                    <strong style="color: #ff6b35;">₹${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            </div>
                        `).join('')}
                        
                        <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 2px solid #ff6b35;">
                            <strong style="font-size: 1.2em;">Total Amount:</strong>
                            <strong style="font-size: 1.2em; color: #ff6b35;">₹${orderDetails.total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 15px; border-radius: 10px; border-left: 4px solid #ff6b35;">
                        <p style="margin: 0; color: #666;">
                            <strong>📱 Track Your Order:</strong><br>
                            Visit: <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/view-order.html?orderId=${orderDetails.orderId}" 
                               style="color: #ff6b35; text-decoration: none;">View Order Status</a>
                        </p>
                    </div>
                </div>
                
                <div style="background: #333; padding: 20px; text-align: center; color: white;">
                    <p style="margin: 0; font-size: 0.9em;">Thank you for dining with us!</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #999;">
                        ${process.env.RESTAURANT_NAME || 'Our Restaurant'} | ${process.env.RESTAURANT_TAGLINE || 'Delicious Food, Great Service'}
                    </p>
                </div>
            </div>
        `;

        // Owner email HTML (with customer contact info)
        const ownerEmailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #2c3e50, #34495e); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0;">🔔 New Order Received!</h1>
                    <p style="margin: 10px 0 0 0;">Restaurant Order Notification</p>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                    <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
                        <h2 style="color: #2e7d32; margin-top: 0;">🎉 New Order Alert!</h2>
                        <p style="margin: 5px 0;">A new order has been placed and needs your attention.</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">👤 Customer Information</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.customerName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Mobile:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.mobile || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.email || 'N/A'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">📋 Order Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Order ID:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Table Number:</strong></td>
                                <td style="padding: 8px 0; text-align: right; font-size: 1.2em; color: #ff6b35;"><strong>Table ${orderDetails.tableNumber}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Order Time:</strong></td>
                                <td style="padding: 8px 0; text-align: right;">${orderDetails.timestamp}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">🍴 Ordered Items</h3>
                        ${orderDetails.items.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                                <div>
                                    <strong style="font-size: 1.1em;">${item.name}</strong><br>
                                    <span style="color: #666; font-size: 0.9em;">Quantity: <strong>${item.quantity}</strong></span>
                                </div>
                                <div style="text-align: right;">
                                    <strong style="color: #2e7d32; font-size: 1.1em;">₹${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            </div>
                        `).join('')}
                        
                        <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 3px solid #2e7d32; background: #e8f5e9; padding: 15px; border-radius: 5px;">
                            <strong style="font-size: 1.3em;">Total Amount:</strong>
                            <strong style="font-size: 1.3em; color: #2e7d32;">₹${orderDetails.total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 15px; border-radius: 10px; border-left: 4px solid #ff9800;">
                        <p style="margin: 0; color: #666;">
                            <strong>⚡ Action Required:</strong><br>
                            Please prepare this order for Table ${orderDetails.tableNumber}
                        </p>
                    </div>
                </div>
                
                <div style="background: #333; padding: 20px; text-align: center; color: white;">
                    <p style="margin: 0; font-size: 0.9em;">Restaurant Management System</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #999;">
                        ${process.env.RESTAURANT_NAME || 'Our Restaurant'}
                    </p>
                </div>
            </div>
        `;
        
        // Send email to customer
        const customerMailOptions = {
            from: `"${process.env.RESTAURANT_NAME || 'Restaurant'}" <${process.env.EMAIL_USER}>`,
            to: orderDetails.email,
            subject: `Order Confirmation - ${orderDetails.orderId}`,
            html: customerEmailHTML
        };
        
        await transporter.sendMail(customerMailOptions);
        console.log(`✅ Order confirmation email sent to customer: ${orderDetails.email}`);

        // Send email to restaurant owner (if configured)
        if (process.env.OWNER_EMAIL) {
            const ownerMailOptions = {
                from: `"${process.env.RESTAURANT_NAME || 'Restaurant'}" <${process.env.EMAIL_USER}>`,
                to: process.env.OWNER_EMAIL,
                subject: `🔔 New Order - Table ${orderDetails.tableNumber} - ${orderDetails.orderId}`,
                html: ownerEmailHTML
            };
            
            await transporter.sendMail(ownerMailOptions);
            console.log(`✅ Order notification email sent to owner: ${process.env.OWNER_EMAIL}`);
        } else {
            console.log('⚠️  OWNER_EMAIL not configured. Skipping owner notification.');
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendOrderConfirmation
};
