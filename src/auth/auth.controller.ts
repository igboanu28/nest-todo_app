import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ApiTags, ApiBody, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', required: true })
  password: string;
}

class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username', required: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', required: true })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'JWT token' })
  async login(@Body() req: { id: number; username: string }) {
    return this.authService.login(req);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.password);
  }
}
