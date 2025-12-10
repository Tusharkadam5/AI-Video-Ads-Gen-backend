export declare class AvatarsService {
    private readonly avatars;
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
