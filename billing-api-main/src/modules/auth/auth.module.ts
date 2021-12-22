import { forwardRef, HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import configuration from '../../config/auth.config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TenantModule,
    forwardRef(() => UserModule),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(AuthController);
  }
}
