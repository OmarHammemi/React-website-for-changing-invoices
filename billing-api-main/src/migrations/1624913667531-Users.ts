import {MigrationInterface, QueryRunner} from "typeorm";

export class Users1624913667531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(
          `CREATE TABLE users
         (
             id                               INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
             first_name                       VARCHAR(255)    NOT NULL,
             last_name                        VARCHAR(255)    NOT NULL,
             title                            INT,
             job_function                     INT             NOT NULL,
             email                            VARCHAR(255)    NOT NULL,
             username                         VARCHAR(255)    NOT NULL,
             password                         VARCHAR(255)    NOT NULL,
             tenant_owner                     BOOLEAN DEFAULT false,
             active                           BOOLEAN DEFAULT true,
             tenant_db_login                  VARCHAR(255),
             updated_at                       DATETIME,
             created_at                       DATETIME        NOT NULL,
             tenant_id                        INT,
             UNIQUE (email)
         )`,
        );

        await queryRunner.query(
          `CREATE SQL SECURITY INVOKER VIEW vw_users AS
              SELECT users.id AS id,
              users.first_name AS first_name,
              users.last_name AS last_name,
              users.title AS title,
              users.job_function AS job_function,
              users.email AS email,
              users.username AS username,
              users.password AS password,
              users.active AS active,
              users.tenant_owner AS tenant_owner,
              users.created_at AS created_at,
              users.updated_at AS updated_at
              FROM users
              WHERE (users.tenant_db_login = substring_index(user(),'@',1)); `,
        );

        await queryRunner.query(
          `CREATE TRIGGER user_tenant_set_id 
              BEFORE INSERT ON users 
              FOR EACH ROW 
              BEGIN 
                SET new.tenant_db_login = SUBSTRING_INDEX(USER(),'@',1); 
              END`,
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
