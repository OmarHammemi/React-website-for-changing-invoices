import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';


import { ConfigModule } from '@nestjs/config';
import { TenantModule } from '../tenant/tenant.module';
import { AuthModule } from '../auth/auth.module';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ItemService } from '../item/item.service';

@Module({
  imports: [
    ConfigModule,
    TenantModule,
    AuthModule,
    CacheModule.register({ttl: 600})
  ],
  controllers: [
    InvoiceController,
  ],
  providers: [
    InvoiceService,
    ItemService
  ],
  exports: [
    InvoiceService,
    ItemService
  ],
})
export class InvoiceModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(InvoiceController);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/invoice', method: RequestMethod.GET },
        { path: 'api/invoice', method: RequestMethod.PUT },
        { path: 'api/invoice/archiv', method: RequestMethod.PUT },
        { path: 'api/invoice/:id', method: RequestMethod.DELETE },
        { path: 'api/invoice/:id', method: RequestMethod.GET },
        { path: '/api/invoice/paid/:id', method: RequestMethod.DELETE },
        { path: '/api/invoice/status/:status', method: RequestMethod.GET },
        { path: 'api/invoice/generatePDF', method: RequestMethod.GET },
      )
      .forRoutes(InvoiceController);
  }
}
