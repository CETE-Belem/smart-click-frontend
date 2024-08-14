"use client";
import { CirclePlus, Filter } from "lucide-react";

import { equipmentsCardColumns, equipmentsTableColumn } from "./columns";
import { useState } from "react";
import { Equipments } from "../../../types/equipments";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  GetEquipmentsResponse,
} from "../../../action/get-equipments.action";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { apiClient } from "@/lib/axios-client";
import SearchInput from "@/components/search";
import { Routes } from "@/enums/Routes.enum";
import DataTable from "@/components/data-table";
import TotalCountData from "@/components/total-count-data";
import CardView from "../../../components/card-view";

export default function EquipmentsPage() {
  const [rowSelection, setRowSelection] = useState({});
  const cookies = useCookies();

  const searchParams = useSearchParams();

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data } = useQuery<GetEquipmentsResponse>({
    queryKey: ["equipments", pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetEquipmentsResponse>(
        `/equipments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: pageIndex,
            limit: perPage,
            query,
          },
        }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="w-full py-4">
      <div className="flex items-center w-full gap-3">
        <div className="flex flex-col-reverse sm:flex-row w-full gap-5">
          <SearchInput />
          <div className="flex flex-row-reverse justify-between sm:flex-row sm:justify-start w-full sm:w-fit">
            <Button variant="link" className="w-fit p-3">
              <Filter size={24} className="fill-white stroke-solaris-primary hover:fill-solaris-primary" />
            </Button>
            <Button variant="solar" className="w-fit" asChild>
              <Link href={Routes.EquipmentsNew}>
                <CirclePlus size={24} className="mr-2" />
                <p className="text-sm text-white">Novo Equipamento</p>
              </Link>
            </Button>
          </div>
        </div>
        {/* <Button disabled variant="solar-destructive" className="w-fit">
          <Trash2 size={24} />
          <p>Excluir</p>
        </Button> */}
      </div>
      <div>
        <TotalCountData label="Todos os Equipamentos" count={data?.totalEquipments}/>
        <CardView<Equipments>
          accessorKey="cod_equipamento"
          data={data?.equipments ?? []}
          columns={equipmentsCardColumns}
        />
        <DataTable<Equipments>
          columns={equipmentsTableColumn}
          className="hidden sm:table"
          data={data?.equipments ?? []}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
      <Pagination
        className="my-4"
        totalCount={data?.totalEquipments ?? 0}
        perPage={perPage}
        pageIndex={pageIndex}
      />
    </div>
  );
}
