import { Column, Connection, PrimaryColumn, PrimaryGeneratedColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Item } from './item.entity';




@ViewEntity({
  name: 'vw_item',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('item.id', 'id')
    .addSelect('item.description', 'description')
    .addSelect('item.name', 'name')
    .addSelect('item.price', 'price')
    .addSelect('item.idInvoice', 'idInvoice')
    .addSelect('item.quantity', 'quantity')
    .from(Item, 'item')
    .where('invoice.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class ItemView {

  @ViewColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @ViewColumn({ name: 'description' })
  description: string;

  @ViewColumn({ name: 'name' })
  name: string;

  @ViewColumn({ name: 'quantity' })
  quantity: number;

  @ViewColumn({ name: 'price' })
  price: number;

  @ViewColumn({ name: 'idInvoice' })
  idInvoice: number;

}
