import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: 'localhost',
  username: 'bills@billing',
  password: process.env.TYPEORM_PASSWORD,
  database: 'billingbase',
  // tslint:disable-next-line:radix
  port: parseInt('3306'),
  logging: true,
  entities: [__dirname + '/../../**/**.entity{.ts,.js}'],
  migrationsRun: true,
  migrations: [
    'src/migrations/*{.ts}',
  ],
  synchronize: true,
}));
