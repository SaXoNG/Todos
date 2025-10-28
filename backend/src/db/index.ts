import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

interface DBConfig {
  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASS: string;
  DB_PORT: number;
}

function getDBConfig(): DBConfig {
  const { DB_USER, DB_HOST, DB_NAME, DB_PASS, DB_PORT } = process.env;

  if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASS || !DB_PORT) {
    throw new Error(
      "Missing one or more required database environment variables."
    );
  }

  const port = Number(DB_PORT);
  if (isNaN(port)) {
    throw new Error("DB_PORT must be a valid number.");
  }

  return {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASS,
    DB_PORT: port,
  };
}

const config = getDBConfig();

export const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASS,
  port: config.DB_PORT,
});
