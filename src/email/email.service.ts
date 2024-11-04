import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('GMAIL_USER'),
        pass: this.configService.get('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `${this.configService.get('FRONTEND_URL_CLIENT')}/verify/${token}`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .header {
              text-align: center;
              padding: 20px;
              background-color: #ffffff;
            }
            .amazon-logo {
              display: inline-block;
              position: relative;
              padding: 20px;
            }
            .amazon-text {
              font-family: Arial, sans-serif;
              font-size: 50px;
              font-weight: bold;
              color: #232F3E;
              text-decoration: none;
              position: relative;
            }
            .amazon-smile {
              position: absolute;
              right: 20px;
              bottom: 18px;
              width: 22px;
              height: 22px;
              border: 6px solid #FF9900;
              border-top: 0;
              border-left: 0;
              transform: rotate(45deg);
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .button {
              background-color: #FF9900;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="amazon-logo">
                <span class="amazon-text">amazon</span>
                <span class="amazon-smile"></span>
              </div>
            </div>
            <div class="content">
              <h1>Verify Your Email Address</h1>
              <p>Thank you for registering. Please click the button below to verify your email address:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('GMAIL_USER'),
        to: to,
        subject: 'Verify Your Email Address',
        html: emailTemplate,
      });
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL_CLIENT')}/reset-password/${token}`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .header {
              text-align: center;
              padding: 20px;
              background-color: #ffffff;
            }
            .amazon-logo {
              display: inline-block;
              position: relative;
              padding: 20px;
            }
            .amazon-text {
              font-family: Arial, sans-serif;
              font-size: 50px;
              font-weight: bold;
              color: #232F3E;
              text-decoration: none;
              position: relative;
            }
            .amazon-smile {
              position: absolute;
              right: 20px;
              bottom: 18px;
              width: 22px;
              height: 22px;
              border: 6px solid #FF9900;
              border-top: 0;
              border-left: 0;
              transform: rotate(45deg);
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .button {
              background-color: #FF9900;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="amazon-logo">
                <span class="amazon-text">amazon</span>
                <span class="amazon-smile"></span>
              </div>
            </div>
            <div class="content">
              <h1>Reset Your Password</h1>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('GMAIL_USER'),
        to: to,
        subject: 'Reset Your Password',
        html: emailTemplate,
      });
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }
}
