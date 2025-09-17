"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "メールアドレスとパスワードを入力してください",
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/store/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (result.success) {
      // トークンをクッキーに保存
      const cookieStore = await cookies();
      cookieStore.set("store_token", result.token, {
        path: "/",
        maxAge: 86400, // 24時間
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: result.message || "ログインに失敗しました",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "ログイン中にエラーが発生しました",
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("store_token")?.value;

    if (token) {
      // APIにログアウトリクエストを送信
      await fetch(`${process.env.API_BASE_URL}/api/store/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // クッキーを削除
    cookieStore.delete("store_token");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "ログアウト中にエラーが発生しました",
    };
  }
}

export async function getStoreInfo() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("store_token")?.value;

    if (!token) {
      return {
        success: false,
        store: null,
      };
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/store/verify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        success: data.success,
        store: data.store || null,
      };
    }

    return {
      success: false,
      store: null,
    };
  } catch (error) {
    console.error("Failed to fetch store info:", error);
    return {
      success: false,
      store: null,
    };
  }
}
