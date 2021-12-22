import { Column, Connection, PrimaryColumn, PrimaryGeneratedColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Item } from './item.entity';
import { Itemarchiv } from './itemarchiv.entity';




@ViewEntity({
  name: 'vw_itemarchiv',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('itemarchiv.id', 'id')
    .addSelect('itemarchiv.description', 'description')
    .addSelect('itemarchiv.name', 'name')
    .addSelect('itemarchiv.price', 'price')
    .addSelect('itemarchiv.idInvoice', 'idInvoice')
    .addSelect('itemarchiv.quantity', 'quantity')
    .from(Itemarchiv, 'itemarchiv')
    .where('itemarchiv.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class ItemarchivView {

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
