import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'title', nullable: true })
  title: number; // civilité

  @Column({ name: 'job_function', default: 1 })
  jobFunction: number;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'tenant_owner', nullable: true, default: false })
  tenantOwner: boolean;

  @Column({ name: 'tenant_db_login', nullable: true, readonly: true })
  tenantDbLogin: string;

  @Column({ name: 'active', nullable: true, default: true })
  active: boolean;

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
