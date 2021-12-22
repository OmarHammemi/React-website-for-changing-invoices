import {MigrationInterface, QueryRunner} from "typeorm";

export class MysqlUsers1612176049870 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE USER 'bills@billings' IDENTIFIED BY 'pass1234';`,
        );
        await queryRunner.query(
          `ALTER USER 'bills@billings' IDENTIFIED WITH mysql_native_password BY 'pass1234';`
        );

        await queryRunner.query(`GRANT ALL PRIVILEGES ON * . * TO 'bills@billings';`);


        await queryRunner.query(`FLUSH PRIVILEGES;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
