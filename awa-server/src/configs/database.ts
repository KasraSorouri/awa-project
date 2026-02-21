import { Sequelize } from 'sequelize';
import { DATABASE_URL, DATABASE_NAME } from './config';
import { Umzug, SequelizeStorage, MigrationParams } from 'umzug';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sequelize : Sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
});

const checkDatabaseExists = async() => {

  // Check the Database Exists
  try {
    sequelize.authenticate();
    const [result] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = ${DATABASE_NAME}`
    )
    if (result.length === 0) {
      console.log(`Database not found. Creating ${DATABASE_NAME} ...`)
      await sequelize.query(`CREATE DATABASE ${DATABASE_NAME}`)
      console.log(`Databse "${DATABASE_NAME}" created.`)
    }
  } catch (error) {
    console.error('Creating Database Error:', error)
  }
}


const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage ({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  try {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();
    console.log('Migrations up to date', {
      files: migrations.map((mig) => mig.name),
    });
  } catch (error) {
    console.error('Migration failed!');
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

const rollbackMigration = async () => {
  await connectToDatabase()
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    checkDatabaseExists()
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