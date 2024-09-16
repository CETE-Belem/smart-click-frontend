import { ColumnDef } from "@tanstack/react-table";
import { Concessionaire } from "@/types/concessionaire";
import { useAlert } from "@/providers/alert.provider";
import { useToast } from "@/components/ui/use-toast";
import { useCookies } from "next-client-cookies";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user.store";
import { apiClient } from "@/lib/axios-client";
import { Role } from "@/enums/Role.enum";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreHorizontal, Edit } from "lucide-react";
import { CardColumnDef } from "@/components/card-view";
import Link from "next/link";
import { Routes } from "@/enums/Routes.enum";

export const concessionaireTableColumn: ColumnDef<Concessionaire>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const link = `/concessionaires/${row.original.cod_concessionaria}`;
      return (
        <Link
          prefetch={false}
          href={link}
          className="text-xs cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
        >
          {row.getValue("nome")}
        </Link>
      );
    },
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => {
      return <div className="text-xs">{row.getValue("cidade")}</div>;
    },
  },
  {
    accessorKey: "uf",
    header: "UF",
    cell: ({ row }) => {
      return <div className="text-xs">{row.getValue("uf")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      function Delete() {
        const { openAlert } = useAlert();
        const { toast } = useToast();
        const cookies = useCookies();
        const queryClient = useQueryClient();
        const user = useUserStore((state) => state.user);

        async function handleDelete() {
          try {
            const confirmed = await openAlert({
              title: "Excluir Concessionária",
              description: `Tem certeza que deseja excluir a concessionária ${row.original.nome}`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if (!confirmed) return;

            toast({
              title: "Excluindo...",
              description: `A concessionária ${row.original.nome} está sendo excluída`,
              variant: "loading",
            });

            await apiClient
              .delete(`/concessionaires/${row.original.cod_concessionaria}`, {
                headers: {
                  Authorization: `Bearer ${cookies.get("token")}`,
                },
              })
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["concessionaires"],
                });
                toast({
                  title: "Concessionária excluída com sucesso",
                  description: `A concessionária ${row.original.nome} foi excluída com sucesso`,
                  variant: "success",
                });
              })
              .catch((error) => {
                toast({
                  title: `Ocorreu um erro ao excluir a concessionária`,
                  description: error.response.data.message,
                  variant: "destructive",
                });
              });
          } catch (error) {
            console.log(error);
            toast({
              title: `Erro ao excluir a concessionária`,
              description: `Ocorreu um erro ao excluir a concessionária ${row.original.nome}`,
              variant: "destructive",
            });
          }
        }

        return user?.perfil === Role.ADMIN ? (
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2
              size={16}
              className="mr-2 text-red-600 hover:text-red-600"
            />
            <span className="text-red-600 hover:text-red-600">Excluir</span>
          </DropdownMenuItem>
        ) : (
          <></>
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <Link
              href={Routes.ConcessionaireEdit.replace(
                "[id]",
                row.original.cod_concessionaria
              )}
            >
              <DropdownMenuItem>
                <Edit size={16} className="mr-2" />
                Editar
              </DropdownMenuItem>
            </Link>
            <Delete />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const concessionaireCardColumns: CardColumnDef<Concessionaire>[] = [
  {
    cell: ({ data }) => (
      <h2 className="text-sm font-semibold mb-2 text-solaris-primary ">
        {data.nome}
      </h2>
    ),
  },
  {
    cell: ({ data }) => (
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-1 items-center">
          <span className="w-1 h-1 bg-[#58585A] rounded-full" />
          <p className="text-xs font-semibold">{data.cidade}</p>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <span className="w-1 h-1 bg-[#58585A] rounded-full" />
          <p className="text-xs font-semibold">{data.uf}</p>
        </div>
      </div>
    ),
  },
];
