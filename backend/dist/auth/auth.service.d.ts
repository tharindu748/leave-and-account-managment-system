import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly SALT_ROUNDS;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResultDto>;
    validateUser(loginDto: LoginDto): Promise<{
        userId: number;
        name: string;
        email: string;
        isAdmin: boolean;
        employeeId: string | null;
    } | null>;
    login(user: {
        userId: number;
        name: string;
        email: string;
        isAdmin: boolean;
        employeeId: string | null;
    }): Promise<AuthResultDto>;
    logout(userId: number): Promise<{
        employeeId: string | null;
        name: string;
        cardNumber: string | null;
        validFrom: Date | null;
        validTo: Date | null;
        epfNo: string | null;
        password: string;
        nic: string | null;
        jobPosition: string | null;
        joinDate: Date | null;
        address: string | null;
        email: string;
        imagePath: string | null;
        id: number;
        isAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
        refreshToken: string | null;
        active: boolean;
    }>;
    refreshTokens(userId: number, refreshToken: string): Promise<AuthResultDto>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    getTokens(userId: number, name: string, email: string, isAdmin: boolean, employeeId: string | null): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
