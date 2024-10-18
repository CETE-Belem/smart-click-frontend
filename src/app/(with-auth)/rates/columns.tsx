import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/axios-client";
import { useAlert } from "@/providers/alert.provider";
import useUserStore from "@/store/user.store";
import { Rates } from "@/types/rates";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useCookies } from "next-client-cookies";
import Link from "next/link";

export const ratesTableColumn: ColumnDef<Rates>[] = [
  {
    accessorKey: "dt_tarifa",
    header: "Data",
    cell: ({ row }) => {
      const link = `/rates/${row.original.cod_tarifa}`;
      return (
        <Link
          prefetch={false}
          href={link}
          className="text-xs font-bold cursor-pointer text-solaris-primary underline"
        >
          {row.getValue("dt_tarifa")}
        </Link>
      );
    },
  },
  {
    accessorKey: "valor",
    header: "Valor",
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
              title: "Deletar tarifa",
              description: `Tem certeza que deseja excluir a tarifa ${row.original.cod_tarifa}`,
              confirmText: "Sim",
              cancelText: "Não",
            });

            if (!confirmed) return;

            toast({
              title: "Excluindo...",
              description: `Excluindo a tarifa ${row.original.cod_tarifa}`,
              variant: "loading",
            });

            await apiClient
              .delete(`/rates/${row.original.cod_tarifa}`, {
                headers: {
                  Authorization: `Bearer ${cookies.get("token")}`,
                },
              })
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ["rates"] });
                toast({
                  title: "Tarifa excluída",
                  description: `A tarifa ${row.original.cod_tarifa} foi excluída`,
                  variant: "success",
                });
              })
              .catch((error) => {
                toast({
                  title: "Ocorreu um erro ao excluir a tarifa",
                  description: error.response.data.message,
                  variant: "destructive",
                });
              });
          } catch (error) {
            console.log(error);
            toast({
              title: "Erro ao excluir a tarifa",
              description: `Ocorreu um erro ao excluir a tarifa ${row.original.cod_tarifa}`,
              variant: "destructive",
            });
          }
        }

        // return user.(

        // )
      }
    },
  },
];
