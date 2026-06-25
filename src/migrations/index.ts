import * as migration_20260624_224957_initial from './20260624_224957_initial';
import * as migration_20260625_145733_add_subprogram from './20260625_145733_add_subprogram';
import * as migration_20260625_180000_add_uploadthing_keys from './20260625_180000_add_uploadthing_keys';

export const migrations = [
  {
    up: migration_20260624_224957_initial.up,
    down: migration_20260624_224957_initial.down,
    name: '20260624_224957_initial',
  },
  {
    up: migration_20260625_145733_add_subprogram.up,
    down: migration_20260625_145733_add_subprogram.down,
    name: '20260625_145733_add_subprogram'
  },
  {
    up: migration_20260625_180000_add_uploadthing_keys.up,
    down: migration_20260625_180000_add_uploadthing_keys.down,
    name: '20260625_180000_add_uploadthing_keys'
  },
];
