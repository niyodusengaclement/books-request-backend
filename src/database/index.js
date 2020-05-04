import { Pool } from 'pg';
import dotenv from 'dotenv';
import { booksTable, createCommand, pastorsTable, churchesTable, usersTable, languagesTable } from './queries';

dotenv.config();

const connectionString = process.env.NODE_ENV === 'production' ? process.env.DB_URL_PROD : process.env.DB_URL_DEV;
const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('Database connected');
});

const createLanguagesTable = async () => {
  try {
    await pool.query(languagesTable);
  } catch (err) {
    console.log(err);
  }
};

const createBooksTable = async () => {
  try {
    await pool.query(booksTable);
  } catch (err) {
    console.log(err);
  }
};
const createCommandTable = async () => {
  try {
    await pool.query(createCommand);
  } catch (err) {
    console.log(err);
  }
};
const createChurchesTable = async () => {
  try {
    await pool.query(churchesTable);
  } catch (err) {
    console.log(err);
  }
};

const createPastorsTable = async () => {
  try {
    await pool.query(pastorsTable);
  } catch (err) {
    console.log(err);
  }
};

const createUsersTable = async () => {
  try {
    await pool.query(usersTable);
  } catch (err) {
    console.log(err);
  }
};

pool.on('remove', () => {
  console.log('Connection terminated');
  process.exit(0);
});

module.exports = {
  createBooksTable,
  createCommandTable,
  createPastorsTable,
  createChurchesTable,
  createUsersTable,
  createLanguagesTable,
};

require('make-runnable');
