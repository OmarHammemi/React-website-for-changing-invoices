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
  HttpStatus, Req, ParseIntPipe, Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly configService: ConfigService,
              private readonly itemService: ItemService,
              @Inject(TENANT_CONNECTION) private connection: Connection,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }




  private getCacheTenantKey(req: Request, type: string): string {
    const tenantName: string = (req as any).headers['x-business-name'];
    return `${tenantName}-${type}`;
  }
}
