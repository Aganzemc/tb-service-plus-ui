type AdminPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

function buildPageList(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);

  return [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((first, second) => first - second);
}

export default function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  itemLabel,
  onPageChange,
}: AdminPaginationProps) {
  if (totalItems <= pageSize || totalPages <= 1) {
    return null;
  }

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-black/6 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <p className="text-[13px] text-muted">
        {totalItems} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-white px-4 text-[13px] font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Previous
        </button>

        {pages.map((value, index) => {
          const previous = pages[index - 1];
          const showGap = previous != null && value - previous > 1;
          const active = value === page;

          return (
            <span key={value} className="flex items-center gap-2">
              {showGap ? <span className="text-[12px] text-black/35">...</span> : null}
              <button
                type="button"
                onClick={() => onPageChange(value)}
                disabled={active}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-[13px] font-semibold ${
                  active
                    ? "bg-brand-ink text-white shadow-[0_10px_24px_rgba(5,3,47,0.14)]"
                    : "border border-black/8 bg-white text-brand-ink"
                } disabled:cursor-default`}
              >
                {value}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-white px-4 text-[13px] font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next
        </button>
      </div>
    </div>
  );
}
