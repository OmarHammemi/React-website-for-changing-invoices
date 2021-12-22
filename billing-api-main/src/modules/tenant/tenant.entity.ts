import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'business_name' })
  businessName: string;

  @Column({ name: 'db_login' })
  dbLogin: string;

  @Column({ name: 'db_password' })
  dbPassword: string;

  @Column({ name: 'db_name' })
  dbName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  createDates() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
