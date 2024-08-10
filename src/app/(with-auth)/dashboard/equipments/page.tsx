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
import { useEffect, useState } from "react";
import { Equipments } from "./types/equipments";
import EquipmentsDataTable from "./data-table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { getEquipmentsAction } from "../../../../action/get-equipments.action";

export default function EquipmentsPage() {
  const [rowSelection, setRowSelection] = useState({});
  const perPage = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [equipments, setEquipments] = useState<Equipments[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;

  function handlePageChange(pageIndex: number) {
    router.push(`?page=${pageIndex}`);
  }

  useEffect(() => {
    async function fetchEquipments() {
      const response = await getEquipmentsAction(pageIndex, perPage);
      setTotalCount(response.totalEquipments);
      setEquipments(response.equipments);
    }

    fetchEquipments();
  }, []);

  return (
    <div className="w-full py-4">
      <div className="flex items-center w-full gap-3">
        <Input
          placeholder="Pesquisar..."
          // value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("nome")?.setFilterValue(event.target.value)
          // }
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
        <EquipmentsDataTable equipments={equipments} rowSelection={rowSelection} setRowSelection={setRowSelection}  />
      </div>
      <Pagination className="my-4" totalCount={totalCount} perPage={perPage} pageIndex={pageIndex} onPageChange={(index) => { handlePageChange(index)}} />
    </div>
  );
}
