import { CardColumnDef } from "@/components/card-view";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";

export const consumerUnitTableColumn: ColumnDef<ConsumerUnit>[] = [
  {
    accessorKey: "numero",
    header: "Número",
    cell: ({ row }) => {
      const link = `/consumer-units/${row.original.cod_unidade_consumidora}`;
      return (
        <Link
          prefetch={false}
          href={link}
          className="text-xs font-bold cursor-pointer text-solaris-primary underline"
        >
          {row.getValue("numero")}
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
              title: "Excluir Unidade",
              description: `Tem certeza que deseja excluir a unidade consumidora ${row.original.numero}`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if (!confirmed) return;

            // toast({
            //   title: "Excluindo...",
            //   description: `A unidade consumidora ${row.original.numero} está sendo excluida`,
            //   variant: "loading",
            // });

            await apiClient
              .delete(
                `/consumer-units/${row.original.cod_unidade_consumidora}`,
                {
                  headers: {
                    Authorization: `Bearer ${cookies.get("token")}`,
                  },
                }
              )
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ["consumer-units"] });
                toast({
                  title: "Unidade consumidora excluída com sucesso",
                  description: `A unidade consumidora ${row.original.numero} foi excluída com sucesso`,
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
          } catch (error: any) {
            toast({
              title: `Erro ao excluir a unidade consumidora`,
              description: `Ocorreu um erro ao excluir a unidade consumidora ${row.original.numero}, ${error.response.data.message}`,
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
              href={Routes.ConsumerUnitEdit.replace(
                "[id]",
                row.original.cod_unidade_consumidora
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

export const consumerUnitCardColumns: CardColumnDef<ConsumerUnit>[] = [
  {
    cell: ({ data }) => {
      const link = `/consumer-units/${data.cod_unidade_consumidora}`;
      return (
        <Link prefetch={false} href={link}>
          <h2 className="text-sm font-bold mb-1 text-solaris-primary underline">
            {data.numero}
          </h2>
        </Link>
      );
    },
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
