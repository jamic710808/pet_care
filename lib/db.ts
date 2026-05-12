import { Pool } from "pg";

// NOTE: 使用標準 pg 套件連接 Neon Postgres
// 同時支援 POSTGRES_URL（Vercel 注入）與 DATABASE_URL（Neon 原生格式）

declare global {
  var pgPool: Pool | undefined;
  var pgPoolConnectionString: string | undefined;
}

function getPool(): Pool {
  // NOTE: 同時支援兩種連線字串格式，POSTGRES_URL 優先
  const connectionString =
    process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing POSTGRES_URL 或 DATABASE_URL — 請確認 .env 檔案已正確設定資料庫連線字串。"
    );
  }

  // NOTE: 若連線字串有變動（如 HMR 重載 .env），重建 Pool
  if (!globalThis.pgPool || globalThis.pgPoolConnectionString !== connectionString) {
    if (globalThis.pgPool) {
      globalThis.pgPool.end().catch(() => {});
    }
    globalThis.pgPoolConnectionString = connectionString;
    globalThis.pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
      max: 5,
    });
  }

  return globalThis.pgPool;
}

export async function query<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(sql, params as unknown[]);
  return result.rows;
}
