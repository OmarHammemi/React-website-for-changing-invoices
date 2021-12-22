import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';


import { ConfigModule } from '@nestjs/config';
import { TenantModule } from '../tenant/tenant.module';
import { AuthModule } from '../auth/auth.module';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';


@Module({
  imports: [
    ConfigModule,
    TenantModule,
    AuthModule,
    CacheModule.register({ttl: 600})
  ],
  controllers: [
    ItemController,
  ],
  providers: [
    ItemService,
  ],
  exports: [
    ItemService,
  ],
})
export class ItemModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ItemController);
    consumer
      .apply(AuthMiddleware)

      .forRoutes(ItemController);
  }
}
