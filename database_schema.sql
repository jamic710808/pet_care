-- 建立預約表（如果尚未建立）
-- 請在 Vercel Dashboard → Storage → 您的 Neon 資料庫 → Query 介面中執行此腳本
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    pet_type TEXT NOT NULL,
    service_type TEXT NOT NULL,
    note TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'pending', -- 狀態: pending, confirmed, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 如果資料表已存在但缺少 status 欄位，可執行：
-- ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
