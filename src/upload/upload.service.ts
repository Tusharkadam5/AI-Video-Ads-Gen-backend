import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class UploadService {
    private s3Client: S3Client;
    private storageType: string;
    private uploadDir: string;
    private baseUrl: string;

    constructor(private configService: ConfigService) {
        this.storageType = this.configService.get('UPLOAD_STORAGE_TYPE', 'local');
        this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
        this.baseUrl = this.configService.get('UPLOAD_BASE_URL', 'http://localhost:3000');

        // Initialize S3 client if using S3 storage
        if (this.storageType === 's3') {
            const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
            const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
            const region = this.configService.get<string>('AWS_REGION');

            if (!accessKeyId || !secretAccessKey || !region) {
                throw new Error('AWS credentials are required for S3 storage');
            }

            this.s3Client = new S3Client({
                region,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
        }

        // Ensure upload directory exists for local storage
        if (this.storageType === 'local') {
            this.ensureUploadDir();
        }
    }

    private async ensureUploadDir(): Promise<void> {
        try {
            await mkdirAsync(this.uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creating upload directory:', error);
        }
    }

    private generateFileName(originalName: string): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(originalName);
        return `${timestamp}_${randomString}${extension}`;
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
        const fileName = this.generateFileName(file.originalname);

        if (this.storageType === 's3') {
            return await this.uploadToS3(file, fileName);
        } else {
            return await this.uploadToLocal(file, fileName);
        }
    }

    private async uploadToLocal(
        file: Express.Multer.File,
        fileName: string,
    ): Promise<{ url: string }> {
        const filePath = path.join(this.uploadDir, fileName);
        await writeFileAsync(filePath, file.buffer);

        const url = `${this.baseUrl}/api/uploads/images/${fileName}`;
        return { url };
    }

    private async uploadToS3(
        file: Express.Multer.File,
        fileName: string,
    ): Promise<{ url: string }> {
        const bucket = this.configService.get('AWS_S3_BUCKET');
        const key = `images/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        const url = `https://${bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
        return { url };
    }
}
