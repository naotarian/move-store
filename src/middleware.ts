import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ログインページは認証チェックをスキップ
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ダッシュボード関連のページで認証チェック
  if (pathname.startsWith("/store/")) {
    const token = request.cookies.get("store_token")?.value;

    if (!token) {
      // トークンがない場合はログインページにリダイレクト
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // トークンがある場合はAPIで検証
    // 注意: ミドルウェアでは非同期処理が制限されるため、
    // 実際のトークン検証はページコンポーネントで行う
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
