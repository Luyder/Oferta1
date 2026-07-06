import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Convierte el campo `professor` de relación única a relación múltiple (hasMany).
// Los profesores pasan de la columna `courses.professor_id` a filas en
// `courses_rels` con path='professor'.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Nueva columna en la tabla de relaciones + índice.
  await db.run(sql`ALTER TABLE \`courses_rels\` ADD \`professors_id\` integer REFERENCES professors(id);`)
  await db.run(sql`CREATE INDEX \`courses_rels_professors_id_idx\` ON \`courses_rels\` (\`professors_id\`);`)

  // 2. Copiar el profesor actual de cada curso a courses_rels.
  await db.run(sql`INSERT INTO \`courses_rels\` (\`order\`, \`parent_id\`, \`path\`, \`professors_id\`)
    SELECT 1, \`id\`, 'professor', \`professor_id\` FROM \`courses\` WHERE \`professor_id\` IS NOT NULL;`)

  // 3. Reconstruir la tabla courses sin la columna professor_id (y su FK).
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_courses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`title_normalized\` text,
  	\`title_line2\` text,
  	\`category\` text NOT NULL,
  	\`program_type\` text NOT NULL,
  	\`code\` text,
  	\`credits\` numeric,
  	\`weeks\` numeric DEFAULT 16,
  	\`nrc\` text,
  	\`modality\` text DEFAULT 'PRESENCIAL',
  	\`description\` text,
  	\`prerequisites\` text,
  	\`corequisites\` text,
  	\`observations\` text,
  	\`image_id\` integer,
  	\`active\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`sub_program\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`INSERT INTO \`__new_courses\` (\`id\`, \`title\`, \`title_normalized\`, \`title_line2\`, \`category\`, \`program_type\`, \`code\`, \`credits\`, \`weeks\`, \`nrc\`, \`modality\`, \`description\`, \`prerequisites\`, \`corequisites\`, \`observations\`, \`image_id\`, \`active\`, \`order\`, \`updated_at\`, \`created_at\`, \`sub_program\`)
    SELECT \`id\`, \`title\`, \`title_normalized\`, \`title_line2\`, \`category\`, \`program_type\`, \`code\`, \`credits\`, \`weeks\`, \`nrc\`, \`modality\`, \`description\`, \`prerequisites\`, \`corequisites\`, \`observations\`, \`image_id\`, \`active\`, \`order\`, \`updated_at\`, \`created_at\`, \`sub_program\` FROM \`courses\`;`)
  await db.run(sql`DROP TABLE \`courses\`;`)
  await db.run(sql`ALTER TABLE \`__new_courses\` RENAME TO \`courses\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`courses_image_idx\` ON \`courses\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`courses_updated_at_idx\` ON \`courses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`courses_created_at_idx\` ON \`courses\` (\`created_at\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restaurar professor_id con el primer profesor de cada curso.
  await db.run(sql`ALTER TABLE \`courses\` ADD \`professor_id\` integer REFERENCES professors(id);`)
  await db.run(sql`UPDATE \`courses\` SET \`professor_id\` = (
    SELECT \`professors_id\` FROM \`courses_rels\`
    WHERE \`courses_rels\`.\`parent_id\` = \`courses\`.\`id\` AND \`courses_rels\`.\`path\` = 'professor'
    ORDER BY \`courses_rels\`.\`order\` LIMIT 1
  );`)
  await db.run(sql`DELETE FROM \`courses_rels\` WHERE \`path\` = 'professor';`)
}
