import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendAppointmentConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

type AppointmentRow = {
  customer_name: string;
  customer_email: string;
  arrival_time: string;
  pet_type: string;
  service_type: string;
  confirmation_email_sent_at: string | null;
};

const allowedStatuses = new Set(["pending", "confirmed", "completed", "cancelled"]);

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, customer_name, phone, customer_email, arrival_time, pet_type,
              service_type, note, status, confirmation_email_sent_at,
              confirmation_email_error, created_at
       FROM public.appointments
       ORDER BY arrival_time DESC`,
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch appointments", error);
    return NextResponse.json(
      { message: "無法取得預約資料" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = (await request.json()) as {
      id?: unknown;
      status?: unknown;
    };

    if (typeof id !== "string" || typeof status !== "string") {
      return NextResponse.json({ message: "缺少必要欄位" }, { status: 400 });
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ message: "預約狀態不正確" }, { status: 400 });
    }

    const rows = await query<AppointmentRow>(
      `UPDATE public.appointments
       SET status = $1
       WHERE id = $2
       RETURNING customer_name, customer_email, arrival_time, pet_type,
                 service_type, confirmation_email_sent_at`,
      [status, id],
    );

    const appointment = rows[0];

    if (!appointment) {
      return NextResponse.json({ message: "找不到預約資料" }, { status: 404 });
    }

    if (
      status === "confirmed" &&
      appointment.customer_email &&
      !appointment.confirmation_email_sent_at
    ) {
      try {
        const emailResult = await sendAppointmentConfirmationEmail({
          customerName: appointment.customer_name,
          customerEmail: appointment.customer_email,
          arrivalTime: appointment.arrival_time,
          petType: appointment.pet_type,
          serviceType: appointment.service_type,
        });

        if (!emailResult.skipped) {
          await query(
            `UPDATE public.appointments
             SET confirmation_email_sent_at = NOW(),
                 confirmation_email_error = NULL
             WHERE id = $1`,
            [id],
          );
        }
      } catch (emailError) {
        const message =
          emailError instanceof Error ? emailError.message : "Unknown email error";
        console.error("Failed to send appointment confirmation email", emailError);
        await query(
          `UPDATE public.appointments
           SET confirmation_email_error = $1
           WHERE id = $2`,
          [message.slice(0, 500), id],
        );
      }
    }

    return NextResponse.json({ message: "預約狀態已更新" });
  } catch (error) {
    console.error("Failed to update appointment", error);
    return NextResponse.json(
      { message: "更新預約狀態失敗" },
      { status: 500 },
    );
  }
}
