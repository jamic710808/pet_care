import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "請輸入帳號與密碼。" },
        { status: 400 }
      );
    }

    // 查詢管理員資料
    const users = await query<{ username: string; password_hash: string }>(
      "SELECT username, password_hash FROM public.admin_users WHERE username = $1",
      [username.toUpperCase()] // 帳號不分大小寫，統一轉大寫比對
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "帳號或密碼錯誤。" },
        { status: 401 }
      );
    }

    const user = users[0];

    // 驗證密碼
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "帳號或密碼錯誤。" },
        { status: 401 }
      );
    }

    // 建立 Session
    await login(user.username);

    return NextResponse.json({ message: "登入成功" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "伺服器錯誤，請稍後再試。" },
      { status: 500 }
    );
  }
}
