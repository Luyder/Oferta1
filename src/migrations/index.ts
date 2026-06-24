import * as migration_20260624_224957_initial from './20260624_224957_initial';

export const migrations = [
  {
    up: migration_20260624_224957_initial.up,
    down: migration_20260624_224957_initial.down,
    name: '20260624_224957_initial'
  },
];
