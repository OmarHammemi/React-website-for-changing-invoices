import { Column, Connection, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Company } from './company.entity';

@ViewEntity({
  name: 'vw_companies',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('company.id', 'id')
    .addSelect('company.name', 'name')
    .addSelect('company.siren', 'siren')
    .addSelect('company.industry', 'industry')
    .addSelect('company.description', 'description')
    .addSelect('company.logo_url', 'logo_url')
    .addSelect('company.email', 'email')
    .addSelect('company.updated_at', 'updated_at')
    .addSelect('company.updated_by', 'updated_by')
    .addSelect('company.created_at', 'created_at')
    .addSelect('company.created_by', 'created_by')
    .from(Company, 'company')
    .where('company.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class CompanyView {

  @ViewColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @ViewColumn({ name: 'name' })
  name: string;

  @ViewColumn({ name: 'siren' })
  siren: string;

  @ViewColumn({ name: 'industry' })
  industry: string;

  @ViewColumn({ name: 'description' })
  description: string;

  @ViewColumn({ name: 'logo_url' })
  logoUrl: string;

  @ViewColumn({ name: 'email' })
  email: string;


  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'updated_by' })
  updatedBy: number;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'created_by' })
  createdBy: number;

}
