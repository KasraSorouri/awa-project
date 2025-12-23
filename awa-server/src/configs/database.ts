import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config';
import { Umzug, SequelizeStorage, MigrationParams } from 'umzug';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sequelize : Sequelize = new Sequelize(DATABASE_URL, {
  logging: true,
});

const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage ({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('database connected');
  } catch (err) {
    console.log('connecting database failed');
    return process.exit(1);
  }
  return null;
};

export { connectToDatabase, sequelize, rollbackMigration };