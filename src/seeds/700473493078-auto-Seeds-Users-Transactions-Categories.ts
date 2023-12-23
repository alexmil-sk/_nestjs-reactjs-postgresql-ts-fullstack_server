import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1700473493078 implements MigrationInterface {
  name = 'Auto1700473493078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users ("username", "email", "password") VALUES ('user-1', 'user-1@test.com', '$argon2id$v=19$m=65536,t=3,p=4$2GrZkkfgMTGXDgk3CaisdA$6QPy+WZE9LgOpenaGyv1VNCSowo5gfonxR344kDbXOE'), ('user-2', 'user-2@test.com', '$argon2id$v=19$m=65536,t=3,p=4$2GrZkkfgMTGXDgk3CaisdA$6QPy+WZE9LgOpenaGyv1VNCSowo5gfonxR344kDbXOE'), ('user-3', 'user-3@test.com', '$argon2id$v=19$m=65536,t=3,p=4$2GrZkkfgMTGXDgk3CaisdA$6QPy+WZE9LgOpenaGyv1VNCSowo5gfonxR344kDbXOE')`,
    );
    await queryRunner.query(
      `INSERT INTO categories ("category_id", "title", "user_id") VALUES (1, 'Home', 1), (2, 'University', 1), (3, 'Job', 2), (4, 'Vocation', 2), (5, 'Kindergarden', 3), (6, 'Theater', 3)`,
    );
    // await queryRunner.query(
    //   `INSERT INTO transactions ("transaction_id", "title", "amount", "type", "user_id", "category_id") VALUES (1, 'TransAct-1', '2000', 'expence', 1, 1), (2, 'TransAct-2', '2500', 'expence', 1, 2), (3, 'TransAct-3', '1500', 'income', 2, 3), (4, 'TransAct-4', '500', 'income', 2, 4), (5, 'TransAct-5', '5500', 'expence', 3, 5), (6, 'TransAct-6', '10500', 'income', 3, 6)`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    // );
  }
  public async down(): Promise<void> {}
}
