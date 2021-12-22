import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDictionnary1623071429138 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(
      `CREATE TABLE company
         (
             id                 INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
             name               VARCHAR(255),
             siren              VARCHAR(255),
             industry             VARCHAR(255),
             description             VARCHAR(255),
             logo_url             VARCHAR(255),
             email     VARCHAR(3000)   NOT NULL,
             updated_at        DATETIME,
             updated_by      INT,
             created_at        DATETIME,
             created_by           INT,
             tenant_db_login    VARCHAR(255)    NOT NULL
         )`,
    );

    await queryRunner.query(
      `CREATE SQL SECURITY INVOKER VIEW vw_companies AS
              SELECT company.id AS id,
              company.name AS name,
              company.siren AS siren,
              company.industry AS industry,
              company.description AS description,
              company.logo_url AS logo_url,
              company.email AS email,
              company.updated_at AS updated_at,
              company.updated_by AS updated_by,
              company.created_at AS created_at,
              company.created_by AS created_by
              FROM company
              WHERE (company.tenant_db_login = substring_index(user(),'@',1)); `,
    );

    await queryRunner.query(
      `CREATE TRIGGER company_tenant_set_id
              BEFORE INSERT ON company
              FOR EACH ROW
              BEGIN
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1);
              END`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
