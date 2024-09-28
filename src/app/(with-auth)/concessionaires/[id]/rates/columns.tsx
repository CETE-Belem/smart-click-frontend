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
import { Trash2, MoreHorizontal, Edit, NotepadText } from "lucide-react";
import { CardColumnDef } from "@/components/card-view";
import Link from "next/link";
import { Routes } from "@/enums/Routes.enum";
import { Rates } from "@/types/rates";
import dayjs from "dayjs";

export const ratesTableColumn: ColumnDef<Rates>[] = [
  {
    accessorKey: "dt_tarifa",
    header: "Data da Resolução",
    cell: ({ row }) => {
      return (
        <p className="text-xs">{dayjs(row.getValue("dt_tarifa")).format("DD/MM/YYYY")}</p>
      );
    },
  },
  {
    accessorKey: "valor",
    header: "Valor convencional",
    cell: ({ row }) => {
      return <div className="text-xs">{row.getValue("valor")}</div>;
    },
  },
  {
    accessorKey: "subgrupo",
    header: "Subgrupo",
    cell: ({ row }) => {
      return <div className="text-xs">{row.getValue("subgrupo")}</div>;
    },
  },
  {
    id: "ver-horarios",
    header: "",
    cell: ({ row }) => {
      return <Button className="text-sm" variant="solar">Ver Horários</Button>;
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
              title: "Excluir Tarifa",
              description: `Tem certeza que deseja excluir a tarifa da concessionária para o subgrupo ${row.original.subgrupo}`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if (!confirmed) return;

            // toast({
            //   title: "Excluindo...",
            //   description: `A concessionária ${row.original.nome} está sendo excluída`,
            //   variant: "loading",
            // });

            await apiClient
              .delete(`/rates/${row.original.cod_tarifa}`, {
                headers: {
                  Authorization: `Bearer ${cookies.get("token")}`,
                },
              })
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["rates"],
                });
                toast({
                  title: "Tarifa excluída com sucesso",
                  description: `A tarifa do subgrupo ${row.original.subgrupo} foi excluída com sucesso`,
                  variant: "success",
                });
              })
              .catch((error) => {
                toast({
                  title: `Ocorreu um erro ao excluir a tarifa`,
                  description: error.response.data.message,
                  variant: "destructive",
                });
              });
          } catch (error) {
            console.log(error);
            toast({
              title: `Erro ao excluir a tarifa`,
              description: `Ocorreu um erro ao excluir a tarifa de subgrupo ${row.original.subgrupo}`,
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
              href={Routes.RatesEdit
                .replace("[id]", row.original.cod_concessionaria)
                .replace(
                "[id-rates]",
                row.original.cod_tarifa
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

export const ratesCardColumns: CardColumnDef<Rates>[] = [
  {
    cell: ({ data }) => {
      return (
        <p className="text-sm">{dayjs(data.dt_tarifa).format("DD/MM/yyyy")}</p>
      );
    },
  },
  {
    cell: ({ data }) => (
      <div className="text-xs">{data.valor}</div>
    ),
  },
  {
    cell: ({ data }) => (
      <div className="text-xs">{data.subgrupo}</div>
    ),
  },
  {
    cell: ({ data }) => (
      <Button className="text-sm" variant="solar">Ver Horários</Button>
    ),
  },
];
