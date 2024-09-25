"use client";

import { GetConsumerUnitsResponse } from "@/action/get-consumer-units.action";
import CardView from "@/components/card-view";
import SearchInput from "@/components/search";
import TotalCountData from "@/components/total-count-data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CirclePlus, Filter } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  consumerUnitCardColumns,
  consumerUnitTableColumn,
} from "../../consumer-units/columms";
import { Role } from "@/enums/Role.enum";
import DataTable from "@/components/data-table";
import Pagination from "@/components/pagination";

export default function UserConsumerUnit() {
  const [rowSelection, setRowSelection] = useState({});
  const cookies = useCookies();
  const user = useUserStore((state) => state.user);
  const { openAlert } = useAlert();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const params = useParams();
  const searchParams = useSearchParams();

  const { id } = params as { id: string };

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data, isLoading } = useQuery<GetConsumerUnitsResponse>({
    queryKey: ["user-consumer-units", id, pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetConsumerUnitsResponse>(
        `/users/${id}/consumer-units`,
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

  async function handleDelete(data: ConsumerUnit) {
    try {
      const confirmed = await openAlert({
        title: "Excluir Unidade",
        description: `Tem certeza que deseja excluir a unidade consumidora ${data.numero}`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      toast({
        title: "Excluindo...",
        description: `A unidade consumidora ${data.numero} está sendo excluida`,
        variant: "loading",
      });

      await apiClient
        .delete(`/consumer-unit/${data.cod_unidade_consumidora}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["user-consumer-units"] });
          toast({
            title: "Unidade consumidora excluída com sucesso",
            description: `A unidade consumidora ${data.numero} foi excluída com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: `Ocorreu um erro ao excluir a unidade consumidora`,
            description: error.response.data.message,
            variant: "destructive",
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: `Erro ao excluir a unidade consumidora`,
        description: `Ocorreu um erro ao excluir a unidade consumidora ${data.numero}`,
        variant: "destructive",
      });
    }
  }

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

        <Button variant="solar" className="w-fit p-3 gap-2" asChild>
          <Link href={Routes.ConsumerUnitNew}>
            <CirclePlus size={24} />
            Adicionar
          </Link>
        </Button>
      </div>

      <div className="w-full flex flex-col gap-5">
        <TotalCountData
          label="Resultados de pesquisa "
          count={data?.totalConsumerUnits}
        />

        <CardView<ConsumerUnit>
          accessorKey="cod_unidade_consumidora"
          data={data?.consumerUnits ?? []}
          columns={consumerUnitCardColumns}
          isLoading={isLoading}
          canEdit={user?.perfil === Role.ADMIN}
          editRoute={Routes.ConsumerUnitEdit}
          canDelete={user?.perfil === Role.ADMIN}
          handleDelete={handleDelete}
        />

        <DataTable<ConsumerUnit>
          columns={
            user?.perfil !== Role.ADMIN
              ? consumerUnitTableColumn.filter(
                  (column) => column.id !== "actions"
                )
              : consumerUnitTableColumn
          }
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
        totalCount={data?.totalConsumerUnits ?? 0}
      />
    </div>
  );
}
