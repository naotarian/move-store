import { requireAuth } from "@/lib/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // 認証チェック（自動的にリダイレクトされる）
  await requireAuth();

  return <>{children}</>;
}
