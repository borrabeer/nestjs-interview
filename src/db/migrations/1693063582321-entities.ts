import { MigrationInterface, QueryRunner } from 'typeorm';

export class Entities1693063582321 implements MigrationInterface {
  name = 'Entities1693063582321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_categories_category" ("product_id" integer NOT NULL, "category_id" integer NOT NULL, PRIMARY KEY ("product_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ec3ff94ca5f4280dc97efbe30" ON "product_categories_category" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6a3b7332ec4134998c5a176ed" ON "product_categories_category" ("category_id") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_3ec3ff94ca5f4280dc97efbe30"`);
    await queryRunner.query(`DROP INDEX "IDX_c6a3b7332ec4134998c5a176ed"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_product_categories_category" ("product_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "FK_3ec3ff94ca5f4280dc97efbe309" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c6a3b7332ec4134998c5a176ed6" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("product_id", "category_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_product_categories_category"("product_id", "category_id") SELECT "product_id", "category_id" FROM "product_categories_category"`,
    );
    await queryRunner.query(`DROP TABLE "product_categories_category"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_product_categories_category" RENAME TO "product_categories_category"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ec3ff94ca5f4280dc97efbe30" ON "product_categories_category" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6a3b7332ec4134998c5a176ed" ON "product_categories_category" ("category_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_c6a3b7332ec4134998c5a176ed"`);
    await queryRunner.query(`DROP INDEX "IDX_3ec3ff94ca5f4280dc97efbe30"`);
    await queryRunner.query(
      `ALTER TABLE "product_categories_category" RENAME TO "temporary_product_categories_category"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_categories_category" ("product_id" integer NOT NULL, "category_id" integer NOT NULL, PRIMARY KEY ("product_id", "category_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "product_categories_category"("product_id", "category_id") SELECT "product_id", "category_id" FROM "temporary_product_categories_category"`,
    );
    await queryRunner.query(
      `DROP TABLE "temporary_product_categories_category"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6a3b7332ec4134998c5a176ed" ON "product_categories_category" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ec3ff94ca5f4280dc97efbe30" ON "product_categories_category" ("product_id") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_c6a3b7332ec4134998c5a176ed"`);
    await queryRunner.query(`DROP INDEX "IDX_3ec3ff94ca5f4280dc97efbe30"`);
    await queryRunner.query(`DROP TABLE "product_categories_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
