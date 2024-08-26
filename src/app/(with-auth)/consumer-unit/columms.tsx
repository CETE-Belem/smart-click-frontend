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
      <h2 className="text-xs font-semibold mb-2 text-solaris-primary">
        {data.numero}
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
