import { NextFunction, Request, Response } from 'express';
import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { Connection, createConnection, getConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantService } from '../../tenant/tenant-service.decorator';
import { Tenant } from '../../tenant/tenant.entity';
import { User } from '../../user/user.entity';
import { UserView } from '../../user/user.view';
import { Company } from '../../company/company.entity';
import { Dictionary } from '../../dictionary/dictionary.entity';
import { CompanyView } from '../../company/company.view';
import { InvoiceView } from '../../Invoice/invoice.view';
import { Invoice } from '../../Invoice/invoice.entity';
import { Item } from '../../item/item.entity';
import { ItemView } from '../../item/item.view';
import { Invoicearchiv } from '../../Invoice/invoicearchiv.entity';
import { InvoicearchivView } from '../../Invoice/invoicearchiv.view';
import { Itemarchiv } from '../../item/itemarchiv.entity';
import { ItemarchivView } from '../../item/itemarchiv.view';


@TenantService()
export class TenantMiddleware implements NestMiddleware {

  constructor(private readonly connection: Connection,
              private readonly configService: ConfigService) {
  }

  public async use(req: Request, res: Response, next: NextFunction) {

    const queryHeader = (req as any).headers['x-business-name'];
    const tenant: Tenant = await this.connection.getRepository(Tenant).findOne(({ where: { businessName: queryHeader } }));
    if (!tenant) {
      throw new BadRequestException('Database Connection Error', 'There is a Error with the Database!');
    }

    const connectionId = this.getCustomConnectionName(tenant);
    try {
      getConnection(connectionId);
      next();
    } catch (error) {
      const createdConnection: Connection = await createConnection({
        name: connectionId,
        type: 'mysql',
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: tenant.dbLogin,
        password: tenant.dbPassword,
        database: tenant.dbName,
        insecureAuth: true,
        entities: [
          Tenant,
          User,
          UserView,
          Company,
          CompanyView,
          Invoice,
          InvoiceView,
          Item,
          ItemView,
          Invoicearchiv,
          InvoicearchivView,
          Itemarchiv,
          ItemarchivView,
          Dictionary,
        ],
        logging: this.configService.get<boolean>('database.logging')
      });

      if (createdConnection) {
        next();
      } else {
        throw new BadRequestException('Database Connection Error', 'There is a Error with the Database!');
      }
    }
  }

  getCustomConnectionName = (tenant: Tenant) => tenant.id + '-' + tenant.dbName;
}
