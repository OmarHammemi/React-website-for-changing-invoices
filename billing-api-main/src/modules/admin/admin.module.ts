import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from '../tenant/tenant.module';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule,
    TenantModule,
    AuthModule,
    DictionaryModule
  ],
  controllers: [
    AdminController,
  ],
  providers: [
    AdminService,
  ],
  exports: [
    AdminService,
  ],
})
export class AdminModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(AdminController);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/admin/init', method: RequestMethod.POST },
      )
      .forRoutes(AdminController);
  }
}
