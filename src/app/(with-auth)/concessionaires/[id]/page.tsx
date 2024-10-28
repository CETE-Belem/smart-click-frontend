"use client";
import SearchInput from "@/components/search";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CirclePlus, Filter } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import TotalCountData from "@/components/total-count-data";
import CardView from "@/components/card-view";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import {
  consumerUnitCardColumns,
  consumerUnitTableColumn,
} from "../../consumer-units/columms";
import DataTable from "@/components/data-table";
import Pagination from "@/components/pagination";
import { GetConsumerUnitsResponse } from "@/action/get-consumer-units.action";
import { apiClient } from "@/lib/axios-client";

export default function ConcessionaireConsumerUnits() {
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
    queryKey: ["concessionaires-consumer-units", id, pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetConsumerUnitsResponse>(
        `/concessionaires/${id}/consumer-unit`,
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
        title: "Excluir unidade consumidora",
        description: `Você tem certeza que deseja excluir a unidade consumidora ${data.numero}?`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      await apiClient
        .delete(`/consumer-units/${data.cod_unidade_consumidora}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["concessionaires-consumer-units"],
          });
          toast({
            title: "Unidade consumidora excluída",
            description: `A unidade consumidora ${data.numero} foi excluída com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Erro ao excluir a unidade consumidora",
            description: `Ocorreu um erro ao excluir a unidade consumidora ${data.numero}`,
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Erro ao excluir a unidade consumidora",
        description: `Ocorreu um erro ao excluir a unidade consumidora ${data.numero}`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center w-full gap-3">
        <div className="flex flex-col-reverse sm:flex-row w-full gap-5">
          <SearchInput />
          <div className="flex flex-row-reverse justify-between sm:flex-row sm:justify-start w-full sm:w-fit">
            <Button variant="link" className="w-fit p-3">
              <Filter
                size={24}
                className="fill-white stroke-solaris-primary hover:fill-solaris-primary"
              />
            </Button>

            {user?.perfil === Role.ADMIN && (
              <Button variant="solar" className="w-fit" asChild>
                <Link href={Routes.ConsumerUnitNew}>
                  <CirclePlus size={24} />
                  <p className="text-sm text-white">Adicionar</p>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <TotalCountData
          label="Unidades consumidoras da concessionária"
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
          data={data?.consumerUnits ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          className="hidden sm:table"
        />
      </div>

      <Pagination
        className="my-4"
        totalCount={data?.totalConsumerUnits ?? 0}
        perPage={perPage}
        pageIndex={pageIndex}
      />
    </div>
  );
}
