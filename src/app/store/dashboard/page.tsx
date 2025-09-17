import React from "react";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
} from "lucide-react";
import SubHeader from "@/components/common/SubHeader";
import Navigation from "@/components/common/Navigation";
import AuthLayout from "@/components/AuthLayout";

export default async function DashboardPage() {
  const menuItems = [
    {
      title: "見積もり一覧",
      description: "新着の見積もり依頼を確認",
      icon: FileText,
      href: "/store/estimates",
      color: "bg-blue-500",
    },
    {
      title: "見積もり作成",
      description: "新しい見積もりを作成",
      icon: DollarSign,
      href: "/store/estimate/create",
      color: "bg-green-500",
    },
    {
      title: "顧客管理",
      description: "顧客情報の管理",
      icon: Users,
      href: "/store/customers",
      color: "bg-purple-500",
    },
    {
      title: "売上管理",
      description: "売上データの確認と分析",
      icon: TrendingUp,
      href: "/store/sales",
      color: "bg-orange-500",
    },
    {
      title: "スケジュール管理",
      description: "引越しスケジュールの管理",
      icon: Calendar,
      href: "/store/schedule",
      color: "bg-indigo-500",
    },
    {
      title: "メッセージ",
      description: "顧客とのやり取り",
      icon: MessageSquare,
      href: "/store/messages",
      color: "bg-pink-500",
    },
    {
      title: "統計・レポート",
      description: "業績の分析とレポート",
      icon: BarChart3,
      href: "/store/reports",
      color: "bg-teal-500",
    },
    {
      title: "店舗設定",
      description: "店舗情報と設定の管理",
      icon: Settings,
      href: "/store/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">
        <SubHeader title="店舗ダッシュボード" />
        <Navigation />

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  店舗ダッシュボード
                </h2>
                <p className="text-gray-600">
                  引越し業者としての業務管理機能にアクセスできます。各メニューから必要な機能を選択してください。
                </p>
              </div>
            </div>

            {/* メニューグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer block"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 p-3 rounded-md ${item.color}`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      <div className="text-sm">
                        <span className="text-[#003672] font-medium hover:text-[#5c6f8b]">
                          管理画面へ →
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* 店舗情報 */}
            <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  店舗情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500">
                      店舗名
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      サンプル引越し店
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500">
                      最終更新
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-500">環境</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      開発環境
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
