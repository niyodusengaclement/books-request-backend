import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_URL_DEV;
const options = {
  connectionString: process.env.DB_URL_PROD,
  ssl: {
    rejectUnauthorized: false,
  },
}
const pool = new Pool(process.env.NODE_ENV === 'production' ? options : { connectionString });
export default {
  query(text, params) {
    try {
      return pool.query(text, params);
    } catch (err) {
      return err;
    }
  },
};