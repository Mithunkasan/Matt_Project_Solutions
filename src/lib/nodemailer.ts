// lib/nodemailer.ts
import nodemailer from 'nodemailer';

// Create transporter - CORRECTED VERSION
const createTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const transporter = await createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #12498b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 24px; background-color: #b12222; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <h2>Hello!</h2>
                    <p>You requested to reset your password. Click the button below to create a new password:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetLink}" class="button">Reset Password</a>
                    </div>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 4px;">
                        ${resetLink}
                    </p>
                    
                    <p>This link will expire in 1 hour for security reasons.</p>
                    
                    <div class="footer">
                        <p>If you didn't request this reset, please ignore this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    console.log('Sending email to:', email);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}