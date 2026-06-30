import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`courses_obligatoria_en\` (
    \`order\` integer NOT NULL,
    \`parent_id\` integer NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX \`courses_obligatoria_en_order_idx\` ON \`courses_obligatoria_en\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`courses_obligatoria_en_parent_id_idx\` ON \`courses_obligatoria_en\` (\`parent_id\`);`)

  await db.run(sql`CREATE TABLE \`courses_electiva_en\` (
    \`order\` integer NOT NULL,
    \`parent_id\` integer NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX \`courses_electiva_en_order_idx\` ON \`courses_electiva_en\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`courses_electiva_en_parent_id_idx\` ON \`courses_electiva_en\` (\`parent_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`courses_obligatoria_en\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`courses_electiva_en\`;`)
}
