import { useToast } from "@/components/ui/use-toast";
import { Role } from "@/enums/Role.enum";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { IUser } from "@/types/IUser";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Routes } from "@/enums/Routes.enum";
import { CardColumnDef } from "@/components/card-view";

export const usersTableColumn: ColumnDef<IUser>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const link = `/users/${row.original.cod_usuario}`;
      return (
        <Link
          prefetch={false}
          href={link}
          className="texto-xs cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
        >
          {row.getValue("nome")}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => {
      return <div className="texto-xs">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "perfil",
    header: "Perfil",
    cell: ({ row }) => {
      return <div className="texto-xs">{row.getValue("perfil")}</div>;
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
              title: "Exclluir usuário",
              description: `Tem certeza que deseja deletar o usuário ${row.original.nome}?`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if (!confirmed) return;

            toast({
              title: "Excluindo...",
              description: `O usuário ${row.original.nome} está sendo deletado`,
              variant: "loading",
            });

            await apiClient
              .delete(`/users/${row.original.cod_usuario}`, {
                headers: {
                  Authorization: `Bearer ${cookies.get("token")}`,
                },
              })
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                toast({
                  title: "Usuário deletado",
                  description: `O usuário ${row.original.nome} foi deletado com sucesso`,
                  variant: "success",
                });
              })
              .catch(() => {
                toast({
                  title: "Erro ao deletar usuário",
                  description: `Ocorreu um erro ao deletar o usuário ${row.original.nome}`,
                  variant: "destructive",
                });
              });
          } catch (error) {
            console.log(error);
            toast({
              title: "Erro ao deletar usuário",
              description: `Ocorreu um erro ao deletar o usuário ${row.original.nome}`,
              variant: "destructive",
            });
          }
        }

        return user?.perfil === Role.ADMIN ? (
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2
              size={16}
              className="text-red-600 hover:text-red-700 mr-2"
            />
            <span className="text-red-600 hover:text-red-700">Excluir</span>
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
              href={Routes.UserEdit.replace("[id]", row.original.cod_usuario)}
            >
              <DropdownMenuItem>
                <Edit size={16} className="mr-2" /> Editar
              </DropdownMenuItem>
            </Link>
            <Delete />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const userCardColumns: CardColumnDef<IUser>[] = [
  {
    cell: ({ data }) => (
      <h2 className="text-sm font-semibold mb-2 text-solaris-primary">
        {data.nome}
      </h2>
    ),
  },
  {
    cell: ({ data }) => (
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="flex flex-row gap-1 items-center">
          <span className="w-1 h-1 bg-[#58585A] rounded-full" />
          <p className="text-xs break-words max-w-[195px]">{data.email}</p>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <span className="w-1 h-1 bg-[#58585A] rounded-full" />
          <p className="text-xs font-medium">{data.perfil}</p>
        </div>
      </div>
    ),
  },
];
