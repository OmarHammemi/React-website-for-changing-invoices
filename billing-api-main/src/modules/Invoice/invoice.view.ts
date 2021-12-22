import { Column, Connection, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Transform } from 'class-transformer';
import { DataTransformer } from '../common/transformer/data.transformer';



@ViewEntity({
  name: 'vw_invoices',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('invoice.id', 'id')
    .addSelect('invoice.invoiceno', 'invoiceno')
    .addSelect('invoice.description', 'description')
    .addSelect('invoice.taxrate', 'taxrate')
    .addSelect('invoice.issuedate', 'issuedate')
    .addSelect('invoice.duedate', 'duedate')
    .addSelect('invoice.note', 'note')
    .addSelect('invoice.taxamount', 'taxamount')
    .addSelect('invoice.subtotal', 'subtotal')
    .addSelect('invoice.total', 'total')
    .addSelect('invoice.status', 'status')
    .addSelect('invoice.updated_at', 'updated_at')
    .addSelect('invoice.updated_by', 'updated_by')
    .addSelect('invoice.created_at', 'created_at')
    .addSelect('invoice.created_by', 'created_by')
    .from(Invoice, 'invoice')
    .where('invoice.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class InvoiceView {

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
