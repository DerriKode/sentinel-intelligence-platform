export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

function pageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("start-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("end-ellipsis");
  }

  items.push(totalPages);
  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = "Results pagination"
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <nav className="pagination" aria-label={label}>
      <p className="pagination__status" aria-live="polite">
        Page {safeCurrentPage} of {totalPages}
      </p>
      <div className="pagination__controls">
        <button
          className="pagination__button pagination__button--direction"
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          Previous
        </button>
        <ol className="pagination__pages">
          {pageItems(safeCurrentPage, totalPages).map((item) => (
            <li key={item}>
              {typeof item === "number" ? (
                <button
                  className="pagination__button"
                  type="button"
                  aria-label={`Page ${item}`}
                  aria-current={item === safeCurrentPage ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              ) : (
                <span className="pagination__ellipsis" aria-hidden="true">…</span>
              )}
            </li>
          ))}
        </ol>
        <button
          className="pagination__button pagination__button--direction"
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
