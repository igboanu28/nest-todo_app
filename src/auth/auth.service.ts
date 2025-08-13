import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

interface AuthUser {
  id: number;
  username: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    if (!username || !password) {
      this.logger.warn(
        `Validation failed: username=${username}, password=${!!password}`,
      );
      return null;
    }
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...result } = user;
      this.logger.log(`User validated: ${username}`);
      return result;
    }
    this.logger.warn(`Invalid credentials for username: ${username}`);
    return null;
  }

  login(user: AuthUser) {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.log(
      `Generating JWT for user: ${user.username}, id: ${user.id}, token: ${token.substring(0, 10)}`,
    );
    return {
      access_token: token,
    };
  }

  async register(username: string, password: string): Promise<User> {
    if (!username || !password) {
      this.logger.warn(
        `Registration failed: username=${username}, password=${!!password}`,
      );
      throw new BadRequestException('Username and password are required');
    }
    const hashed = await bcrypt.hash(password, 10);
    this.logger.log(`Registering user: ${username}`);
    return this.usersService.create({ username, password: hashed });
  }
}
