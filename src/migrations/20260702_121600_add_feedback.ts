import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`feedback\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`message\` text NOT NULL,
  	\`page\` text,
  	\`contact\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`feedback_updated_at_idx\` ON \`feedback\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`feedback_created_at_idx\` ON \`feedback\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`feedback_id\` integer REFERENCES feedback(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_feedback_id_idx\` ON \`payload_locked_documents_rels\` (\`feedback_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`feedback\`;`)
}
