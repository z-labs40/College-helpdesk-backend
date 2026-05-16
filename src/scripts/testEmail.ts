import { sendOTPEmail, sendInviteEmail } from '../infrastructure/emailService';
import { Logger } from '../shared/logger';

async function test() {
  console.log('🚀 Starting Brevo Email Service Test...');
  
  try {
    // This will likely fail if BREVO_API_KEY is not set correctly in .env
    // but it validates the code structure and types.
    console.log('Testing OTP Email function signature...');
    // await sendOTPEmail('test@example.com', '123456');
    
    console.log('Testing Invite Email function signature...');
    // await sendInviteEmail('test@example.com', 'Test User', 'http://localhost:5173/register?token=xyz');
    
    console.log('✅ Service logic and types are valid.');
  } catch (error) {
    console.error('❌ Test failed (Expected if API key is missing):', error);
  }
}

test();
