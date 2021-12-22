import {MigrationInterface, QueryRunner} from "typeorm";

export class Tenants1612176136821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(
          `CREATE TABLE tenants
         (
             id            INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
             business_name VARCHAR(255)    NOT NULL,
             db_name       VARCHAR(255)    NOT NULL,
             db_login      VARCHAR(255)    NOT NULL,
             db_password   VARCHAR(255)    NOT NULL,
             updated_at    DATETIME,
             created_at    DATETIME        NOT NULL
         )`,
        );

        await queryRunner.query(
          `CREATE SQL SECURITY INVOKER VIEW view_tenants AS
              SELECT tenants.id AS id,
              tenants.business_name AS business_name
              FROM tenants
              WHERE (tenants.db_login = substring_index(user(),'@',1)); `,
        );
        await queryRunner.query(`INSERT INTO tenants (id, business_name, db_name,
                                                  db_login, db_password, updated_at, created_at)
                             VALUES (NULL, 'billings', 'billingbase', 
                                     'bills@billings', 'pass1234', '2021-01-21 16:04:45', '2021-01-21 16:04:45');`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
