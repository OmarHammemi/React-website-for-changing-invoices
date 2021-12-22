import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { ConfigModule } from '@nestjs/config';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { DictionaryCreationService } from './dictionary-creation.service';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule,
    TenantModule,
    AuthModule,
    CacheModule.register({ttl: 600})
  ],
  controllers: [
    DictionaryController,
  ],
  providers: [
    DictionaryService,
    DictionaryCreationService
  ],
  exports: [
    DictionaryService,
    DictionaryCreationService
  ],
})
export class DictionaryModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(DictionaryController);
    consumer
      .apply(AuthMiddleware)
      .forRoutes(DictionaryController);
  }
}
