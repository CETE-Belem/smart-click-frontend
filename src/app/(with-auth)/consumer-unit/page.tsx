"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetConsumerUnitResponse } from "@/action/get-consumer-unit.action";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { Routes } from "@/enums/Routes.enum";
import { Role } from "@/enums/Role.enum";
import { apiClient } from "@/lib/axios-client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCookies } from "next-client-cookies";

// Components
import { CirclePlus, Filter } from "lucide-react";
import SearchInput from "@/components/search";
import TotalCountData from "@/components/total-count-data";
import { Button } from "@/components/ui/button";
import CardView from "@/components/card-view";
import useUserStore from "@/store/user.store";
import { consumerUnitCardColumns, consumerUnitTableColumn } from "./columms";
import DataTable from "@/components/data-table";
import { useState } from "react";
import Pagination from "@/components/pagination";

export default function ConsumerUnitPage() {
  const cookies = useCookies();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [rowSelection, setRowSelection] = useState({});

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data, isLoading } = useQuery<GetConsumerUnitResponse>({
    queryKey: ["consumerUnit", pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetConsumerUnitResponse>(
        `/consumer-unit`,
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
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-row justify-between">
        <SearchInput />

        <Button variant="link" className="w-fit p-3">
          <Filter
            size={24}
            className="fill-white stroke-solaris-primary hover:fill-solaris-primary"
          />
        </Button>

        <Button variant="solar" className="w-fit p-3" asChild>
          <Link href={"/"}>
            <CirclePlus size={24} />
          </Link>
        </Button>
      </div>

      <div className="w-full flex flex-col gap-5">
        <TotalCountData
          label="Resultados de pesquisa "
          count={data?.totalConsumerUnit}
        />

        <CardView<ConsumerUnit>
          accessorKey="cod_unidade_consumidora"
          data={data?.consumerUnits ?? []}
          columns={consumerUnitCardColumns}
          isLoading={isLoading}
          canEdit
          canDelete={user?.perfil === Role.ADMIN}
        />

        <DataTable<ConsumerUnit>
          columns={consumerUnitTableColumn}
          className="hidden sm:table"
          data={data?.consumerUnits ?? []}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isLoading={isLoading}
        />
      </div>
      <Pagination
        className="my-4"
        pageIndex={pageIndex}
        perPage={perPage}
        totalCount={data?.totalConsumerUnit ?? 0}
      />
    </div>
  );
}
