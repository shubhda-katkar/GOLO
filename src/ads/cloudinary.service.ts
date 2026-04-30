import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly uploadFolder: string;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudinaryUrl = this.configService.get<string>('config.cloudinary.url');
    const cloudName = this.configService.get<string>('config.cloudinary.cloudName');
    const apiKey = this.configService.get<string>('config.cloudinary.apiKey');
    const apiSecret = this.configService.get<string>('config.cloudinary.apiSecret');

    this.uploadFolder =
      this.configService.get<string>('config.cloudinary.uploadFolder') || 'golo/ads';

    if (cloudinaryUrl) {
      cloudinary.config({
        cloudinary_url: cloudinaryUrl,
      });
      this.isConfigured = true;
      return;
    }

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      return;
    }

    this.isConfigured = false;
  }

  async uploadImage(fileBuffer: Buffer, fileName?: string): Promise<string> {
    if (!this.isConfigured) {
      throw new InternalServerErrorException(
        'Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend .env',
      );
    }

    if (!fileBuffer?.length) {
      throw new InternalServerErrorException('Image file is empty');
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.uploadFolder,
          resource_type: 'image',
          public_id: fileName ? this.sanitizeFileName(fileName) : undefined,
          overwrite: false,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(new InternalServerErrorException('Cloudinary upload failed'));
            return;
          }
          resolve(result.secure_url);
        },
      );

      stream.end(fileBuffer);
    });
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 80);
  }
}
