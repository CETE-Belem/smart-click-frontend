"use client";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CirclePlus,
  Filter,
  Trash2,
} from "lucide-react";

import Input from "@/components/ui/input";
import { columns } from "./columns";
import { useState } from "react";
import { Equipments } from "./types/equipments";
import EquipmentsDataTable from "./data-table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";

const data: Equipments[] = [
  {
    id: "m5gr84i9",
    name: "Equipment 1",
    description: "Equipment 1 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 1",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 2",
    description: "Equipment 2 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 2",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 3",
    description: "Equipment 3 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 3",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 4",
    description: "Equipment 4 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 4",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 5",
    description: "Equipment 5 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 5",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 6",
    description: "Equipment 6 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 6",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 7",
    description: "Equipment 7 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 7",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 8",
    description: "Equipment 8 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 8",
  },
  {
    id: "m5gr84i9",
    name: "Equipment 9",
    description: "Equipment 9 description",
    macAddress: "00:00:00:00:00:00",
    consumerUnit: "Consumer Unit 9",
  },
];

export default function EquipmentsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = useState({});

  const [pageIndex, setPageIndex] = useState(20);
  const perPage = 10;
  const [totalCount, setTotalCount] = useState(200);



  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full py-4">
      <div className="flex items-center w-full gap-3">
        <Input
          placeholder="Pesquisar..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          labelClassName="w-full"
        />
        <Button variant="solar" className="w-full">
          <CirclePlus size={24} className="mr-2" />
          <p className="text-sm text-white">Novo Equipamento</p>
        </Button>
        <Button variant="solar" className="min-w-12 min-h-12 p-0 m-0">
          <Filter size={24} className="fill-white stroke-none" />
        </Button>
        <Button disabled variant="solar-destructive" className="w-full">
          <Trash2 size={24} />
          <p>Excluir</p>
        </Button>
      </div>
      <div>
        <h3 className="text-sm font-bold text-black/50 my-5">
          TODOS OS EQUIPAMENTOS ({totalCount})
        </h3>
        <EquipmentsDataTable table={table} />
      </div>
      <Pagination className="my-4" totalCount={totalCount} perPage={perPage} pageIndex={pageIndex} onPageChange={(index) => { setPageIndex(index)}} />
    </div>
  );
}
