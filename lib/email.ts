import { Resend } from "resend";

type AppointmentEmail = {
  customerName: string;
  customerEmail: string;
  arrivalTime: string;
  petType: string;
  serviceType: string;
};

type EmailResult = {
  skipped: boolean;
};

export async function sendAppointmentConfirmationEmail({
  customerName,
  customerEmail,
  arrivalTime,
  petType,
  serviceType,
}: AppointmentEmail): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPOINTMENT_EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(
      "Appointment email skipped: RESEND_API_KEY or APPOINTMENT_EMAIL_FROM is not configured.",
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const formattedArrivalTime = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Taipei",
  }).format(new Date(arrivalTime));

  const html = `
    <div style="font-family: Arial, 'Noto Sans TC', sans-serif; line-height: 1.7; color: #1f2937;">
      <h2 style="color: #0f766e;">泡泡爪 Pet Spa 預約確認通知</h2>
      <p>${customerName} 您好，</p>
      <p>您的預約已確認，以下是預約資訊：</p>
      <ul>
        <li><strong>到店時間：</strong>${formattedArrivalTime}</li>
        <li><strong>寵物類型：</strong>${petType}</li>
        <li><strong>服務項目：</strong>${serviceType}</li>
      </ul>
      <p>如需調整時間，請直接與門店聯繫。</p>
      <p>泡泡爪 Pet Spa</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: customerEmail,
    subject: "泡泡爪 Pet Spa 預約確認通知",
    html,
    text: [
      `${customerName} 您好，`,
      "",
      "您的預約已確認，以下是預約資訊：",
      `到店時間：${formattedArrivalTime}`,
      `寵物類型：${petType}`,
      `服務項目：${serviceType}`,
      "",
      "如需調整時間，請直接與門店聯繫。",
      "泡泡爪 Pet Spa",
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Failed to send appointment email: ${error.message}`);
  }

  return { skipped: false };
}
