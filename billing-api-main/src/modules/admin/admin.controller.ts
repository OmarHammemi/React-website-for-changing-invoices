import { ConfigService } from '@nestjs/config';
import { Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Tenant } from '../tenant/tenant.entity';
import { Request } from 'express';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { Connection } from 'typeorm';
import { DictionaryCreationService } from '../dictionary/dictionary-creation.service';

@Controller('admin')
export class AdminController {

  constructor(private readonly configService: ConfigService,
              private readonly adminService: AdminService,
              private readonly dictionaryCreationService: DictionaryCreationService,
              @Inject(TENANT_CONNECTION) private connection: Connection) {
  }

  @Get('tenants')
  async findAllTenants(): Promise<Tenant[]> {
    return await this.adminService.findAllTenants();
  }

  @Post('init')
  @HttpCode(HttpStatus.CREATED)
  async createDefaultThirdPartySellers(@Req() req: Request): Promise<void> {
    await this.dictionaryCreationService.createDefaultDictionaries(this.connection);
  }
}
