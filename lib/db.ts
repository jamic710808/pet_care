import { Pool } from "pg";

declare global {
  var appointmentsPool:
    | {
        connectionString: string;
        pool: Pool;
      }
    | undefined;
}

function getConnectionString() {
  const connectionString = process.env.SUPABASE_POSTGRES_SESSION_POOL_URL;

  if (!connectionString) {
    throw new Error("Missing SUPABASE_POSTGRES_SESSION_POOL_URL");
  }

  return connectionString;
}

function getPoolConnectionString(connectionString: string) {
  const url = new URL(connectionString);

  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");

  return url.toString();
}

export function getPool() {
  const connectionString = getConnectionString();

  if (globalThis.appointmentsPool?.connectionString !== connectionString) {
    void globalThis.appointmentsPool?.pool.end();

    const pool = new Pool({
      connectionString: getPoolConnectionString(connectionString),
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
      max: 5,
      ssl: { rejectUnauthorized: false },
    });

    globalThis.appointmentsPool = {
      connectionString,
      pool,
    };
  }

  return globalThis.appointmentsPool.pool;
}
