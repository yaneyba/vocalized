import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const changePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    onPageChange(next);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-xs text-slate-400",
        className,
      )}
    >
      <div>
        Showing{" "}
        <span className="text-slate-200">
          {start}-{end}
        </span>{" "}
        of <span className="text-slate-200">{total}</span> results
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-1 text-slate-200">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

