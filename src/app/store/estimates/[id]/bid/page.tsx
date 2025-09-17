import React from "react";
import { ArrowLeft, Gavel, Trophy, Clock, Eye, Lock } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import SubHeader from "@/components/common/SubHeader";
import Navigation from "@/components/common/Navigation";
import Link from "next/link";
import { getEstimateDetail } from "@/lib/actions/estimates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatMovingDate,
  formatWorkStartTime,
  formatPeopleCount,
} from "@/utils/estimateFormatters";

interface BidPageProps {
  params: {
    id: string;
  };
}

// モックデータ（実際のAPIから取得する想定）
const mockBids = [
  {
    id: "1",
    storeName: "サンプル引越し店",
    minPrice: 150000,
    maxPrice: 180000,
    submittedAt: "2024-01-15T10:30:00Z",
    isCurrentStore: true,
  },
  {
    id: "2",
    storeName: "関東引越しセンター",
    minPrice: 120000,
    maxPrice: 150000,
    submittedAt: "2024-01-15T09:15:00Z",
    isCurrentStore: false,
  },
  {
    id: "3",
    storeName: "東京引越しサービス",
    minPrice: 120000,
    maxPrice: 160000,
    submittedAt: "2024-01-15T08:45:00Z",
    isCurrentStore: false,
  },
  {
    id: "4",
    storeName: "スピード引越し",
    minPrice: 180000,
    maxPrice: 200000,
    submittedAt: "2024-01-15T07:20:00Z",
    isCurrentStore: false,
  },
];

export default async function BidPage({ params }: BidPageProps) {
  // 入札を下限金額でソート（同じ場合は上限金額でソート）
  const sortedBids = [...mockBids].sort((a, b) => {
    if (a.minPrice !== b.minPrice) {
      return a.minPrice - b.minPrice;
    }
    return a.maxPrice - b.maxPrice;
  });

  // データ取得
  const estimateResponse = await getEstimateDetail(params.id);
  const estimate = estimateResponse.data;

  if (!estimate) {
    return (
      <AuthLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              見積もりが見つかりません
            </h1>
            <p className="text-gray-600 mb-8">
              指定された見積もりは存在しないか、アクセス権限がありません。
            </p>
            <Link
              href="/store/estimates"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#003672] hover:bg-[#5c6f8b] transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              一覧に戻る
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">
        <SubHeader title="入札" />
        <Navigation />

        {/* メインコンテンツ */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/store/estimates"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                見積もり一覧に戻る
              </Link>
              <Link
                href={`/store/estimates/${params.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                詳細を見る
              </Link>
            </div>

            <div className="space-y-6">
              {/* 入札ランキング */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-yellow-600 text-white">
                  <h2 className="text-lg font-bold flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    入札ランキング
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {sortedBids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-lg border-2 ${
                          bid.isCurrentStore
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">
                                {bid.storeName}
                                {bid.isCurrentStore && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    あなた
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                {bid.minPrice.toLocaleString()}円 〜{" "}
                                {bid.maxPrice.toLocaleString()}円
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(bid.submittedAt).toLocaleString(
                                "ja-JP"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 入札フォーム */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-green-600 text-white">
                  <h2 className="text-lg font-bold">入札する</h2>
                </div>
                <div className="p-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minPrice">下限金額（円）</Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="例: 150000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPrice">上限金額（円）</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="例: 180000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        入札を提出
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
