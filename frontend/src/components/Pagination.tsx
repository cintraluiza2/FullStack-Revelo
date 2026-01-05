import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const clampPage = (p: number) => Math.max(1, Math.min(totalPages, p));

  const safeChange = (next: number) => {
    const p = clampPage(next);
    if (p !== currentPage) onPageChange(p);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = 1; i <= Math.min(9, totalPages); i++) pages.push(i);
      if (totalPages > 10) {
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-0 mt-8 h-[36px]">
      {/* Previous */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          safeChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="w-[34px] h-[36px] flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Numbers */}
      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 text-[16px] text-[#222222] leading-[24px]">
              …
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              safeChange(pageNum);
            }}
            className={`min-w-[40px] h-[35.5px] px-4 text-[16px] leading-[19.5px] rounded ${
              isActive
                ? "bg-[#eff1f0] text-[#15372c] font-bold"
                : "text-[#15372c] font-normal hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          safeChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        className="w-[34px] h-[36px] flex items-center justify-center rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
