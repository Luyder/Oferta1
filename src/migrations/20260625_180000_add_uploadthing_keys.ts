import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // UploadThing storage adapter adds a `_key` field at the top level of the
  // media collection and inside each image size group.
  await db.run(sql`ALTER TABLE \`media\` ADD \`_key\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail__key\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_card__key\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`_key\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail__key\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_card__key\`;`)
}
