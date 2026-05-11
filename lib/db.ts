import { neon } from "@neondatabase/serverless";

// NOTE: 使用 Neon serverless driver，在 Vercel Edge 與 Node.js 環境中均可使用
// 環境變數 POSTGRES_URL 由 Vercel 在連接 Neon 資料庫後自動注入
function getSql() {
  const url = process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(
      "Missing POSTGRES_URL environment variable. " +
        "請至 Vercel Dashboard → Storage → 建立 Postgres (Neon) 資料庫並連接至此專案。"
    );
  }

  return neon(url);
}

// NOTE: 輔助函數，執行單一 SQL 查詢並回傳結果列
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const neonSql = getSql();
  const result = await neonSql(sql, params ?? []);
  return result as T[];
}
