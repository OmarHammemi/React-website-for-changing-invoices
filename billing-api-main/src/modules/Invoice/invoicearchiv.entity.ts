import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ChildEntity,
  BeforeInsert, BeforeUpdate, OneToMany,
} from 'typeorm';
import { Item } from '../item/item.entity';



@Entity()
export class Invoicearchiv {

  @Column({ unique: true })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'invoiceno' })
  invoiceno: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'taxrate' })
  taxrate: number;

  @Column({ name: 'issuedate' })
  issuedate: Date;

  @Column({ name: 'duedate' })
  duedate: Date;

  @Column({ name: 'note' })
  note: string;

  @Column({ name: 'taxamount' })
  taxamount: number;

  @Column({ name: 'subtotal' })
  subtotal: number;

  @Column({ name: 'total' })
  total: number;

  @Column()
  itemId: number;

  @Column({ name: 'status', nullable: true, default: false  })
  status: boolean;





  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: number;

  @BeforeInsert()
  createDates() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
