import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Equipments } from "../../../types/equipments";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { CardColumnDef } from "../../../components/card-view";

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
      return <div className="text-xs">{(row.getValue("unidade_consumidora") as ConsumerUnit)?.numero}</div>;
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
            <DropdownMenuItem>
              <Edit size={16} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 size={16} className="mr-2" />
              Excluir
            </DropdownMenuItem>
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
    cell: ({ data }) => (
      <p className="text-xs">{data.descricao}</p>
    ),
  },
  {
    cell: ({ data }) => (
      <p className="text-xs">{data.mac}</p>
    ),
  },
  {
    cell: ({ data }) => (
      <div className="flex gap-1 items-center justify-start">
        <span className="w-1 h-1 bg-[#58585A] rounded-full"/>
        <p className="text-xs">Concessionária {data.concessionaria.nome}</p>
      </div>
    ),
  }
];