import { Module, Scope } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';
import { Tenant } from './tenant.entity';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

function getConnectionName(tenant: Tenant) {
  return tenant.id + '-' + tenant.dbName;
}

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Tenant]),
  ],
  providers: [
    {
      provide: TENANT_CONNECTION,
      inject: [
        REQUEST,
        Connection,
      ],
      scope: Scope.REQUEST,
      useFactory: async (request, connection: Connection) => {
        const queryHeader = request.headers['x-business-name'];
        const tenant: Tenant = await connection.getRepository(Tenant).findOne(({ where: { businessName: queryHeader } }));
        return getConnection(getConnectionName(tenant));
      },
    },

  ],
  exports: [
    TENANT_CONNECTION
  ],
})
export class TenantModule {
}
