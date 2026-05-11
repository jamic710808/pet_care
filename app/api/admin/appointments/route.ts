import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await getPool().query(
      `SELECT id, customer_name, phone, arrival_time, pet_type, service_type, note, status, created_at
       FROM public.appointments
       ORDER BY arrival_time DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch appointments", error);
    return NextResponse.json(
      { message: "無法獲取預約清單。" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "缺少必要欄位。" }, { status: 400 });
    }

    await getPool().query(
      "UPDATE public.appointments SET status = $1 WHERE id = $2",
      [status, id]
    );

    return NextResponse.json({ message: "預約狀態已更新。" });
  } catch (error) {
    console.error("Failed to update appointment", error);
    return NextResponse.json(
      { message: "更新預約狀態失敗。" },
      { status: 500 }
    );
  }
}
