import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ViewColumn, BeforeUpdate } from 'typeorm';

@Entity()
export class Company {

    @Column({ unique: true })
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name'})
    name: string;

    @Column({ unique: true })
    siren: string;

    @Column({name: 'industry'})
    industry: string;

    @Column({name: 'description'})
    description: string;

    @Column({name: 'logo_url'})
    logoUrl: string;

    @Column('text', { nullable: false })
    email: string;

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
