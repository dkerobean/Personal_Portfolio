import nodemailer from 'nodemailer';

// Serverless function to handle contact form submissions
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Security: Check for email injection attempts (matching original PHP)
    const pattern = /(content-type|bcc:|cc:|to:)/i;
    if (pattern.test(name) || pattern.test(email) || pattern.test(message)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected'
      });
    }

    // Send email using configured service
    await sendEmail({ name, email, subject, message });

    return res.status(200).json({
      success: true,
      message: 'We have received your mail, We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sorry, Message could not send! Please try again.'
    });
  }
}

// Email sending function
async function sendEmail({ name, email, subject, message }) {
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured, logging submission:', {
      name, email, subject, message, timestamp: new Date().toISOString()
    });
    return; // Just log if no email config
  }

  try {
    // Configure email transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      }
    });

    // Email content (matching the original PHP structure)
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || 'hridoywebdev@gmail.com', // Default from original PHP
      replyTo: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Portfolio Contact Form Submission</h2>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}?subject=feedback">${email}</a></p>
          <br>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', mailOptions.to);

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error; // Re-throw to be handled by the main function
  }
}
