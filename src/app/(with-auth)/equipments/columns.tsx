import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Equipments } from "../../../types/equipments";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { CardColumnDef } from "../../../components/card-view";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { apiClient } from "@/lib/axios-client";
import { useCookies } from "next-client-cookies";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { Role } from "@/enums/Role.enum";

export const equipmentsTableColumn: ColumnDef<Equipments>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div className="text-xs">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="text-xs text-black/50">{row.getValue("descricao")}</div>
    ),
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => {
      return <div className="text-xs text-black/50">{row.getValue("mac")}</div>;
    },
  },
  {
    accessorKey: "unidade_consumidora",
    header: "Unidade Consumidora",
    cell: ({ row }) => {
      return (
        <div className="text-xs">
          {(row.getValue("unidade_consumidora") as ConsumerUnit)?.numero}
        </div>
      );
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
              title: "Excluir equipamento",
              description: `Tem certeza que deseja excluir o equipamento ${row.original.nome}?`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if(!confirmed) return;
            
            const response = await apiClient.delete(`/equipments/${row.original.cod_equipamento}`, {
              headers: {
                Authorization: `Bearer ${cookies.get("token")}`,
              },
            });

            if(response.status === 200) {
              queryClient.invalidateQueries({ queryKey: ["equipments"] });
              toast({
                title: "Equipamento excluído com sucesso",
                description: `O equipamento ${row.original.nome} foi excluído com sucesso`,
                variant: "destructive",
              })
            }else{
              toast({
                title: `Ocorreu um erro ao excluir o equipamento ${row.original.nome}`,
                description: response.data.message,
                variant: "destructive",
              });
            }
          } catch (error) {
            console.log(error)
            toast({
              title: "Erro ao excluir equipamento",
              description: `Ocorreu um erro ao excluir o equipamento ${row.original.nome}`,
              variant: "destructive",
            });
          }
        }

        return user?.perfil === Role.ADMIN ?  (
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2
              size={16}
              className="mr-2 text-red-600 hover:text-red-600"
            />
            <span className="text-red-600 hover:text-red-600">Excluir</span>
          </DropdownMenuItem>
        ) : <></>;
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
            <Link href={`/equipments/${row.original.cod_equipamento}`}>
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

export const equipmentsCardColumns: CardColumnDef<Equipments>[] = [
  {
    cell: ({ data }) => (
      <h2 className="text-xs font-semibold mb-2">{data.nome}</h2>
    ),
  },
  {
    cell: ({ data }) => <p className="text-xs">{data.descricao}</p>,
  },
  {
    cell: ({ data }) => <p className="text-xs">{data.mac}</p>,
  },
  {
    cell: ({ data }) => (
      <div className="flex gap-1 items-center justify-start">
        <span className="w-1 h-1 bg-[#58585A] rounded-full" />
        <p className="text-xs">Concessionária {data.concessionaria.nome}</p>
      </div>
    ),
  },
];