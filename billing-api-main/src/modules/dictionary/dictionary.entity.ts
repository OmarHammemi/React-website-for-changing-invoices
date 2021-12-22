import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'dictionaries',
})
export class Dictionary {

  @Column({ unique: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dictionary' })
  dictionary: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'short_value', nullable: false })
  shortValue: string;

  @Column({ name: 'value', nullable: false })
  value: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'icon', nullable: true })
  icon: string;

  @Column({ name: 'data', nullable: true, type: 'json' })
  data: string;

  @Column({ name: 'parent', nullable: true })
  parent: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
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
