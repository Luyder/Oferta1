import * as migration_20260624_224957_initial from './20260624_224957_initial';
import * as migration_20260625_145733_add_subprogram from './20260625_145733_add_subprogram';
import * as migration_20260625_180000_add_uploadthing_keys from './20260625_180000_add_uploadthing_keys';
import * as migration_20260625_200912_add_categories from './20260625_200912_add_categories';
import * as migration_20260630_120000_add_program_split from './20260630_120000_add_program_split';
import * as migration_20260630_160000_fix_program_tables from './20260630_160000_fix_program_tables';
import * as migration_20260630_170000_fix_program_tables_v2 from './20260630_170000_fix_program_tables_v2';

export const migrations = [
  {
    up: migration_20260624_224957_initial.up,
    down: migration_20260624_224957_initial.down,
    name: '20260624_224957_initial',
  },
  {
    up: migration_20260625_145733_add_subprogram.up,
    down: migration_20260625_145733_add_subprogram.down,
    name: '20260625_145733_add_subprogram',
  },
  {
    up: migration_20260625_180000_add_uploadthing_keys.up,
    down: migration_20260625_180000_add_uploadthing_keys.down,
    name: '20260625_180000_add_uploadthing_keys',
  },
  {
    up: migration_20260625_200912_add_categories.up,
    down: migration_20260625_200912_add_categories.down,
    name: '20260625_200912_add_categories'
  },
  {
    up: migration_20260630_120000_add_program_split.up,
    down: migration_20260630_120000_add_program_split.down,
    name: '20260630_120000_add_program_split',
  },
  {
    up: migration_20260630_160000_fix_program_tables.up,
    down: migration_20260630_160000_fix_program_tables.down,
    name: '20260630_160000_fix_program_tables',
  },
  {
    up: migration_20260630_170000_fix_program_tables_v2.up,
    down: migration_20260630_170000_fix_program_tables_v2.down,
    name: '20260630_170000_fix_program_tables_v2',
  },
];
