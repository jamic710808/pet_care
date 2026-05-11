-- 建立預約表 (如果尚未建立)
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

-- 如果表已存在但缺少 status 欄位，可以使用以下命令：
-- ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
