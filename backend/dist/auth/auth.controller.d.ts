import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<{
        accessToken: string;
        userId: number;
        name: string;
        email: string;
        isAdmin: boolean;
        employeeId: string | null;
    }>;
    login(req: any, res: Response): Promise<{
        accessToken: string;
        userId: number;
        name: string;
        email: string;
        isAdmin: boolean;
        employeeId: string | null;
    }>;
    logout(req: any, res: Response): Promise<{
        message: string;
    }>;
    refreshTokens(req: any, res: Response): Promise<{
        accessToken: string;
        userId: number;
        name: string;
        email: string;
        isAdmin: boolean;
        employeeId: string | null;
    }>;
    profile(): Promise<{
        message: string;
    }>;
}
