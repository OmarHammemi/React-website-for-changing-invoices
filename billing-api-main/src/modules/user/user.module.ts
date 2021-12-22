import { forwardRef, MiddlewareConsumer, Module, RequestMethod, Scope } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ConfigModule } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Connection } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';
import { UserService } from './user.service';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

export const CURRENT_MEMBER = 'CURRENT_MEMBER';


@Module({
  imports: [
    ConfigModule,
    TenantModule,
    forwardRef(() =>AuthModule),
    LoggerModule.forRoot(),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    {
      provide: CURRENT_MEMBER,
      inject: [
        REQUEST,
        Connection,
      ],
      scope: Scope.REQUEST,
      useFactory: async (request) => {
        return request['user'];
      },
    },
  ],
  exports: [
    UserService,
    CURRENT_MEMBER,
  ],
})
export class UserModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(UserController);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/users/create', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
