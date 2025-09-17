import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  baseUrl,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
      {/* モバイル用ページネーション */}
      <div className="flex-1 flex justify-between sm:hidden">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            前へ
          </Link>
        )}
        {currentPage < lastPage && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            次へ
          </Link>
        )}
      </div>

      {/* デスクトップ用ページネーション */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{from}</span>
            から
            <span className="font-medium">{to}</span>
            まで（全
            <span className="font-medium">{total}</span>
            件中）
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {currentPage > 1 && (
              <Link
                href={`${baseUrl}?page=${currentPage - 1}`}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                前へ
              </Link>
            )}

            {/* ページ番号 */}
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === lastPage ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                );
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <Link
                      href={`${baseUrl}?page=${page}`}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? "z-10 bg-[#003672] border-[#003672] text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </Link>
                  </React.Fragment>
                );
              })}

            {currentPage < lastPage && (
              <Link
                href={`${baseUrl}?page=${currentPage + 1}`}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                次へ
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
