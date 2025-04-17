import { Pool } from 'pg';

export const pool = new Pool({
  user: 'ambikamishra',           //  actual Postgres user
  host: 'localhost',
  database: 'wiulyfe', // actual Postgres DB name
  password: '',      //  actual DB password (or empty string if none)
  port: 5432,
});
