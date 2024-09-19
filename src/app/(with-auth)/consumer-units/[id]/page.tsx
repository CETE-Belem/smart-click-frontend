"use client";
import { GetEquipmentsResponse } from "@/action/get-equipments.action";
import {
  equipmentsCardColumns,
  equipmentsTableColumn,
} from "@/app/(with-auth)/equipments/columns";
import CardView from "@/components/card-view";
import DataTable from "@/components/data-table";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/search";
import TotalCountData from "@/components/total-count-data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { Equipments } from "@/types/equipments";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CirclePlus, Filter } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function ConsumerUnitEquipments() {
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

  const { data, isLoading } = useQuery<GetEquipmentsResponse>({
    queryKey: ["consumer-units-equipments", id, pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetEquipmentsResponse>(
        `/consumer-units/${id}/equipments`,
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

  async function handleDelete(data: Equipments) {
    try {
      const confirmed = await openAlert({
        title: "Excluir o equipamento",
        description: `Você tem certeza que deseja excluir o equipamento ${data.nome}?`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      // toast({
      //   title: "Excluindo...",
      //   description: `O equipamento ${data.nome} está sendo excluido`,
      //   variant: "loading",
      // });

      await apiClient
        .delete(`/equipments/${data.cod_equipamento}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["consumer-units-equipments"],
          });
          toast({
            title: `Equipamento excluido com sucesso`,
            description: `O equipamento ${data.nome} foi excluido com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: `Ocorreu um erro ao excluir o equipamento ${data.nome}`,
            description: error.response.data.message,
            variant: "destructive",
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: `Erro ao excluir a unidade consumidora`,
        description: `Ocorreu um erro ao excluir a unidade consumidora ${data.nome}`,
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
                <Link href={Routes.EquipmentsNew}>
                  <CirclePlus size={24} className="mr-2" />
                  <p className="text-sm text-white">Novo Equipamento</p>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <TotalCountData
          label="Equipamentos da Unidade Consumidora"
          count={data?.totalEquipments}
        />

        <CardView<Equipments>
          accessorKey="cod_equipamento"
          data={data?.equipments ?? []}
          columns={equipmentsCardColumns}
          isLoading={isLoading}
          canEdit={user?.perfil === Role.ADMIN}
          editRoute={Routes.EquipmentsEdit}
          canDelete={user?.perfil === Role.ADMIN}
          handleDelete={handleDelete}
        />

        <DataTable<Equipments>
          columns={
            user?.perfil !== Role.ADMIN
              ? equipmentsTableColumn.filter(
                  (column) => column.id !== "actions"
                )
              : equipmentsTableColumn
          }
          data={data?.equipments ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          className="hidden sm:table"
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
