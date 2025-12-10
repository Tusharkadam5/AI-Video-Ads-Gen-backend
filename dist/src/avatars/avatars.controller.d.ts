import { AvatarsService } from './avatars.service';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
    findAll(): {
        id: string;
        name: string;
        style: string;
        imageUrl: string;
    }[];
    findOne(id: string): {
        id: string;
        name: string;
        style: string;
        imageUrl: string;
    } | undefined;
}
