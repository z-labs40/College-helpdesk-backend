import nodemailer from 'nodemailer';
import { Logger } from '../shared/logger';
import { config } from '../config';

const { smtp } = config;

const transporter = nodemailer.createTransport({
  service: smtp.host.includes('gmail') ? 'gmail' : undefined,
  host: !smtp.host.includes('gmail') ? smtp.host : undefined,
  port: smtp.port,
  secure: smtp.port === 465,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const subject = 'College Helpdesk — Password Reset OTP';

  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background:#0f172a; color:#e2e8f0; font-family:'Inter',-apple-system,sans-serif; margin:0; padding:0; }
        .wrapper { background:#0f172a; padding:40px 20px; }
        .container { max-width:600px; margin:0 auto; background:#1e293b; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); }
        .header { background:linear-gradient(135deg,#1e40af,#3b82f6); padding:40px 32px; text-align:center; color:#fff; }
        .header h1 { margin:0; font-size:22px; font-weight:800; }
        .content { padding:40px 32px; }
        .message { font-size:16px; line-height:1.6; color:#94a3b8; margin-bottom:32px; }
        .otp-card { background:rgba(15,23,42,0.5); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:12px; margin-bottom:32px; text-align:center; }
        .otp { font-family:'JetBrains Mono',monospace; font-size:36px; color:#3b82f6; font-weight:700; letter-spacing:6px; }
        .footer { padding:24px 32px; background:#111827; color:#475569; font-size:13px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header"><h1>COLLEGE HELPDESK</h1></div>
          <div class="content">
            <div class="message">You requested to reset your password. Use the OTP below to proceed. It is valid for ${config.otpExpiryMinutes} minutes.</div>
            <div class="otp-card">
              <div style="font-size:13px;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Your One-Time Password</div>
              <div class="otp">${otp}</div>
            </div>
            <div style="color:#64748b;font-size:14px;text-align:center;">Do not share this OTP with anyone.</div>
          </div>
          <div class="footer"><p>This is an automated message from College Helpdesk.</p></div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: smtp.from,
      to: email,
      subject,
      html,
      text: `Your password reset OTP is: ${otp}\nValid for ${config.otpExpiryMinutes} minutes.`,
    });
    Logger.info(`✅ OTP email sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Failed to send OTP email to ${email}: ${error}`);
    throw error;
  }
};

export default { sendOTPEmail };
