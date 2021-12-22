import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from '../tenant/tenant.module';
import { AuthModule } from '../auth/auth.module';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule,
    TenantModule,
    AuthModule,
    CacheModule.register({ttl: 600})
  ],
  controllers: [
    CompanyController,
  ],
  providers: [
    CompanyService,
  ],
  exports: [
    CompanyService,
  ],
})
export class CompanyModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(CompanyController);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/company', method: RequestMethod.GET },
        { path: 'api/company', method: RequestMethod.PUT },
        { path: 'api/company/:id', method: RequestMethod.DELETE },
      )
      .forRoutes(CompanyController);
  }
}
