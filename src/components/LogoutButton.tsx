"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-sm transform hover:translate-y-0.5 transition-all duration-200 ease-in-out border border-red-400 hover:from-red-600 hover:to-red-700 active:translate-y-1 active:shadow-none"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-md blur opacity-30 group-hover:opacity-50 transition-opacity duration-200"></div>
      <LogOut className="h-4 w-4 mr-2 relative z-10" />
      <span className="relative z-10">ログアウト</span>
    </Button>
  );
}
