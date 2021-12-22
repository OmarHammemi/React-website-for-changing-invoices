import {MigrationInterface, QueryRunner} from "typeorm";

export class InvoiceArchiv1629898306358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { await queryRunner.query(`CREATE TABLE invoicearchiv (
       id                 INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        invoiceno  VARCHAR(255),
        description  VARCHAR(255),
        taxrate FLOAT(24,2) ,
        issuedate DATE ,
        duedate DATE,
        note  VARCHAR(255) ,
        taxamount FLOAT(24,2) ,
        subtotal FLOAT(24,2) ,
        total FLOAT(24,2) ,
        status boolean DEFAULT false,
         updated_at        DATETIME,
             updated_by      INT,
             created_at        DATETIME,
             created_by           INT,
             itemId VARCHAR(255),
          tenant_db_login    VARCHAR(255)    NOT NULL
        )`,
    );

      await queryRunner.query(
        `CREATE TABLE IF NOT EXISTS itemarchiv (
                id                 INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                description varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                quantity int(11) NOT NULL,
                price FLOAT(24,2) NOT NULL,
                idInvoice int(11) NOT NULL,
                tenant_db_login    VARCHAR(255)    NOT NULL
)`,
      );


      await queryRunner.query(
        `CREATE SQL SECURITY INVOKER VIEW vw_invoicesarchiv AS
              SELECT invoicearchiv.id AS id,
              invoicearchiv.invoiceno AS invoiceno,
              invoicearchiv.description AS description,
              invoicearchiv.taxrate AS taxrate,
              invoicearchiv.issuedate AS issuedate,
              invoicearchiv.duedate AS duedate,
              invoicearchiv.note AS note,
              invoicearchiv.taxamount AS taxamount,
              invoicearchiv.subtotal AS subtotal,
              invoicearchiv.total AS total,
              invoicearchiv.status As status,
              invoicearchiv.updated_at AS updated_at,
              invoicearchiv.updated_by AS updated_by,
              invoicearchiv.created_at AS created_at,
              invoicearchiv.created_by AS created_by
              FROM invoicearchiv
              WHERE (invoicearchiv.tenant_db_login = substring_index(user(),'@',1)); `,
      );
      await queryRunner.query(
        `CREATE SQL SECURITY INVOKER VIEW vw_itemarchiv AS
              SELECT itemarchiv.id AS id,
              itemarchiv.description AS description,
              itemarchiv.name AS name,
              itemarchiv.price AS price,
              itemarchiv.quantity AS quantity,
              itemarchiv.idInvoice AS idInvoice
              FROM itemarchiv
              WHERE (itemarchiv.tenant_db_login = substring_index(user(),'@',1)); `,
      );
      await queryRunner.query(
        `CREATE TRIGGER itemarchiv_tenant_set_id
              BEFORE INSERT ON itemarchiv
              FOR EACH ROW
              BEGIN
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1);
              END`,
      );
      await queryRunner.query(
        `CREATE TRIGGER invoicearchiv_tenant_set_id
              BEFORE INSERT ON invoicearchiv
              FOR EACH ROW
              BEGIN
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1);
              END`,
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
