import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { Logger } from '../shared/logger';

const cloudName = config.cloudinary?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = config.cloudinary?.apiKey || process.env.CLOUDINARY_API_KEY;
const apiSecret = config.cloudinary?.apiSecret || process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

Logger.info('☁️ Cloudinary SDK configured successfully.');

/**
 * Upload an in-memory buffer to Cloudinary using secure upload streams.
 * 
 * @param fileBuffer The raw Buffer of the file to be uploaded.
 * @param folder The folder inside Cloudinary where the file should be saved.
 * @returns A Promise resolving to the secure URL of the uploaded image.
 */
export function uploadToCloudinary(fileBuffer: Buffer, folder: string = 'helpdesk'): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if configuration is missing
    if (!cloudName || !apiKey || !apiSecret) {
      const errorMsg = 'Cloudinary credentials are not properly configured in the environment.';
      Logger.error(`❌ Cloudinary error: ${errorMsg}`);
      return reject(new Error(errorMsg));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          Logger.error(`❌ Cloudinary upload failed: ${error.message}`);
          return reject(error);
        }
        if (result && result.secure_url) {
          Logger.info(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);
          return resolve(result.secure_url);
        }
        return reject(new Error('Cloudinary upload returned no result or secure URL.'));
      }
    );

    uploadStream.end(fileBuffer);
  });
}
