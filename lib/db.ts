import { neon } from "@neondatabase/serverless";

// NOTE: Neon serverless driver — 使用 .query() 方法支援動態 SQL 字串與參數陣列
// 環境變數 POSTGRES_URL 由 Vercel 在連接 Neon Postgres 資料庫後自動注入
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

// NOTE: 使用 Neon 官方的 .query() 方法，與原有 pg 的 query(sql, params) 介面相容
// 回傳型別定義為 any[] 再由外層強制轉型，避免 Neon 泛型型別限制問題
export async function query<T = Record<string, unknown>>(
  sqlStr: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getSql();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await sql.query(sqlStr, params as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any).rows as T[];
}
