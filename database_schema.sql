-- 建立預約表
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    pet_type TEXT NOT NULL,
    service_type TEXT NOT NULL,
    note TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立管理員資料表
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初始化預設帳號 (帳號: ADMIN, 密碼: ADMIN)
-- 注意：這裡使用了一個預先計算好的 bcrypt hash
INSERT INTO public.admin_users (username, password_hash)
VALUES ('ADMIN', '$2b$10$idnderzo5mmhcHPkcEHsbuKde2lp1Wty831dcGcNQ1Z25hmebl02.') 
ON CONFLICT (username) DO NOTHING;
