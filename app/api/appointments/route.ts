import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

type BookingPayload = {
  name?: unknown;
  phone?: unknown;
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
    return NextResponse.json({ message: "预约信息格式不正确。" }, { status: 400 });
  }

  const customerName = normalizeText(body.name, 80);
  const phone = normalizeText(body.phone, 30);
  const petType = normalizeText(body.pet, 40);
  const serviceType = normalizeText(body.service, 40);
  const note = normalizeText(body.note, 500);
  const arrivalTimeValue =
    typeof body.arrivalTime === "string" ? body.arrivalTime : "";
  const arrivalTime = new Date(arrivalTimeValue);

  if (
    !customerName ||
    !phone ||
    !petType ||
    !serviceType ||
    !arrivalTimeValue ||
    Number.isNaN(arrivalTime.getTime())
  ) {
    return NextResponse.json({ message: "请完整填写预约信息。" }, { status: 400 });
  }

  try {
    const result = await getPool().query<{ id: string }>(
      `insert into public.appointments
        (customer_name, phone, arrival_time, pet_type, service_type, note, source)
       values
        ($1, $2, $3, $4, $5, $6, 'website')
       returning id`,
      [
        customerName,
        phone,
        arrivalTime.toISOString(),
        petType,
        serviceType,
        note || null,
      ],
    );

    return NextResponse.json(
      { id: result.rows[0]?.id, message: "预约信息已收到。" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create appointment", error);
    return NextResponse.json(
      { message: "预约提交失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
