import { Connection, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { Dictionary } from './dictionary.entity';

@ViewEntity({
  name: 'vw_dictionaries',
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('d.id', 'id')
    .addSelect('d.dictionary', 'dictionary')
    .addSelect('d.code', 'code')
    .addSelect('d.shortValue', 'shortValue')
    .addSelect('d.value', 'value')
    .addSelect('d.description', 'description')
    .addSelect('d.icon', 'icon')
    .addSelect('d.data', 'data')
    .addSelect('d.updated_at', 'updated_at')
    .addSelect('d.updated_by', 'updated_by')
    .addSelect('d.created_at', 'created_at')
    .addSelect('d.created_by', 'created_by')
    .from(Dictionary, 'd')
    .where('d.tenant_db_login = substring_index(user(),\'@\',1)'),
})
export class DictionaryView {

  @ViewColumn({ name: 'id' })
  @PrimaryColumn()
  id: number;

  @ViewColumn({ name: 'dictionary' })
  dictionary: string;

  @ViewColumn({ name: 'code' })
  code: string;

  @ViewColumn({ name: 'short_value' })
  shortValue: string;

  @ViewColumn({ name: 'value' })
  value: string;

  @ViewColumn({ name: 'description' })
  description: string;

  @ViewColumn({ name: 'icon' })
  icon: string;

  @ViewColumn({ name: 'data' })
  data: string;

  @ViewColumn({ name: 'parent' })
  parent: number;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'updated_by' })
  updatedBy: number;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'created_by' })
  createdBy: number;

}
