import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use host/port from env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

export const sendOrderConfirmationEmail = async (order: any, products: any[]) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Skipping email: EMAIL_USER or EMAIL_PASS not set');
      return;
  }

  const productRows = products.map(item => `
    <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #db2777;">Order Confirmation</h2>
      <p>Hi ${order.customer.name},</p>
      <p>Thank you for your order! We have received your order <strong>#${order._id.toString().slice(0, 8)}</strong>.</p>
      
      <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.status === 'PAID' ? 'Paid' : 'Pending'}</p>
      </div>

      <h3>Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #f9fafb;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${productRows}
        </tbody>
      </table>

      <div style="margin-top: 30px;">
        <h3>Shipping Address</h3>
        <p>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
        <p>Mobile: ${order.customer.mobile}</p>
      </div>

      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        If you have any questions, please reply to this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Mahi's Vriksham" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Order Confirmation - #${order._id.toString().slice(0, 8)}`,
    html,
  });
};
