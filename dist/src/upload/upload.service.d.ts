import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private s3Client;
    private storageType;
    private uploadDir;
    private baseUrl;
    constructor(configService: ConfigService);
    private ensureUploadDir;
    private generateFileName;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    private uploadToLocal;
    private uploadToS3;
}
