import { Connection, PrimaryGeneratedColumn, ViewColumn, ViewEntity } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { Transform } from 'class-transformer';
import { DataTransformer } from '../common/transformer/data.transformer';

@ViewEntity({
  name: 'vw_users',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('user.id', 'id')
    .addSelect('user.first_name', 'first_name')
    .addSelect('user.last_name', 'last_name')
    .addSelect('user.title', 'title')
    .addSelect('user.job_function', 'job_function')
    .addSelect('user.email', 'email')
    .addSelect('user.username', 'username')
    .addSelect('user.password', 'password')
    .addSelect('user.active', 'active')
    .addSelect('user.tenant_owner', 'tenant_owner')
    .addSelect('user.created_at', 'created_at')
    .addSelect('user.updated_at', 'updated_at')
    .from(User, 'user')
    .where('user.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class UserView {

  @ViewColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @ViewColumn()
  email: string;

  @ViewColumn()
  username: string;

  @ViewColumn({ name: 'password' })
  password: string;

  @ViewColumn({ name: 'first_name' })
  firstName: string;

  @ViewColumn({ name: 'last_name' })
  lastName: string;

  @ViewColumn()
  title: number; // civilité

  @ViewColumn({ name: 'job_function' })
  jobFunction: number;

  @ViewColumn({ name: 'tenant_owner' })
  @Transform(DataTransformer.intToBoolean)
  tenantOwner: boolean;

  @ViewColumn({ name: 'active' })
  @Transform(DataTransformer.intToBoolean)
  active: boolean;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  public async checkPassword(plainPassword: string): Promise<boolean> {
    return await argon2.verify(this.password, plainPassword);
  }
}
