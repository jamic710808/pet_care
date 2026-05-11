import { Pool } from "pg";

// NOTE: 使用標準 pg 套件連接 Neon Postgres
// POSTGRES_URL 由 Vercel 連接 Neon Storage 後自動注入
// 本地開發需從 Vercel Dashboard → Settings → Environment Variables 複製此值到 .env

declare global {
  var pgPool: Pool | undefined;
}

function getPool(): Pool {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing POSTGRES_URL — 請至 Vercel Dashboard → Storage → 建立 Neon 資料庫並連接到此專案，" +
        "或將 POSTGRES_URL 複製到本地 .env 檔案。"
    );
  }

  // NOTE: 使用 globalThis 快取 Pool 避免在 Next.js HMR 時重複建立連線
  if (!globalThis.pgPool) {
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
