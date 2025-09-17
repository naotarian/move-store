import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/store/verify`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.success;
  } catch (error) {
    return false;
  }
}

export async function requireAuth(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("store_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const isAuthenticated = await verifyToken(token);

  if (!isAuthenticated) {
    redirect("/login");
  }

  return token;
}
