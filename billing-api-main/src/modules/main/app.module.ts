import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../health/health.controller';
import auth from '../../config/auth.config';
import databaseConfig from '../../config/database.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { AdminModule } from '../admin/admin.module';
import { ResponseTimeMiddleware } from '../common/middleware/response.time.middleware';
import { TenantModule } from '../tenant/tenant.module';
import { Tenant } from '../tenant/tenant.entity';
import { CompanyModule } from '../company/company.module';
import { InvoiceModule } from '../Invoice/invoice.module';
import { ItemModule } from '../item/item.module';
import { PDFModule,PDFModuleOptions } from '@t00nday/nestjs-pdf';
import { PdfConfigService } from '../pdfinvoice/pdfconfig.service';

@Module({
  imports: [
    PDFModule.registerAsync({
      useClass: PdfConfigService,
    }),
    ConfigModule.forRoot({
      load: [auth, databaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        insecureAuth: true,
        entities: [Tenant],
        migrationsRun: configService.get<boolean>('database.migrationsRun'),
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize')
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    TenantModule,
    AuthModule,
    UserModule,
    DictionaryModule,
    CompanyModule,
    InvoiceModule,
    ItemModule,
    AdminModule
  ],
  controllers: [ AppController, HealthController ],
  providers: [ AppService ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseTimeMiddleware)
      .forRoutes('*');
  }
}

