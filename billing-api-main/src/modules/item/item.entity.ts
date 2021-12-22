import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ChildEntity,
  BeforeInsert, BeforeUpdate,
} from 'typeorm';
import { Invoice } from '../Invoice/invoice.entity';



@Entity()
export class Item {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  idInvoice: number;

  //@ManyToOne(() => Invoice, invoice => invoice.items)
  //invoice: Invoice;

}
