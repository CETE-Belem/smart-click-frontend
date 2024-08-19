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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  className?: string;
  showPages?: number;
}

export default function Pagination({
  pageIndex,
  totalCount,
  perPage,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pages = Math.ceil(totalCount / perPage) || 1;
  const query = searchParams.get("query") ?? "";

  
  function handlePageChange(pageIndex: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageIndex.toString());
    params.set("limit", perPage.toString());
    
    if(query) {
      params.set("query", query);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

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
                onClick={() => handlePageChange(1)}
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
                onClick={() => page !== "..." && handlePageChange(Number(page))}
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
                onClick={() => handlePageChange(pages)}
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