import { CardColumnDef } from "@/components/card-view";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { ColumnDef } from "@tanstack/react-table";
import { Divide } from "lucide-react";

export const consumerUnitTableColumn: ColumnDef<ConsumerUnit>[] = [
  {
    accessorKey: "numero",
    header: "Número",
    cell: ({ row }) => {
      return <div className="text-xs">{row.getValue("numero")}</div>;
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
];

export const consumerUnitCardColumns: CardColumnDef<ConsumerUnit>[] = [
  {
    cell: ({ data }) => (
      <h2 className="text-xs font-semibold mb-2">{data.numero}</h2>
    ),
  },
  {
    cell: ({ data }) => (
      <p className="text-xs font-semibold mb-2">{data.cidade}</p>
    ),
  },
  {
    cell: ({ data }) => <p className="text-xs font-semibold mb-2">{data.uf}</p>,
  },
];
