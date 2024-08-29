const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    sslmode: 'require',
  },
});

const sessionConnection = session({
  store: new pgSession({
    pool: pool,
    tableName: 'sessions',
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5 * 60 * 1000 },
});

module.exports = { pool, sessionConnection };
