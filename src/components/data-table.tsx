import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowModel,
  Table as TableType,
  useReactTable,
} from "@tanstack/react-table";
import NoResult from "./no-result";
import { LoaderCircle } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  setRowSelection: (rowSelection: any) => void;
  rowSelection: {};
  className?: string;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
}

export default function DataTable<T>({
  data,
  setRowSelection,
  rowSelection,
  className,
  columns,
  isLoading,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      rowSelection,
    },
  });

  return (
    <>
      <Table className={className}>
        <TableHeader className="bg-[#F5F5F5] border-b-8 border-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="bg-[#F5F5F5] hover:bg-[#F5F5F5] border-b-8 border-white"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-64 py-6 text-center">
                {
                  isLoading ? (
                    <div className="flex justify-center items-center">
                      <LoaderCircle className="w-8 h-8 mr-2 animate-spin text-solaris-primary" />
                    </div>
                  ) : (
                    <NoResult />
                  )
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
