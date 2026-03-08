const nodemailer = require('nodemailer');

// Create a transporter using your email service
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      res.status(400).json({ message: 'Valid email is required' });
      return;
    }

    // Email notification about new subscription
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Newsletter Subscription</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This user subscribed to your newsletter from the Nexus AI website.
          </p>
        </div>
      `
    };

    // Welcome email to subscriber
    const welcomeMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Nexus AI Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Nexus AI! 🚀</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive updates about:</p>
          <ul style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <li>Latest AI development trends</li>
            <li>New service announcements</li>
            <li>Exclusive tips and insights</li>
            <li>Special offers for subscribers</li>
          </ul>
          <p style="margin-top: 30px;">Best regards,<br>The Nexus AI Team</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">
            Nexus AI - Build Smarter. Launch Faster.<br>
            <a href="https://your-vercel-domain.vercel.app" style="color: #1a1a1a;">Visit our website</a>
          </p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(welcomeMailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
}
