import { AppConfig } from './index';
import { Logger } from '../shared/logger';

export default (): AppConfig => {
  Logger.info('📦 Loading system configurations from environment..');
  return {
    port: Number(process.env.PORT) || 5000,
    env: process.env.NODE_ENV as string,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRE as string,
    },
    otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
      from: process.env.SMTP_FROM_EMAIL || '"College Helpdesk" <noreply@helpdesk.com>',
    },
    brevo: {
      apiKey: process.env.BREVO_API_KEY as string,
      senderEmail: process.env.BREVO_SENDER_EMAIL || 'mohamedhudhaifazubair@gmail.com',
      senderName: process.env.BREVO_SENDER_NAME || 'College Helpdesk',
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
  };
};
