import { Column, Connection, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Invoicearchiv } from './invoicearchiv.entity';
import { Transform } from 'class-transformer';
import { DataTransformer } from '../common/transformer/data.transformer';



@ViewEntity({
  name: 'vw_invoicesarchiv',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('invoicearchiv.id', 'id')
    .addSelect('invoicearchiv.invoiceno', 'invoiceno')
    .addSelect('invoicearchiv.description', 'description')
    .addSelect('invoicearchiv.taxrate', 'taxrate')
    .addSelect('invoicearchiv.issuedate', 'issuedate')
    .addSelect('invoicearchiv.duedate', 'duedate')
    .addSelect('invoicearchiv.note', 'note')
    .addSelect('invoicearchiv.taxamount', 'taxamount')
    .addSelect('invoicearchiv.subtotal', 'subtotal')
    .addSelect('invoicearchiv.total', 'total')
    .addSelect('invoicearchiv.status', 'status')
    .addSelect('invoicearchiv.updated_at', 'updated_at')
    .addSelect('invoicearchiv.updated_by', 'updated_by')
    .addSelect('invoicearchiv.created_at', 'created_at')
    .addSelect('invoicearchiv.created_by', 'created_by')
    .from(Invoicearchiv, 'invoicearchiv')
    .where('invoicearchiv.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class InvoicearchivView {

  @ViewColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @ViewColumn({ name: 'invoiceno' })
  invoiceno: string;

  @ViewColumn({ name: 'description' })
  description: string;

  @ViewColumn({ name: 'taxrate' })
  taxrate: number;

  @ViewColumn({ name: 'issuedate' })
  issuedate: Date;

  @ViewColumn({ name: 'duedate' })
  duedate: Date;

  @ViewColumn({ name: 'note' })
  note: string;

  @ViewColumn({ name: 'taxamount' })
  taxamount: number;

  @ViewColumn({ name: 'subtotal' })
  subtotal: number;

  @ViewColumn({ name: 'total' })
  total: number;

  @ViewColumn({ name: 'status' })
  @Transform(DataTransformer.intToBoolean)
  status: boolean;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'updated_by' })
  updatedBy: number;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'created_by' })
  createdBy: number;


}
