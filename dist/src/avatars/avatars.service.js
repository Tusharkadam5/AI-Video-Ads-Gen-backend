"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsService = void 0;
const common_1 = require("@nestjs/common");
let AvatarsService = class AvatarsService {
    avatars = [
        { id: 'avatar-1', name: 'Alex', style: 'Professional', imageUrl: 'https://example.com/alex.jpg' },
        { id: 'avatar-2', name: 'Sarah', style: 'Casual', imageUrl: 'https://example.com/sarah.jpg' },
        { id: 'avatar-3', name: 'Mike', style: 'Energetic', imageUrl: 'https://example.com/mike.jpg' },
    ];
    findAll() {
        return this.avatars;
    }
    findOne(id) {
        return this.avatars.find(a => a.id === id);
    }
};
exports.AvatarsService = AvatarsService;
exports.AvatarsService = AvatarsService = __decorate([
    (0, common_1.Injectable)()
], AvatarsService);
//# sourceMappingURL=avatars.service.js.map