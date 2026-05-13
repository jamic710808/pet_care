import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

type BookingPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  arrivalTime?: unknown;
  pet?: unknown;
  service?: unknown;
  note?: unknown;
};

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: BookingPayload;

  try {
    body = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ message: "預約資料格式不正確" }, { status: 400 });
  }

  const customerName = normalizeText(body.name, 80);
  const phone = normalizeText(body.phone, 30);
  const customerEmail = normalizeText(body.email, 254).toLowerCase();
  const petType = normalizeText(body.pet, 40);
  const serviceType = normalizeText(body.service, 40);
  const note = normalizeText(body.note, 500);
  const arrivalTimeValue =
    typeof body.arrivalTime === "string" ? body.arrivalTime : "";
  const arrivalTime = new Date(arrivalTimeValue);

  if (
    !customerName ||
    !phone ||
    !customerEmail ||
    !petType ||
    !serviceType ||
    !arrivalTimeValue ||
    Number.isNaN(arrivalTime.getTime())
  ) {
    return NextResponse.json({ message: "請完整填寫預約資訊" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ message: "請填寫有效的 Email" }, { status: 400 });
  }

  try {
    const rows = await query<{ id: string }>(
      `INSERT INTO public.appointments
        (customer_name, phone, customer_email, arrival_time, pet_type, service_type, note, source)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, 'website')
       RETURNING id`,
      [
        customerName,
        phone,
        customerEmail,
        arrivalTime.toISOString(),
        petType,
        serviceType,
        note || null,
      ],
    );

    return NextResponse.json(
      { id: rows[0]?.id, message: "預約資料已送出" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create appointment", error);
    return NextResponse.json(
      { message: "預約送出失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
