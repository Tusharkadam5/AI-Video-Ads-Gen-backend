import { ConfigService } from '@nestjs/config';
export declare class ScriptGeneratorService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    generateScript(data: {
        productName: string;
        productDescription: string;
        platform: string;
        duration: string;
        targetAudience: string;
        language: string;
    }): Promise<any>;
}
