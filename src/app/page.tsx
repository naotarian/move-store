import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("store_token")?.value;

  if (token) {
    // トークンがある場合はダッシュボードにリダイレクト
    redirect("/store/dashboard");
  } else {
    // トークンがない場合はログインページにリダイレクト
    redirect("/login");
  }
}
