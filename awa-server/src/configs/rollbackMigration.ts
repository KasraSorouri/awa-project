import { rollbackMigration } from './database';

rollbackMigration()
  .catch((error) => {
    if (error instanceof Error) {
      console.log('Failed to rollback migration', error.message);
    } else {
      console.log('Failed to rollback migration', String(error));
    }
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });