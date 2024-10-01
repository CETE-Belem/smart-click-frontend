"use client";

import SearchInput from "@/components/search";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import { Filter, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TotalCountData from "@/components/total-count-data";
import Pagination from "@/components/pagination";
import CardView from "@/components/card-view";
import DataTable from "@/components/data-table";
import { useToast } from "@/components/ui/use-toast";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { Concessionaire } from "@/types/concessionaire";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiClient } from "@/lib/axios-client";
import { GetRatesResponse } from "@/action/get-rates.action";
import { Rates } from "@/types/rates";
import { ratesCardColumns, ratesTableColumn } from "./columns";

export default function ConcessionairesRates() {
  const cookies = useCookies();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { openAlert } = useAlert();
  const { toast } = useToast();
  const { id } = useParams();

  const [rowSelection, setRowSelection] = useState({});

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data, isLoading } = useQuery<GetRatesResponse>({
    queryKey: ["rates", id, pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetRatesResponse>(
        `/concessionaires/${id}/rates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: pageIndex,
            limit: perPage,
          },
        }
      );
      return response.data;
    },

    placeholderData: keepPreviousData,
  });

  async function handleDelete(data: Rates) {
    try {
      const confirmed = await openAlert({
        title: "Deseja excluir a tarifa selecionada?",
        description: `Tem certeza que deseja excluir a tarifa para o subgrupo ${data.subgrupo}?`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      await apiClient
        .delete(`/concessionaires/${id}/rates/${data.cod_tarifa}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["rates"] });
          toast({
            title: "Tarifa excluída com sucesso",
            description: `A tarifa para o subgrupo ${data.subgrupo} foi excluída com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Ocorreu um erro ao excluir a tarifa",
            description: error.response.data.message,
            variant: "destructive",
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao excluir tarifa",
        description: `Ocorreu um erro ao excluir a tarifa para o subgrupo ${data.subgrupo}`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-row justify-between">
        <SearchInput />
        <Button variant="link" className="w-fit p-3 gap-2">
          <Filter
            size={24}
            className="fill-white stroke-solaris-primary hover:fill-solaris-primary"
          />
        </Button>
        <Button variant="solar" className="w-fit p-3 gap-2" asChild>
          <Link href={Routes.RateNew.replace("[id]", id as string)}>
            <CirclePlus size={24} />
            Adicionar
          </Link>
        </Button>
      </div>
      <div className="w-full flex flex-col gap-5">
        <TotalCountData
          label="Resultados de pesquisa "
          count={data?.totalRates}
        />
        <CardView<Rates>
          accessorKey="cod_tarifa"
          data={data?.rates ?? []}
          columns={ratesCardColumns}
          isLoading={isLoading}
          canEdit={user?.perfil === Role.ADMIN}
          editRoute={Routes.ConcessionaireEdit}
          canDelete={user?.perfil === Role.ADMIN}
          handleDelete={handleDelete}
        />

        <DataTable<Rates>
          columns={
            user?.perfil !== Role.ADMIN
              ? ratesTableColumn.filter((column) => column.id !== "actions")
              : ratesTableColumn
          }
          className="hidden sm:table"
          data={data?.rates ?? []}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isLoading={isLoading}
        />
      </div>
      <Pagination
        className="my-4"
        pageIndex={pageIndex}
        perPage={perPage}
        totalCount={data?.totalRates ?? 0}
      />
    </div>
  );
}
