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
import { CirclePlus, Filter, Trash2 } from "lucide-react";

import Input from "@/components/ui/input";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Equipments } from "./types/equipments";
import EquipmentsDataTable from "./data-table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getEquipmentsAction,
  GetEquipmentsResponse,
} from "../../../../action/get-equipments.action";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { apiClient } from "@/lib/axios-client";

export default function EquipmentsPage() {
  const [rowSelection, setRowSelection] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const cookies = useCookies();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;

  function handlePageChange(pageIndex: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageIndex.toString());
    params.set("limit", perPage.toString());

    router.replace(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading } = useQuery<GetEquipmentsResponse>({
    queryKey: ["equipments", pageIndex, perPage],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetEquipmentsResponse>(
        `/equipments?page=${pageIndex}&limit=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalCount(response.data.totalEquipments);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

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
        <Link href="/dashboard/equipments/new">
          <Button variant="solar" className="w-full">
            <CirclePlus size={24} className="mr-2" />
            <p className="text-sm text-white">Novo Equipamento</p>
          </Button>
        </Link>
        <Button variant="solar" className="min-w-12 min-h-12 p-0 m-0">
          <Filter size={24} className="fill-white stroke-none" />
        </Button>
        <Button disabled variant="solar-destructive" className="w-full">
          <Trash2 size={24} />
          <p>Excluir</p>
        </Button>
      </div>
      {isLoading ? (
        <div className="w-full flex items-center justify-center mt-10">Carregando...</div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-bold text-black/50 my-5">
              TODOS OS EQUIPAMENTOS ({totalCount})
            </h3>
            <EquipmentsDataTable
              equipments={data?.equipments ?? []}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
          <Pagination
            className="my-4"
            totalCount={totalCount}
            perPage={perPage}
            pageIndex={pageIndex}
            onPageChange={(index) => {
              handlePageChange(index);
            }}
          />
        </>
      )}
    </div>
  );
}
