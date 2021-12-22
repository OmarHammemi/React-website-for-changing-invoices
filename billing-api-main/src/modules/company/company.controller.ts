import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Inject,
  CACHE_MANAGER,
  HttpCode,
  HttpStatus, Req
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ConfigService } from '@nestjs/config';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { CompanyRep } from '../domain/company/company.interface';
import { Cache } from 'cache-manager';
import { UpdateCompanyDomain } from '../domain/company/update.company.domain';


@Controller('company')
export class CompanyController {
  constructor(private readonly configService: ConfigService,
              private readonly companyService: CompanyService,
              @Inject(TENANT_CONNECTION) private connection: Connection,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<CompanyRep[]> {
    const allTypesName = 'all-companies';
    const tenantCacheKey = this.getCacheTenantKey(req, allTypesName);
    let companies = await this.cacheManager.get<CompanyRep[]>(tenantCacheKey);

    // return data from cache
    if(companies) {
      return companies;
    }

    // load and set data in cache
    companies = await this.companyService.findAll(this.connection);
    await this.cacheManager.set<CompanyRep[]>(tenantCacheKey, companies);

    return companies;
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDictionary(@Param('id') companyId: number, @Req() req: Request): Promise<void> {
    // get dictionary type to invalidate cache
    const company = await this.companyService.findOneById(this.connection, companyId);

    const response = await this.companyService.delete(this.connection, companyId);

    // invalidate cache
    await this.cacheManager.del(this.getCacheTenantKey(req, company.name));

    return response;
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async createOrUpdateDictionary(@Body() payload: UpdateCompanyDomain, @Req() req: Request): Promise<CompanyRep> {
    const company = await this.companyService.createOrUpdate(this.connection, payload);
    await this.cacheManager.del(this.getCacheTenantKey(req, payload.name));

    return company;
  }



  private getCacheTenantKey(req: Request, type: string): string {
    const tenantName: string = (req as any).headers['x-business-name'];
    return `${tenantName}-${type}`;
  }
}
