import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto, OAuthProvider } from './dto/oauth-login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProviderType } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) { }

    async signup(dto: SignupDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('User already exists');
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

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        return this.generateTokens(user);
    }

    async oauthLogin(dto: OAuthLoginDto) {
        // Mock verification
        const profile = await this.mockVerifyOAuthToken(dto.provider, dto.token);

        // Find auth provider
        let authProvider = await this.prisma.authProvider.findUnique({
            where: {
                provider_providerUserId: {
                    provider: dto.provider === 'GOOGLE' ? AuthProviderType.GOOGLE : AuthProviderType.FACEBOOK,
                    providerUserId: profile.id,
                },
            },
            include: { user: true },
        });

        let user;

        if (authProvider) {
            user = authProvider.user;
        } else {
            // Check if user exists by email to link
            if (profile.email) {
                user = await this.usersService.findByEmail(profile.email);
            }

            if (!user) {
                // Create new user
                user = await this.usersService.create({
                    email: profile.email,
                    fullName: profile.name,
                    profileImage: profile.picture,
                    isEmailVerified: true, // Trusted provider
                });
            }

            // Link provider
            await this.prisma.authProvider.create({
                data: {
                    userId: user.id,
                    provider: dto.provider === 'GOOGLE' ? AuthProviderType.GOOGLE : AuthProviderType.FACEBOOK,
                    providerUserId: profile.id,
                    providerEmail: profile.email,
                },
            });
        }

        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        return this.generateTokens(user);
    }

    async refreshTokens(refreshToken: string) {
        const payload = this.jwtService.decode(refreshToken) as any;
        if (!payload || !payload.sub) throw new UnauthorizedException('Invalid token');

        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId: payload.sub,
                tokenHash,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!storedToken) throw new UnauthorizedException('Token invalid or revoked');

        // Revoke used token (Rotation)
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { isRevoked: true },
        });

        const user = await this.usersService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException('User not found');

        return this.generateTokens(user);
    }

    async logout(userId: string) {
        // Ideally we revoke the specific refresh token, but for now we can revoke all or just rely on client removing it.
        // Enhanced: Revoke all refresh tokens for user (safe approach)
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
        return { message: 'Logged out' };
    }

    private async generateTokens(user: any) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET') || 'access-secret',
            expiresIn: this.configService.get('JWT_ACCESS_TTL') || '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
            expiresIn: this.configService.get('JWT_REFRESH_TTL') || '7d',
        });

        // Store refresh token hash
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Default 7d

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

    private async mockVerifyOAuthToken(provider: string, token: string) {
        // Mock response
        return {
            id: `mock-${provider}-id-${Math.random().toString(36).substring(7)}`,
            email: `user-${Math.random().toString(36).substring(7)}@example.com`,
            name: 'Mock User',
            picture: 'https://via.placeholder.com/150',
        };
    }
}
