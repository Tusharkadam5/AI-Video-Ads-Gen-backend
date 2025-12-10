import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
        };
    }>;
    googleLogin(dto: OAuthLoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
        };
    }>;
    facebookLogin(dto: OAuthLoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
        };
    }>;
    logout(user: any, res: Response): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<any>;
}
