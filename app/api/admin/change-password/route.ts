import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "未授權存取" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "請輸入目前密碼與新密碼。" },
        { status: 400 }
      );
    }

    // 1. 驗證目前密碼
    const users = await query<{ password_hash: string }>(
      "SELECT password_hash FROM public.admin_users WHERE username = $1",
      [session.username]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "用戶不存在" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: "目前密碼輸入錯誤。" }, { status: 400 });
    }

    // 2. 加密新密碼並更新
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query(
      "UPDATE public.admin_users SET password_hash = $1, updated_at = NOW() WHERE username = $2",
      [newHash, session.username]
    );

    return NextResponse.json({ message: "密碼修改成功，下次登入請使用新密碼。" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "修改密碼失敗，請稍後再試。" },
      { status: 500 }
    );
  }
}
