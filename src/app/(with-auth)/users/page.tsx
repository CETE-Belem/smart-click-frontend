"use client";
import { GetUsersResponse } from "@/action/get-users.action";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { IUser } from "@/types/IUser";
import SearchInput from "@/components/search";
import { Button } from "@/components/ui/button";
import { CirclePlus, Filter } from "lucide-react";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import Link from "next/link";
import TotalCountData from "@/components/total-count-data";
import CardView from "@/components/card-view";
import { userCardColumns, usersTableColumn } from "./columns";
import DataTable from "@/components/data-table";
import Pagination from "@/components/pagination";

export default function UsersPage() {
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

  const { data, isLoading } = useQuery<GetUsersResponse>({
    queryKey: ["users", pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetUsersResponse>(`/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pageIndex,
          limit: perPage,
          query,
        },
      });
      return response.data;
    },

    placeholderData: keepPreviousData,
  });

  async function handleDelete(data: IUser) {
    try {
      const confirmed = await openAlert({
        title: "Excluir Usuário",
        description: `Tem certeza que deseja excluir o usuário ${data.nome}?`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      toast({
        title: "Excluindo...",
        description: `O usuário ${data.nome} está sendo excluído`,
        variant: "loading",
      });

      await apiClient
        .delete(`/users/${data.cod_usuario}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast({
            title: "Usuário excluído",
            description: `O usuário ${data.nome} foi excluído com sucesso`,
            variant: "success",
          });
        })
        .catch(() => {
          toast({
            title: "Erro ao excluir usuário",
            description: `Ocorreu um erro ao excluir o usuário ${data.nome}`,
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        description: `Ocorreu um erro ao excluir o usuário ${data.nome}`,
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
            <Link href={Routes.AdminNew}>
              <CirclePlus size={24} />
              Adicionar
            </Link>
          </Button>
        )}
      </div>

      <div className="w-full flex flex-col gap-5">
        <TotalCountData
          label="Resultados de pesquisa"
          count={data?.totalUsers}
        />

        <CardView<IUser>
          accessorKey="cod_usuario"
          data={data?.users ?? []}
          columns={userCardColumns}
          isLoading={isLoading}
          canEdit={user?.perfil === Role.ADMIN}
          editRoute={Routes.UserEdit}
          canDelete={user?.perfil === Role.ADMIN}
          handleDelete={handleDelete}
        />

        <DataTable<IUser>
          columns={
            user?.perfil !== Role.ADMIN
              ? usersTableColumn.filter((column) => column.id !== "actions")
              : usersTableColumn
          }
          className="hidden sm:table"
          data={data?.users ?? []}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isLoading={isLoading}
        />

        <Pagination
          className="my-4"
          pageIndex={pageIndex}
          perPage={perPage}
          totalCount={data?.totalUsers ?? 0}
        />
      </div>
    </div>
  );
}
