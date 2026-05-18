import { BrevoClient } from '@getbrevo/brevo';
import { Logger } from '../shared/logger';
import { config } from '../config';

const client = new BrevoClient({ 
  apiKey: config.brevo.apiKey 
});

/**
 * Sends an OTP email for password reset
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const htmlContent = `
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
    await client.transactionalEmails.sendTransacEmail({
      subject: 'College Helpdesk — Password Reset OTP',
      to: [{ email }],
      sender: { 
        name: config.brevo.senderName, 
        email: config.brevo.senderEmail 
      },
      htmlContent,
      textContent: `Your password reset OTP is: ${otp}\nValid for ${config.otpExpiryMinutes} minutes.`
    });
    Logger.info(`✅ Brevo: OTP email sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Brevo: Failed to send OTP email to ${email}: ${JSON.stringify(error)}`);
    throw error;
  }
};

/**
 * Sends an invite email for new users/technicians
 */
export const sendInviteEmail = async (email: string, name: string, inviteLink: string): Promise<void> => {
  const htmlContent = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background:#0f172a; color:#e2e8f0; font-family:'Inter',-apple-system,sans-serif; margin:0; padding:0; }
        .wrapper { background:#0f172a; padding:40px 20px; }
        .container { max-width:600px; margin:0 auto; background:#1e293b; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); }
        .header { background:linear-gradient(135deg,#059669,#10b981); padding:40px 32px; text-align:center; color:#fff; }
        .header h1 { margin:0; font-size:22px; font-weight:800; }
        .content { padding:40px 32px; }
        .message { font-size:16px; line-height:1.6; color:#94a3b8; margin-bottom:24px; }
        .btn { display:inline-block; background:#10b981; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; margin-top:16px; }
        .footer { padding:24px 32px; background:#111827; color:#475569; font-size:13px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header"><h1>WELCOME TO THE TEAM</h1></div>
          <div class="content">
            <div class="message">Hello ${name},<br><br>You have been invited to join the <strong>College Helpdesk</strong> as a member of our team. Click the button below to complete your registration.</div>
            <div style="text-align:center;">
              <a href="${inviteLink}" class="btn">Complete Registration</a>
            </div>
            <div style="color:#64748b;font-size:14px;text-align:center;margin-top:32px;">This link will expire in 24 hours.</div>
          </div>
          <div class="footer"><p>This is an automated message from College Helpdesk.</p></div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: 'Welcome to College Helpdesk — Join the Team',
      to: [{ email }],
      sender: { 
        name: config.brevo.senderName, 
        email: config.brevo.senderEmail 
      },
      htmlContent
    });
    Logger.info(`✅ Brevo: Invite email sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Brevo: Failed to send invite email to ${email}: ${JSON.stringify(error)}`);
    throw error;
  }
};

export const sendTechnicianInviteEmail = async (
  email: string, 
  name: string, 
  temporaryPass: string, 
  loginLink: string
): Promise<void> => {
  const htmlContent = `
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
        .message { font-size:16px; line-height:1.6; color:#94a3b8; margin-bottom:24px; }
        .credentials-card { background:rgba(15,23,42,0.5); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:12px; margin-bottom:32px; }
        .cred-item { margin-bottom:12px; font-size:15px; color:#e2e8f0; }
        .cred-label { font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700; letter-spacing:1px; margin-bottom:4px; }
        .cred-value { font-family:'JetBrains Mono',monospace; font-weight:700; color:#3b82f6; }
        .btn { display:inline-block; background:#3b82f6; color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; margin-top:16px; }
        .footer { padding:24px 32px; background:#111827; color:#475569; font-size:13px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header"><h1>COLLEGE HELPDESK</h1></div>
          <div class="content">
            <div class="message">Hello ${name},<br><br>You have been added as a <strong>Technician</strong> in our College Helpdesk platform. Please use the temporary credentials below to log in and get started.</div>
            <div class="credentials-card">
              <div class="cred-item">
                <div class="cred-label">Login Email</div>
                <div class="cred-value">${email}</div>
              </div>
              <div class="cred-item" style="margin-bottom:0;">
                <div class="cred-label">Temporary Password</div>
                <div class="cred-value" style="font-size:18px;">${temporaryPass}</div>
              </div>
            </div>
            <div style="text-align:center;">
              <a href="${loginLink}" class="btn">Log In to Dashboard</a>
            </div>
            <div style="color:#64748b;font-size:13px;text-align:center;margin-top:24px;">For security, we recommend changing your password once logged in under "My Profile".</div>
          </div>
          <div class="footer"><p>This is an automated message from College Helpdesk.</p></div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: 'Welcome to College Helpdesk — Technician Invitation',
      to: [{ email }],
      sender: { 
        name: config.brevo.senderName, 
        email: config.brevo.senderEmail 
      },
      htmlContent,
      textContent: `Welcome to College Helpdesk!\n\nUse the following credentials to log in:\nEmail: ${email}\nTemporary Password: ${temporaryPass}\nLogin here: ${loginLink}`
    });
    Logger.info(`✅ Brevo: Technician invite email sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Brevo: Failed to send technician invite email to ${email}: ${JSON.stringify(error)}`);
    throw error;
  }
};

/**
 * Sends an email notification to the old address about an email change
 */
export const sendOldEmailNotification = async (
  email: string,
  name: string,
  newEmail: string
): Promise<void> => {
  const htmlContent = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background:#0f172a; color:#e2e8f0; font-family:'Inter',-apple-system,sans-serif; margin:0; padding:0; }
        .wrapper { background:#0f172a; padding:40px 20px; }
        .container { max-width:600px; margin:0 auto; background:#1e293b; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); }
        .header { background:linear-gradient(135deg,#e11d48,#be123c); padding:40px 32px; text-align:center; color:#fff; }
        .header h1 { margin:0; font-size:22px; font-weight:800; }
        .content { padding:40px 32px; }
        .message { font-size:16px; line-height:1.6; color:#94a3b8; margin-bottom:24px; }
        .alert-card { background:rgba(225,29,72,0.1); border:1px solid rgba(225,29,72,0.2); padding:20px; border-radius:10px; margin-bottom:24px; color:#f43f5e; font-size:14px; }
        .footer { padding:24px 32px; background:#111827; color:#475569; font-size:13px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header"><h1>SECURITY ALERT: EMAIL CHANGED</h1></div>
          <div class="content">
            <div class="message">Hello ${name},<br><br>The email address associated with your College Helpdesk technician account has been changed.<br><br>
            <strong>Old Email:</strong> ${email}<br>
            <strong>New Email:</strong> ${newEmail}<br><br>
            If you did not authorize this change, please contact the administrator immediately.</div>
            <div class="alert-card">
              <strong>Warning:</strong> If you did not make or authorize this change, your account security might be compromised.
            </div>
          </div>
          <div class="footer"><p>This is an automated security message from College Helpdesk.</p></div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: 'Email Address Changed',
      to: [{ email }],
      sender: { 
        name: config.brevo.senderName, 
        email: config.brevo.senderEmail 
      },
      htmlContent,
      textContent: `Hello ${name},\n\nThe email address associated with your College Helpdesk account has been changed from ${email} to ${newEmail}.\n\nIf you did not authorize this change, please contact the administrator immediately.`
    });
    Logger.info(`✅ Brevo: Old email change notification sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Brevo: Failed to send old email notification to ${email}: ${JSON.stringify(error)}`);
    throw error;
  }
};

/**
 * Sends an email notification to the new address about a successful email change
 */
export const sendNewEmailNotification = async (
  email: string,
  name: string,
  oldEmail: string
): Promise<void> => {
  const htmlContent = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { background:#0f172a; color:#e2e8f0; font-family:'Inter',-apple-system,sans-serif; margin:0; padding:0; }
        .wrapper { background:#0f172a; padding:40px 20px; }
        .container { max-width:600px; margin:0 auto; background:#1e293b; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); }
        .header { background:linear-gradient(135deg,#059669,#10b981); padding:40px 32px; text-align:center; color:#fff; }
        .header h1 { margin:0; font-size:22px; font-weight:800; }
        .content { padding:40px 32px; }
        .message { font-size:16px; line-height:1.6; color:#94a3b8; margin-bottom:24px; }
        .info-card { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); padding:20px; border-radius:10px; margin-bottom:24px; color:#10b981; font-size:14px; }
        .footer { padding:24px 32px; background:#111827; color:#475569; font-size:13px; text-align:center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header"><h1>EMAIL SUCCESSFULLY UPDATED</h1></div>
          <div class="content">
            <div class="message">Hello ${name},<br><br>Your College Helpdesk technician account email has been successfully updated from <strong>${oldEmail}</strong> to <strong>${email}</strong>.</div>
            <div class="info-card">
              This email address is now linked to your account. All future OTPs and system notifications will be sent to this email address.
            </div>
          </div>
          <div class="footer"><p>This is an automated message from College Helpdesk.</p></div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: 'Email Successfully Updated',
      to: [{ email }],
      sender: { 
        name: config.brevo.senderName, 
        email: config.brevo.senderEmail 
      },
      htmlContent,
      textContent: `Hello ${name},\n\nYour email address has been successfully updated. This email (${email}) is now linked to your account. All future OTPs and notifications will be sent here.`
    });
    Logger.info(`✅ Brevo: New email confirmation notification sent to ${email}`);
  } catch (error) {
    Logger.error(`❌ Brevo: Failed to send new email notification to ${email}: ${JSON.stringify(error)}`);
    throw error;
  }
};

export default { 
  sendOTPEmail, 
  sendInviteEmail, 
  sendTechnicianInviteEmail,
  sendOldEmailNotification,
  sendNewEmailNotification
};
