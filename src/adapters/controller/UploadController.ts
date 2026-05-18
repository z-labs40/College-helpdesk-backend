import { Request, Response, Router } from 'express';
import { upload } from '../../infrastructure/multerConfig';
import { uploadToCloudinary } from '../../infrastructure/cloudinary';
import { authMiddleware } from '../../frameworks/middleware';
import { SuccessResponse } from '../../frameworks/types';
import { Logger } from '../../shared/logger';

export class UploadController {
  public router: Router = Router();

  constructor() {
    // Only authenticated users are allowed to upload images
    this.router.post(
      '/',
      authMiddleware,
      upload.single('image'),
      this.handleUpload.bind(this)
    );
  }

  async handleUpload(req: any, res: Response, next: any): Promise<any> {
    try {
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          error: 'No file provided. Please submit an image using the field name "image".',
        });
      }

      Logger.info(`📂 Processing uploaded file: ${req.file.originalname} (${req.file.size} bytes)`);

      // Upload to Cloudinary stream
      const secureUrl = await uploadToCloudinary(req.file.buffer, 'helpdesk_attachments');

      return res.status(201).json({
        ok: true,
        data: {
          url: secureUrl,
          name: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        message: 'Image uploaded successfully to Cloudinary.',
      } as SuccessResponse<any>);
    } catch (err) {
      return next(err);
    }
  }
}
