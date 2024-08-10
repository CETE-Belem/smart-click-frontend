import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, RowModel, Table as TableType, useReactTable } from "@tanstack/react-table";
import { columns } from "./columns";
import { Equipments } from "./types/equipments";

interface EquipmentsDataTableProps {
  equipments: Equipments[];
  setRowSelection: (rowSelection: any) => void;
  rowSelection: {};
}

export default function EquipmentsDataTable({ equipments, setRowSelection, rowSelection}: EquipmentsDataTableProps) {

  const table = useReactTable({
    data: equipments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      rowSelection,
    },
  });

  return (
    <Table>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
  )
}