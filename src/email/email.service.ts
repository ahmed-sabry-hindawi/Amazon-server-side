import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: ' Amazon Website <samman66512@gmail.com>',
      to: to,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #232f3e;">Welcome to Amazon !</h2>
          <p>Hello ${to},</p>
          <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://amazon-client-side-iti.vercel.app/verifyEmail?token=${token}" style="background-color: #ff9900; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 3px;">Verify Email Address</a>
          </div>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>Your Amazon Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmailForAdmin(
    to: string,
    token: string,
  ): Promise<void> {
    const mailOptions = {
      from: 'Amazon Admin Portal <noreply@amazon.com>',
      to: to,
      subject: 'Admin Password Reset Request - Amazon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" style="max-width: 150px;">
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 15px;">Admin Password Reset Request</h2>
            <p style="color: #666; margin-bottom: 10px;">Hello Administrator,</p>
            <p style="color: #666; line-height: 1.5;">A password reset was requested for your admin account. For security reasons, this link will expire in 60 minutes.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://amazon-dashboard-angular-iti--eight.vercel.app/dashboard/ResetPassword?token=${token}" 
               style="background-color: #ff9900; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Admin Password
            </a>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="color: #666; margin-bottom: 10px; font-size: 14px;">⚠️ Security Notice:</p>
            <ul style="color: #666; font-size: 14px; padding-left: 20px;">
              <li>If you didn't request this password reset, please contact IT security immediately.</li>
              <li>Never share this reset link with anyone.</li>
              <li>Ensure you're using a secure network when resetting your password.</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>Amazon Admin Portal © ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent successfully to admin: ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to admin: ${to}`,
        error.stack,
      );
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: ' Amazon Website <samman66512@gmail.com>',
      to: to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #232f3e;">Welcome to Amazon !</h2>

          <h4 style="color: #232f3e;">Password Reset Request</h4>
          <p>Hello ${to},</p>
          <p>We received a request to reset the password for your account. To proceed with resetting your password, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">

            <a href="https://amazon-client-side-iti.vercel.app/ResetPassword?token=${token}" style="background-color: #ff9900; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 3px;">Reset Password</a>

          </div>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>Amazon Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
