import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  className?: string;
  showPages?: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
}

export default function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onPageChange,
  className,
  showPages = 5,
}: PaginationProps) {
  const pages = Math.floor(totalCount / perPage) || 1;

  if(totalCount <= perPage) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <PaginationRoot>
        <PaginationContent>
          <div className="flex items-center space-x-4">
            {pageIndex !== 1 && (
              <PaginationLink
                className="flex items-center justify-center p-2 rounded-full w-7 h-7 cursor-pointer bg-[#F5F5F5] shadow-pager"
                onClick={() => onPageChange(1)}
              >
                <span className="sr-only">Primeira Página</span>
                <ChevronsLeft className="h-3 w-3" />
              </PaginationLink>
            )}
            {getPaginationItems(pages, pageIndex).map((page, index) => (
              <PaginationItem
                key={index}
                className={cn(
                  "flex items-center justify-center p-2 rounded-full w-7 h-7 cursor-pointer shadow-pager bg-[#F5F5F5]",
                  page === pageIndex && "bg-solaris-primary text-white",
                  page !== pageIndex && page !== "..."
                )}
                onClick={() => page !== "..." && onPageChange(Number(page))}
              >
                {page === "..." ? (
                  <PaginationEllipsis className="cursor-default"/>
                ) : (
                  <span className="text-sm">{page}</span>
                )}
              </PaginationItem>
            ))}
            {pages > pageIndex && (
              <PaginationLink
                className="flex items-center justify-center p-2 rounded-full w-7 h-7 cursor-pointer bg-[#F5F5F5] shadow-pager"
                onClick={() => onPageChange(pages)}
              >
                <span className="sr-only">Última Página</span>
                <ChevronsRight className="h-3 w-3" />
              </PaginationLink>
            )}
          </div>
        </PaginationContent>
      </PaginationRoot>
    </div>
  );
}

function getPaginationItems(totalPages: number, currentPage: number): (number | string)[] {
  const maxVisiblePages = 5;
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pages: (number | string)[] = [];

  if (startPage > 1) {
      pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages) {
      pages.push('...');
    }
  }

  return pages;
}