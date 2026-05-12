import { NextRequest, NextResponse } from "next/server";
import { decrypt, TOKEN_NAME } from "@/lib/auth";

// 不需要認證的路徑
const PUBLIC_PATHS = ["/admin/login", "/api/auth/login", "/api/appointments"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 如果是公共路徑，直接通過
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. 如果是管理員路徑或管理員 API，檢查 Token
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(TOKEN_NAME)?.value;

    if (!token) {
      // API 請求返回 401，頁面請求跳轉至登入頁
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ message: "未經授權" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await decrypt(token);
      return NextResponse.next();
    } catch (error) {
      // Token 無效，清除並跳轉
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(TOKEN_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了：
     * - _next/static (靜態資源)
     * - _next/image (圖片優化資源)
     * - favicon.ico (圖標檔案)
     * - assets (靜態資產目錄)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
