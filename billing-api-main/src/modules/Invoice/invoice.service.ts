import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InvoiceRep } from '../domain/invoice/invoice.interface';
import { InvoiceView } from './invoice.view';
import { UpdateInvoiceDomain } from '../domain/invoice/update.invoice.domain';
import { Invoice } from './invoice.entity';
import { ItemView } from '../item/item.view';
import { UpdateItemDomain } from '../domain/item/update.item.domain';
import { ItemRep } from '../domain/item/item.interface';
import { Item } from '../item/item.entity';
import { CreateUserDomain } from '../domain/user/create.user.domain';
import { User } from '../user/user.entity';
import { UserView } from '../user/user.view';
import { validate } from 'class-validator';
import * as argon2 from 'argon2';
import { CreateInvoiceDomain } from '../domain/invoice/create.invoice.domain';
import { UpdateUserDomain } from '../domain/user/update.user.domain';
import { UpdateInvoicearchivDomain } from '../domain/invoice/update.invoicearchiv.domain';
import { InvoicearchivRep } from '../domain/invoice/invoicearchiv.interface';
import { Invoicearchiv } from './invoicearchiv.entity';
import { InvoicearchivView } from './invoicearchiv.view';




@Injectable()
export class InvoiceService {
  public async findAll(connection: Connection): Promise<InvoiceRep[]> {

      const queryBuilder = await this.getQueryBuilderWithJoins(connection);

      return await queryBuilder.getMany();

  }


  public async createOrUpdate(connection: Connection, invoiceDomain: UpdateInvoiceDomain): Promise<InvoiceRep> {
    try {
      const repository: Repository<Invoice> = await connection.getRepository(Invoice);
      const repositoryQuery: Repository<InvoiceView> = await connection.getRepository(InvoiceView);
      const { invoiceno } = invoiceDomain;
      const qb = await repositoryQuery
        .createQueryBuilder('invoice')
        .where('invoice.invoiceno = :invoiceno', { invoiceno });


      let invoice;

      if (invoiceDomain.id != null) {
        invoice = await repository.findOne(invoiceDomain.id);
        invoice = {
          ...invoice,
          ...invoiceDomain,
          updatedAt: new Date(),
          updatedBy: 0,
        }

      } else {
        const existedUser = await qb.getOne();

        if (existedUser) {
          const _errors = { invoice: 'invoice number must be unique.' };
          throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
        }

        invoice = {
          ...invoiceDomain,
          createdAt: new Date(),
          createdBy: 0
        }
      }

      return await repository.save(invoice);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving invoice'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async ArchiveInvoice(connection: Connection, invoiceArchivDomain: UpdateInvoicearchivDomain): Promise<InvoicearchivRep> {
    try {
      const repository: Repository<Invoicearchiv> = await connection.getRepository(Invoicearchiv);
      const repositoryQuery: Repository<InvoicearchivView> = await connection.getRepository(InvoicearchivView);
      const { invoiceno } = invoiceArchivDomain;
      const qb = await repositoryQuery
        .createQueryBuilder('invoicearchiv')
        .where('invoicearchiv.invoiceno = :invoiceno', { invoiceno });


      let invoice;

      if (invoiceArchivDomain.id != null) {
        invoice = await repository.findOne(invoiceArchivDomain.id);
        invoice = {
          ...invoice,
          ...invoiceArchivDomain,
          updatedAt: new Date(),
          updatedBy: 0,
        }

      } else {
        const existedUser = await qb.getOne();

        if (existedUser) {
          const _errors = { invoice: 'invoice number must be unique.' };
          throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
        }

        invoice = {
          ...invoiceArchivDomain,
          createdAt: new Date(),
          createdBy: 0
        }
      }

      return await repository.save(invoice);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving invoice'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  public async delete(connection: Connection, id: number): Promise<void> {
    try {
      const repository: Repository<InvoiceView> = await connection.getRepository(InvoiceView);

      await repository.delete({ id });
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error deleting invoice'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOneById(connection: Connection, id: number): Promise<InvoiceView> {
    try {
      const repository: Repository<InvoiceView> = await connection.getRepository(InvoiceView);
      return await repository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException({ error: 'invoice Read', message: 'invoice not found' }, HttpStatus.NOT_FOUND);
    }
  }

  public async findOneByIdd(connection: Connection, id: number): Promise<InvoiceRep[]> {
    try {
      const queryBuilder = await connection.getRepository(InvoiceView).createQueryBuilder('inv');
      queryBuilder.leftJoinAndMapMany('inv.items', ItemView, 'i', 'inv.id = i.idInvoice')
        .where('inv.id = :id', { id });

      queryBuilder.getQuery()

      return await queryBuilder.getMany();

      //const repository: Repository<InvoiceView> = await connection.getRepository(InvoiceView);
      //return await repository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException({ error: 'invoice Read', message: 'invoice not found' }, HttpStatus.NOT_FOUND);
    }
  }

  public async setInvoiceAsPaid(connection: Connection, InvoiceId: number, status: boolean): Promise<void> {
    const repository: Repository<Invoice> = await connection.getRepository(Invoice);
    const invoice = await repository.findOne({
      where: { id: InvoiceId },
    });

    if (!invoice) {
      throw new HttpException(
        'Invoice id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await repository.save({ ...invoice, status: true });
    } catch (errors) {
      throw new HttpException({
        message: errors,
        error: 'Can\'t delete the User',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }





  public async findOneByStatus(connection: Connection, status: boolean): Promise<InvoiceRep[]> {
    try {
      const queryBuilder = await connection.getRepository(InvoiceView).createQueryBuilder('inv');
      queryBuilder.leftJoinAndMapMany('inv.items', ItemView, 'i', 'inv.id = i.idInvoice')
        .where('inv.status = :status', { status });

      queryBuilder.getQuery()

      return await queryBuilder.getMany();

      //const repository: Repository<InvoiceView> = await connection.getRepository(InvoiceView);
      //return await repository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException({ error: 'invoice Read', message: 'invoice not found' }, HttpStatus.NOT_FOUND);
    }
  }



  private async getQueryBuilderWithJoins(connection: Connection) {

    const queryBuilder = await connection.getRepository(InvoiceView).createQueryBuilder('inv');

    queryBuilder.leftJoinAndMapMany('inv.items', ItemView, 'i', 'inv.id = i.idInvoice');

    queryBuilder.getQuery()

    return queryBuilder;
  }

}
