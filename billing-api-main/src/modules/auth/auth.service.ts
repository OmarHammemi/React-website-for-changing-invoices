import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { Connection } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserView } from '../user/user.view';
import { TokenDomain } from '../domain/auth/token.domain';

@Injectable()
export class AuthService {

  constructor(private readonly configService: ConfigService,
              private readonly userService: UserService) {
  }

  async loginUser(connection: Connection, email: string, password: string): Promise<UserView> {
    let user: UserView;

    try {
      user = await this.userService.findOneByEmail(connection, email);
    } catch (err) {
      throw new UnauthorizedException(`There isn't any user with email: ${email}`);
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(`Wrong password for user with email: ${email}`);
    }

    return user;
  }

  async validateUser(connection: Connection, userId: number): Promise<UserView> {
    let User: UserView;

    try {
      User = await this.userService.findOneById(connection, userId);
    } catch (err) {
      throw new UnauthorizedException(`There isn't any user with id: ${userId}`);
    }
    return User;
  }

  async createToken(connection: Connection, user: UserView): Promise<TokenDomain> {
    const signOptions: JwtSignOptions = {
      expiresIn: Number(this.configService.get<number>('auth.expiresIn')),
      algorithm: 'HS384',
    };

    return {
      expiresIn: this.configService.get('auth.expiresIn'),
      accessToken: jwt.sign({ id: user.id }, this.configService.get<string>('auth.secret'), signOptions),
      userId: user.id,
    };
  }
}
