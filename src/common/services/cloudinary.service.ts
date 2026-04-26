import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Multer } from 'multer';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly cloudName?: string;
  private readonly apiKey?: string;
  private readonly apiSecret?: string;
  private readonly uploadPreset?: string;

  constructor(private configService: ConfigService) {
    this.cloudName =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      this.configService.get<string>('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') ||
      this.configService.get<string>('NEXT_PUBLIC_CLOUDINARY_CLOUD_ID');
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    this.uploadPreset = this.configService.get<string>('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
    });

    if (!this.cloudName) {
      this.logger.warn('Cloudinary cloud name is missing. Set CLOUDINARY_CLOUD_NAME.');
    } else if (!this.apiKey || !this.apiSecret) {
      this.logger.warn(
        'CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET not found. Falling back to unsigned uploads if NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is set.',
      );
    }
  }

  private hasSignedCredentials(): boolean {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  /**
   * Upload a single image to Cloudinary
   * @param file Express file object from multer
   * @param folder Cloudinary folder path
   * @param options Additional upload options
   */
  async uploadImage(
    file: Multer.File,
    folder: string = 'golo',
    options: any = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const commonOptions = {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options,
      };

      const onUploadComplete = (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };

      const uploadStream = this.hasSignedCredentials()
        ? cloudinary.uploader.upload_stream(commonOptions, onUploadComplete)
        : this.uploadPreset
          ? cloudinary.uploader.unsigned_upload_stream(
              this.uploadPreset,
              commonOptions,
              onUploadComplete,
            )
          : null;

      if (!uploadStream) {
        reject(
          new Error(
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET, or set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET for unsigned uploads.',
          ),
        );
        return;
      }

      // Convert buffer to stream and pipe to cloudinary
      if (file.buffer) {
        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      } else {
        reject(new Error('File buffer is missing'));
      }
    });
  }

  /**
   * Upload multiple images to Cloudinary
   * @param files Array of express file objects
   * @param folder Cloudinary folder path
   */
  async uploadMultipleImages(
    files: Multer.File[],
    folder: string = 'golo',
  ): Promise<any[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, folder),
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId Public ID of the image to delete
   */
  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url Cloudinary image URL
   */
  getPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/([^/]+)\/([^/]+)$/);
    if (match) {
      return `${match[1]}/${match[2].split('.')[0]}`;
    }
    return null;
  }
}
