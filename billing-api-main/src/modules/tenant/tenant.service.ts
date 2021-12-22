import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantRep } from '../domain/tenant/tenant.interface';

@Injectable()
export class TenantCrudService {

  constructor(@Inject() private repository: Repository<Tenant>){}

  async create(tenantDomain: Tenant): Promise<TenantRep> {
    try {
      const toCreate = this.repository.create(tenantDomain);
      const createdTenant = await this.repository.save(toCreate);
      return TenantCrudService.buildTenantRep(createdTenant);
    } catch (errors) {
      throw new HttpException({
        message: errors,
        error: 'Database Creation',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOneById(id: number): Promise<TenantRep> {
    try {
      const tenant = await this.repository.findOneOrFail(id);
      return TenantCrudService.buildTenantRep(tenant)
    } catch (error) {
      throw new HttpException({ error: 'Tenant Read', message: 'Item not found'}, HttpStatus.NOT_FOUND);
    }
  }


  private static buildTenantRep(tenant: Tenant): TenantRep {
    return {
      tenantId: tenant.id,
      businessName: tenant.businessName,
      dbName: tenant.dbName,
      dbLogin: tenant.dbLogin,
    };
  }
}
