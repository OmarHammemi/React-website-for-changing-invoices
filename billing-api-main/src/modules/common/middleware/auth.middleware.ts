import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TenantService } from '../../tenant/tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { Connection } from 'typeorm';
import { AuthService } from '../../auth/auth.service';

@TenantService()
export class AuthMiddleware implements NestMiddleware {


  constructor(private readonly configService: ConfigService,
              private authenticationService: AuthService,
              @Inject(TENANT_CONNECTION) private connection: Connection) {
  }

  async use(req: Request, res: Response, next: NextFunction) {

    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      let member;
      try{
        const decoded: any = jwt.verify(token, this.configService.get<string>('auth.secret'));
        member = await this.authenticationService.validateUser(this.connection, decoded.id);
      }catch (error) {
        throw new HttpException('Error when authenticating user', HttpStatus.UNAUTHORIZED);
      }

      if (member == null) {
        throw new HttpException('Member not found.', HttpStatus.UNAUTHORIZED);
      }

      req['user'] = member;
      next();

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
