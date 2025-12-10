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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    prisma;
    constructor(usersService, jwtService, configService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async signup(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
            isEmailVerified: false,
        });
        return this.generateTokens(user);
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        return this.generateTokens(user);
    }
    async oauthLogin(dto) {
        const profile = await this.mockVerifyOAuthToken(dto.provider, dto.token);
        let authProvider = await this.prisma.authProvider.findUnique({
            where: {
                provider_providerUserId: {
                    provider: dto.provider === 'GOOGLE' ? client_1.AuthProviderType.GOOGLE : client_1.AuthProviderType.FACEBOOK,
                    providerUserId: profile.id,
                },
            },
            include: { user: true },
        });
        let user;
        if (authProvider) {
            user = authProvider.user;
        }
        else {
            if (profile.email) {
                user = await this.usersService.findByEmail(profile.email);
            }
            if (!user) {
                user = await this.usersService.create({
                    email: profile.email,
                    fullName: profile.name,
                    profileImage: profile.picture,
                    isEmailVerified: true,
                });
            }
            await this.prisma.authProvider.create({
                data: {
                    userId: user.id,
                    provider: dto.provider === 'GOOGLE' ? client_1.AuthProviderType.GOOGLE : client_1.AuthProviderType.FACEBOOK,
                    providerUserId: profile.id,
                    providerEmail: profile.email,
                },
            });
        }
        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        return this.generateTokens(user);
    }
    async refreshTokens(refreshToken) {
        const payload = this.jwtService.decode(refreshToken);
        if (!payload || !payload.sub)
            throw new common_1.UnauthorizedException('Invalid token');
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId: payload.sub,
                tokenHash,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!storedToken)
            throw new common_1.UnauthorizedException('Token invalid or revoked');
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { isRevoked: true },
        });
        const user = await this.usersService.findOne(payload.sub);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.generateTokens(user);
    }
    async logout(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
        return { message: 'Logged out' };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET') || 'access-secret',
            expiresIn: this.configService.get('JWT_ACCESS_TTL') || '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
            expiresIn: this.configService.get('JWT_REFRESH_TTL') || '7d',
        });
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.fullName,
                image: user.profileImage,
            },
        };
    }
    async mockVerifyOAuthToken(provider, token) {
        return {
            id: `mock-${provider}-id-${Math.random().toString(36).substring(7)}`,
            email: `user-${Math.random().toString(36).substring(7)}@example.com`,
            name: 'Mock User',
            picture: 'https://via.placeholder.com/150',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map