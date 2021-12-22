import {MigrationInterface, QueryRunner} from "typeorm";

export class createInvoice1625573899666 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`CREATE TABLE invoice (
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
      `CREATE TABLE IF NOT EXISTS item (
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
      `CREATE SQL SECURITY INVOKER VIEW vw_invoices AS
              SELECT invoice.id AS id,
              invoice.invoiceno AS invoiceno,
              invoice.description AS description,
              invoice.taxrate AS taxrate,
              invoice.issuedate AS issuedate,
              invoice.duedate AS duedate,
              invoice.note AS note,
              invoice.taxamount AS taxamount,
              invoice.subtotal AS subtotal,
              invoice.total AS total,
              invoice.status As status,
              invoice.updated_at AS updated_at,
              invoice.updated_by AS updated_by,
              invoice.created_at AS created_at,
              invoice.created_by AS created_by
              FROM invoice
              WHERE (invoice.tenant_db_login = substring_index(user(),'@',1)); `,
    );
    await queryRunner.query(
      `CREATE SQL SECURITY INVOKER VIEW vw_item AS
              SELECT item.id AS id,
              item.description AS description,
              item.name AS name,
              item.price AS price,
              item.quantity AS quantity,
              item.idInvoice AS idInvoice
              FROM item
              WHERE (item.tenant_db_login = substring_index(user(),'@',1)); `,
    );
    await queryRunner.query(
      `CREATE TRIGGER item_tenant_set_id
              BEFORE INSERT ON item
              FOR EACH ROW
              BEGIN
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1);
              END`,
    );
    await queryRunner.query(
      `CREATE TRIGGER invoice_tenant_set_id
              BEFORE INSERT ON invoice
              FOR EACH ROW
              BEGIN
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1);
              END`,
    );
  }


  public async down(queryRunner: QueryRunner): Promise<void> {


  }
}
