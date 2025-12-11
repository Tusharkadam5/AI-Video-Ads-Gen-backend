"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const mkdirAsync = (0, util_1.promisify)(fs.mkdir);
const writeFileAsync = (0, util_1.promisify)(fs.writeFile);
let UploadService = class UploadService {
    configService;
    s3Client;
    storageType;
    uploadDir;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.storageType = this.configService.get('UPLOAD_STORAGE_TYPE', 'local');
        this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
        this.baseUrl = this.configService.get('UPLOAD_BASE_URL', 'http://localhost:3000');
        if (this.storageType === 's3') {
            const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
            const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
            const region = this.configService.get('AWS_REGION');
            if (!accessKeyId || !secretAccessKey || !region) {
                throw new Error('AWS credentials are required for S3 storage');
            }
            this.s3Client = new client_s3_1.S3Client({
                region,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
        }
        if (this.storageType === 'local') {
            this.ensureUploadDir();
        }
    }
    async ensureUploadDir() {
        try {
            await mkdirAsync(this.uploadDir, { recursive: true });
        }
        catch (error) {
            console.error('Error creating upload directory:', error);
        }
    }
    generateFileName(originalName) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(originalName);
        return `${timestamp}_${randomString}${extension}`;
    }
    async uploadImage(file) {
        const fileName = this.generateFileName(file.originalname);
        if (this.storageType === 's3') {
            return await this.uploadToS3(file, fileName);
        }
        else {
            return await this.uploadToLocal(file, fileName);
        }
    }
    async uploadToLocal(file, fileName) {
        const filePath = path.join(this.uploadDir, fileName);
        await writeFileAsync(filePath, file.buffer);
        const url = `${this.baseUrl}/api/uploads/images/${fileName}`;
        return { url };
    }
    async uploadToS3(file, fileName) {
        const bucket = this.configService.get('AWS_S3_BUCKET');
        const key = `images/${fileName}`;
        const command = new client_s3_1.PutObjectCommand({
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
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map