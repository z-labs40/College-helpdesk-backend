import dotenv from 'dotenv';
import defaultConfig from './default';
import { Logger } from '../shared/logger';

dotenv.config();

export interface AppConfig {
  port: number;
  env: string;
  frontendUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  otpExpiryMinutes: number;
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  brevo: {
    apiKey: string;
    senderEmail: string;
    senderName: string;
  };
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export class Config {
  public static config: AppConfig | null = null;

  private static validate = (config: AppConfig): void => {
    const requiredVars = [
      { key: 'PORT', value: config.port },
      { key: 'NODE_ENV', value: config.env },
      { key: 'JWT_SECRET', value: config.jwt.secret },
      { key: 'JWT_EXPIRE', value: config.jwt.expiresIn },
      { key: 'OTP_EXPIRY_MINUTES', value: config.otpExpiryMinutes },
      { key: 'BREVO_API_KEY', value: config.brevo.apiKey },
      { key: 'BREVO_SENDER_EMAIL', value: config.brevo.senderEmail },
    ];

    const missing = requiredVars
      .filter(v => v.value === undefined || v.value === null || v.value === '' || Number.isNaN(v.value))
      .map(v => v.key);

    if (missing.length > 0) {
      Logger.error(`❌ Missing or invalid environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }

    Logger.info('✅ Configuration validated successfully.');
  };

  private static load = (): AppConfig => {
    const loadedConfig = defaultConfig();
    Config.validate(loadedConfig);
    return loadedConfig;
  };

  static get = (): AppConfig => {
    if (!Config.config) {
      Config.config = this.load();
    }
    return Config.config;
  };
}

export const config = Config.get();
