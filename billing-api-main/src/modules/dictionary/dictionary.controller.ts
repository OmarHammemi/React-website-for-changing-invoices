import { ConfigService } from '@nestjs/config';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { Connection } from 'typeorm';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { DictionaryRep } from '../domain/dictionary/dictionary.interface';
import { UpdateDictionaryDomain } from '../domain/dictionary/update.dictionary.domain';

@Controller('dictionaries')
export class DictionaryController {

  constructor(private readonly configService: ConfigService,
              private readonly dictionaryService: DictionaryService,
              @Inject(TENANT_CONNECTION) private connection: Connection,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') dictionaryId: number): Promise<DictionaryRep> {
    return await this.dictionaryService.findById(this.connection, dictionaryId);
  }

  @Get('/type/:type')
  @HttpCode(HttpStatus.OK)
  async findAllDictionariesByType(@Param('type') dictionaryType, @Req() req: Request): Promise<DictionaryRep[]> {
    let dictionaries = await this.cacheManager.get<DictionaryRep[]>(this.getCacheTenantKey(req, dictionaryType));

    // return data from cache
    if(dictionaries) {
      return dictionaries;
    }

    // load and set data in cache
    dictionaries = await this.dictionaryService.findAllByType(this.connection, dictionaryType);
    await this.cacheManager.set<DictionaryRep[]>(this.getCacheTenantKey(req, dictionaryType), dictionaries);

    return dictionaries;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<DictionaryRep[]> {
    const allTypesName = 'all-dictionaries';
    const tenantCacheKey = this.getCacheTenantKey(req, allTypesName);
    let dictionaries = await this.cacheManager.get<DictionaryRep[]>(tenantCacheKey);

    // return data from cache
    if(dictionaries) {
      return dictionaries;
    }

    // load and set data in cache
    dictionaries = await this.dictionaryService.findAll(this.connection);
    await this.cacheManager.set<DictionaryRep[]>(tenantCacheKey, dictionaries);

    return dictionaries;
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async createOrUpdateDictionary(@Body() payload: UpdateDictionaryDomain, @Req() req: Request): Promise<DictionaryRep> {
    const dictionary = await this.dictionaryService.createOrUpdate(this.connection, payload);

    // invalidate cache
    await this.cacheManager.del(this.getCacheTenantKey(req, payload.dictionary));

    return dictionary;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDictionary(@Param('id') dictionaryId: number, @Req() req: Request): Promise<void> {
    // get dictionary type to invalidate cache
    const dictionary = await this.dictionaryService.findById(this.connection, dictionaryId);

    const response = await this.dictionaryService.delete(this.connection, dictionaryId);

    // invalidate cache
    await this.cacheManager.del(this.getCacheTenantKey(req, dictionary.dictionary));

    return response;
  }

  private getCacheTenantKey(req: Request, type: string): string {
    const tenantName: string = (req as any).headers['x-business-name'];
    return `${tenantName}-${type}`;
  }

}
