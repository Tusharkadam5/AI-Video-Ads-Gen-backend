import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Res, Req, HttpException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.signup(dto);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return only access token and user
        return {
            access_token: result.access_token,
            user: result.user,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(dto);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return only access token and user
        return {
            access_token: result.access_token,
            user: result.user,
        };
    }

    @Post('oauth/google')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with Google' })
    async googleLogin(@Body() dto: OAuthLoginDto, @Res({ passthrough: true }) res: Response) {
        dto.provider = 'GOOGLE' as any;
        const result = await this.authService.oauthLogin(dto);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            access_token: result.access_token,
            user: result.user,
        };
    }

    @Post('oauth/facebook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with Facebook' })
    async facebookLogin(@Body() dto: OAuthLoginDto, @Res({ passthrough: true }) res: Response) {
        dto.provider = 'FACEBOOK' as any;
        const result = await this.authService.oauthLogin(dto);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            access_token: result.access_token,
            user: result.user,
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
        }

        const result = await this.authService.refreshTokens(refreshToken);

        // Set new refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            access_token: result.access_token,
            user: result.user,
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        return this.authService.logout(user.id);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@CurrentUser() user: any) {
        return user;
    }
}
