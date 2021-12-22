import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InvoiceRep } from '../domain/invoice/invoice.interface';
import { UpdateInvoiceDomain } from '../domain/invoice/update.invoice.domain';
import { ItemRep } from '../domain/item/item.interface';
import { Item } from './item.entity';
import { UpdateItemDomain } from '../domain/item/update.item.domain';
import { ItemarchivRep,  } from '../domain/item/itemarchiv.interface';
import { UpdateItemarchivDomain,  } from '../domain/item/update.itemarchiv.domain';
import { Itemarchiv,  } from './itemarchiv.entity';




@Injectable()
export class ItemService {



  public async createOrUpdate(connection: Connection, itemDomain: UpdateItemDomain): Promise<ItemRep> {
    try {
      const repository: Repository<Item> = await connection.getRepository(Item);

      let item;

      if (itemDomain.id != null) {
        item = await repository.findOne(itemDomain.id);
        item = {
          ...item,
          ...itemDomain
        }

      } else {
        item = {
          ...itemDomain
        }
      }

      return await repository.save(item);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving item'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async Archive(connection: Connection, itemArchivDomain: UpdateItemarchivDomain): Promise<ItemarchivRep> {
    try {
      const repository: Repository<Itemarchiv> = await connection.getRepository(Itemarchiv);

      let item;

      if (itemArchivDomain.id != null) {
        item = await repository.findOne(itemArchivDomain.id);
        item = {
          ...item,
          ...itemArchivDomain
        }

      } else {
        item = {
          ...itemArchivDomain
        }
      }

      return await repository.save(item);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving item'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
