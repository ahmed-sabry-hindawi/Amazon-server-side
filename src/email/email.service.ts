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
      from: 'Your Company <samman66512@gmail.com>',
      to: to,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #232f3e;">Welcome to Our Website!</h2>
          <p>Hello ${to},</p>
          <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/verifyEmail?token=${token}" style="background-color: #ff9900; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 3px;">Verify Email Address</a>
          </div>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>Your Company Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: 'Your Company <samman66512@gmail.com>',
      to: to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #232f3e;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your account. To proceed with resetting your password, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://your-domain.com/resetPassword?token=${token}" style="background-color: #ff9900; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 3px;">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>Your Company Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
