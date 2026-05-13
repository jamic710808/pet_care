ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS customer_email TEXT;

UPDATE public.appointments
SET customer_email = ''
WHERE customer_email IS NULL;

ALTER TABLE public.appointments
ALTER COLUMN customer_email SET NOT NULL;

ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;

ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS confirmation_email_error TEXT;
