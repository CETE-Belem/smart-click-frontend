import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, NotebookText, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export const equipmentsTableColumn: ColumnDef<Equipments>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const link = `/equipments/${row.original.cod_equipamento}`;
      return (
        <Link
          prefetch={false}
          className="text-xs font-bold cursor-pointer text-solaris-primary underline"
          href={link}
        >
          {row.getValue("nome")}
        </Link>
      );
    },
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => (
      <div
        className={cn(
          !row.getValue("descricao") && "text-center",
          "text-xs text-black/50"
        )}
      >
        {row.getValue("descricao") ?? "-"}
      </div>
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
            <Link href={`/equipments/${row.original.cod_equipamento}/edit`}>
              <DropdownMenuItem>
                <Edit size={16} className="mr-2" />
                Editar
              </DropdownMenuItem>
            </Link>
            <Delete
              nomeEquipamento={row.original.nome}
              cod_equipamento={row.original.cod_equipamento}
            />
            <Link
              href={`/equipments/${row.original.cod_equipamento}/constants`}
            >
              <DropdownMenuItem>
                <NotebookText size={16} className="mr-2" />
                Assistente de Calibração
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const equipmentsCardColumns: CardColumnDef<Equipments>[] = [
  {
    cell: ({ data }) => {
      const link = `/equipments/${data.cod_equipamento}`;

      return (
        <Link href={link} prefetch={false}>
          <h2 className="text-sm text-solaris-primary mb-1 font-bold underline">
            {data.nome}
          </h2>
        </Link>
      );
    },
  },
  {
    cell: ({ data }) => (
      <p className="text-xs text-black truncate max-w-48">{data.descricao}</p>
    ),
  },
  {
    cell: ({ data }) => <p className="text-xs">{data.mac}</p>,
  },
  {
    cell: ({ data }) => (
      <div className="flex gap-1 items-center justify-start mt-2">
        <span className="w-1 h-1 bg-[#58585A] rounded-full" />
        <p className="text-xs">
          Unidade Consumidora {data.unidade_consumidora?.numero}
        </p>
      </div>
    ),
  },
];

export const customMobileActions = function (data: Equipments) {
  return (
    <Link href={`/equipments/${data.cod_equipamento}/constants`}>
      <DropdownMenuItem>
        <NotebookText size={16} className="mr-2" />
        Assistente de Calibração
      </DropdownMenuItem>
    </Link>
  );
};

function Delete({
  nomeEquipamento,
  cod_equipamento,
}: {
  nomeEquipamento: string;
  cod_equipamento: string;
}) {
  const { openAlert } = useAlert();
  const { toast } = useToast();
  const cookies = useCookies();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  async function handleDelete() {
    try {
      const confirmed = await openAlert({
        title: "Excluir equipamento",
        description: `Tem certeza que deseja excluir o equipamento ${nomeEquipamento}?`,
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      // toast({
      //   title: "Excluindo...",
      //   description: `O equipamento ${row.original.nome} está sendo excluído`,
      //   variant: "loading",
      // });

      await apiClient
        .delete(`/equipments/${cod_equipamento}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["equipments"] });
          toast({
            title: "Equipamento excluído com sucesso",
            description: `O equipamento ${nomeEquipamento} foi excluído com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: `Ocorreu um erro ao excluir o equipamento ${nomeEquipamento}`,
            description: error.response.data.message,
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Erro ao excluir equipamento",
        description: `Ocorreu um erro ao excluir o equipamento ${nomeEquipamento}`,
        variant: "destructive",
      });
    }
  }

  return user?.perfil === Role.ADMIN ? (
    <DropdownMenuItem onClick={handleDelete}>
      <Trash2 size={16} className="mr-2 text-red-600 hover:text-red-600" />
      <span className="text-red-600 hover:text-red-600">Excluir</span>
    </DropdownMenuItem>
  ) : (
    <></>
  );
}
