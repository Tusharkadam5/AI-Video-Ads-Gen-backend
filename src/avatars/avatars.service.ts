import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarsService {
    private readonly avatars = [
        { id: 'avatar-1', name: 'Alex', style: 'Professional', imageUrl: 'https://example.com/alex.jpg' },
        { id: 'avatar-2', name: 'Sarah', style: 'Casual', imageUrl: 'https://example.com/sarah.jpg' },
        { id: 'avatar-3', name: 'Mike', style: 'Energetic', imageUrl: 'https://example.com/mike.jpg' },
    ];

    findAll() {
        return this.avatars;
    }

    findOne(id: string) {
        return this.avatars.find(a => a.id === id);
    }
}
