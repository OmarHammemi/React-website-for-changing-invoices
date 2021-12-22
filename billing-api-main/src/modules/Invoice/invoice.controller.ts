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
  HttpStatus, Req, ParseIntPipe, Query, Header,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { Connection } from 'typeorm';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { InvoiceService } from './invoice.service';
import { InvoiceRep } from '../domain/invoice/invoice.interface';
import { UpdateInvoiceDomain } from '../domain/invoice/update.invoice.domain';
import { DictionaryRep } from '../domain/dictionary/dictionary.interface';
import { ItemService } from '../item/item.service';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
import { CreateUserDomain } from '../domain/user/create.user.domain';
import { UserRep } from '../domain/user/user.interface';
import { UpdateUserDomain } from '../domain/user/update.user.domain';
import { InvoicearchivRep,  } from '../domain/invoice/invoicearchiv.interface';



@Controller('invoice')
export class InvoiceController {
  constructor(private readonly configService: ConfigService,
              private readonly invoiceService: InvoiceService,
              private readonly itemService : ItemService,
              @Inject(TENANT_CONNECTION) private connection: Connection,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request): Promise<InvoiceRep[]> {
    const allTypesName = 'all-invoices';
    const tenantCacheKey = this.getCacheTenantKey(req, allTypesName);
    let invoices = await this.cacheManager.get<InvoiceRep[]>(tenantCacheKey);

    // return data from cache
    if(invoices) {
      return invoices;
    }

    // load and set data in cache
    invoices = await this.invoiceService.findAll(this.connection);
    await this.cacheManager.set<InvoiceRep[]>(tenantCacheKey, invoices);

    return invoices;
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteDictionary(@Param('id') invoiceId: number, @Req() req: Request): Promise<void> {
    // get dictionary type to invalidate cache
    const invoice = await this.invoiceService.findOneById(this.connection, invoiceId);

    const response = await this.invoiceService.delete(this.connection, invoiceId);

    // invalidate cache
    await this.cacheManager.del(this.getCacheTenantKey(req, invoice.invoiceno));

    return response;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') invoiceId: number): Promise<InvoiceRep[]> {
    return await this.invoiceService.findOneByIdd(this.connection, invoiceId);
  }



  @Get('/status/:status')
  @HttpCode(HttpStatus.OK)
  async findByStatus(@Param('status') status: boolean): Promise<InvoiceRep[]> {
    return await this.invoiceService.findOneByStatus(this.connection, status);
  }





  @Delete('/paid/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async MarkasPaid1(@Param('id', ParseIntPipe) memberId): Promise<Record<string, unknown>> {
    await this.invoiceService.setInvoiceAsPaid(this.connection, memberId, false);
    return { message: 'Marked As paid' }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async createOrUpdateDictionary(@Body() payload: UpdateInvoiceDomain, @Req() req: Request): Promise<InvoiceRep> {
    const invoice = await this.invoiceService.createOrUpdate(this.connection, payload);
     const items = payload.items;
     const itemsAffectedToInvoice = items.map(item =>{
       return {
         ...item,
         idInvoice: invoice.id
       }
     })
     for (const item of itemsAffectedToInvoice) {
        await this.itemService.createOrUpdate(this.connection, item);
      }
    await this.cacheManager.del(this.getCacheTenantKey(req, payload.invoiceno));

    return invoice;
  }
  @Put('/archiv')
  @HttpCode(HttpStatus.OK)
  async createArchiv(@Body() payload: UpdateInvoiceDomain, @Req() req: Request): Promise<InvoicearchivRep> {
    const invoice = await this.invoiceService.ArchiveInvoice(this.connection, payload);
    const items = payload.items;
    const itemsAffectedToInvoice = items.map(item =>{
      return {
        ...item,
        idInvoice: invoice.id
      }
    })
    for (const item of itemsAffectedToInvoice) {
      await this.itemService.Archive(this.connection, item);
    }
    await this.cacheManager.del(this.getCacheTenantKey(req, payload.invoiceno));

    return invoice;
  }



  private getCacheTenantKey(req: Request, type: string): string {
    const tenantName: string = (req as any).headers['x-business-name'];
    return `${tenantName}-${type}`;
  }
}
