import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.NODE_ENV === 'production' ? process.env.DB_URL_PROD : process.env.DB_URL_DEV;

const pool = new Pool({ connectionString });
export default {
  query(text, params) {
    try {
      return pool.query(text, params);
    } catch (err) {
      return err;
    }
  },
};