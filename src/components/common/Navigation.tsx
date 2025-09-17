"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

interface MenuItem {
  title: string;
  href: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "ダッシュボード",
    href: "/store/dashboard",
  },
  {
    title: "見積もり管理",
    href: "/store/estimates",
    children: [
      {
        title: "見積もり一覧",
        href: "/store/estimates",
      },
      {
        title: "見積もり作成",
        href: "/store/estimate/create",
      },
    ],
  },
  {
    title: "顧客管理",
    href: "/store/customers",
    children: [
      {
        title: "顧客一覧",
        href: "/store/customers",
      },
      {
        title: "新規顧客登録",
        href: "/store/customers/create",
      },
    ],
  },
  {
    title: "売上管理",
    href: "/store/sales",
    children: [
      {
        title: "売上一覧",
        href: "/store/sales",
      },
      {
        title: "売上レポート",
        href: "/store/sales/reports",
      },
    ],
  },
  {
    title: "スケジュール",
    href: "/store/schedule",
    children: [
      {
        title: "スケジュール一覧",
        href: "/store/schedule",
      },
      {
        title: "カレンダー",
        href: "/store/schedule/calendar",
      },
    ],
  },
  {
    title: "メッセージ",
    href: "/store/messages",
  },
  {
    title: "設定",
    href: "/store/settings",
    children: [
      {
        title: "店舗設定",
        href: "/store/settings",
      },
      {
        title: "アカウント設定",
        href: "/store/settings/account",
      },
    ],
  },
];

const Navigation = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isActive = (href: string) => {
    if (href === "/store/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleExpandedItem = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedItems(new Set());
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* デスクトップメニュー */}
        <div className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-[#003672] border-b-2 border-[#003672]"
                    : "text-gray-700 hover:text-[#003672]"
                }`}
              >
                {item.title}
                {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
              </Link>

              {/* ドロップダウンメニュー */}
              {item.children && hoveredItem === item.href && (
                <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive(child.href)
                            ? "text-[#003672] bg-gray-50"
                            : "text-gray-700 hover:text-[#003672] hover:bg-gray-50"
                        }`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* モバイルメニュー */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-4">
            <div className="text-sm font-medium text-gray-700">メニュー</div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-[#003672] hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* モバイルメニューコンテンツ */}
          {isMobileMenuOpen && (
            <div className="pb-4 border-t border-gray-200">
              <div className="pt-4 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.href}>
                    {item.children ? (
                      // サブメニューがある場合は、全体をクリック可能にする
                      <div>
                        <button
                          onClick={() => toggleExpandedItem(item.href)}
                          className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium transition-colors duration-200 rounded-md ${
                            isActive(item.href)
                              ? "text-[#003672] bg-gray-50"
                              : "text-gray-700 hover:text-[#003672] hover:bg-gray-50"
                          }`}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${
                              expandedItems.has(item.href) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      // サブメニューがない場合は、通常のリンク
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`block px-3 py-3 text-sm font-medium transition-colors duration-200 rounded-md ${
                          isActive(item.href)
                            ? "text-[#003672] bg-gray-50"
                            : "text-gray-700 hover:text-[#003672] hover:bg-gray-50"
                        }`}
                      >
                        {item.title}
                      </Link>
                    )}
                    {item.children && expandedItems.has(item.href) && (
                      <div className="ml-4 space-y-1 mt-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMobileMenu}
                            className={`block px-3 py-3 text-sm transition-colors duration-200 rounded-md ${
                              isActive(child.href)
                                ? "text-[#003672] bg-gray-50"
                                : "text-gray-600 hover:text-[#003672] hover:bg-gray-50"
                            }`}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
