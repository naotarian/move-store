import Link from "next/link";
import { getStoreInfo } from "@/lib/actions/auth";
import { LogoutButton } from "@/components/LogoutButton";

interface StoreInfo {
  id: string;
  name: string;
  email: string;
}

const Header = async () => {
  const storeInfoResult = await getStoreInfo();
  const storeInfo = storeInfoResult.store as StoreInfo | null;
  const isLoggedIn = storeInfoResult.success && storeInfo;

  return (
    <header className="bg-[#003672] text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Moving Auction</h1>
          {isLoggedIn && (
            <span className="ml-4 text-md font-bold">{storeInfo.name} 様</span>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="bg-white text-[#003672] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
