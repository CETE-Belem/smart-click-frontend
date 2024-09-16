"use client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetConsumerUnitsResponse } from "@/action/get-consumer-units.action";
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
import { useAlert } from "@/providers/alert.provider";
import { useToast } from "@/components/ui/use-toast";

export default function ConsumerUnitsPage() {
  const cookies = useCookies();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { openAlert } = useAlert();
  const { toast } = useToast();

  const [rowSelection, setRowSelection] = useState({});

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data, isLoading } = useQuery<GetConsumerUnitsResponse>({
    queryKey: ["consumer-units", pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetConsumerUnitsResponse>(
        `/consumer-units`,
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
          queryClient.invalidateQueries({ queryKey: ["consumer-units"] });
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

        {user?.perfil === Role.ADMIN && (
          <Button variant="solar" className="w-fit p-3 gap-2" asChild>
            <Link href={Routes.ConsumerUnitNew}>
              <CirclePlus size={24} />
              Adicionar
            </Link>
          </Button>
        )}
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
