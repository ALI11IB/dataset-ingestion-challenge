import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1700000000000 implements MigrationInterface {
  name = "AddIndexes1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_date_time" ON "readings" ("date", "time")`
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_readings_date" ON "readings" ("date")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_co" ON "readings" ("co")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_c6h6" ON "readings" ("c6h6")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_nox" ON "readings" ("nox")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_no2" ON "readings" ("no2")`
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_readings_nmhc" ON "readings" ("nmhc")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_temperature" ON "readings" ("temperature")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_readings_relative_humidity" ON "readings" ("relative_humidity")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_readings_date_time"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_date"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_co"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_c6h6"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_nox"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_no2"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_nmhc"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_temperature"`);
    await queryRunner.query(`DROP INDEX "IDX_readings_relative_humidity"`);
  }
}
