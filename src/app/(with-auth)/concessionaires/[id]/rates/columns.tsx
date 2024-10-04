import { ColumnDef } from "@tanstack/react-table";
import { Concessionaire } from "@/types/concessionaire";
import { useAlert } from "@/providers/alert.provider";
import { useToast } from "@/components/ui/use-toast";
import { useCookies } from "next-client-cookies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Trash2,
  MoreHorizontal,
  Edit,
  NotepadText,
  CirclePlus,
  X,
} from "lucide-react";
import { CardColumnDef } from "@/components/card-view";
import Link from "next/link";
import { Routes } from "@/enums/Routes.enum";
import { Rates } from "@/types/rates";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const ratesTableColumn: ColumnDef<Rates>[] = [
  {
    accessorKey: "dt_tarifa",
    header: "Data da Resolução",
    cell: ({ row }) => {
      return (
        <p className="text-xs">
          {dayjs(row.getValue("dt_tarifa")).format("DD/MM/YYYY")}
        </p>
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
      return (
        <RatesInfoDialog cod_tarifa={row.original.cod_tarifa}>
          <Button className="text-sm" variant="solar">
            Ver Horários
          </Button>
        </RatesInfoDialog>
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
              href={Routes.RateEdit.replace(
                "[id]",
                row.original.cod_concessionaria
              ).replace("[id-rates]", row.original.cod_tarifa)}
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
    cell: ({ data }) => <div className="text-xs">{data.valor}</div>,
  },
  {
    cell: ({ data }) => <div className="text-xs">{data.subgrupo}</div>,
  },
  {
    cell: ({ data }) => (
      <Button className="text-sm" variant="solar">
        Ver Horários
      </Button>
    ),
  },
];

function RatesInfoDialog({
  cod_tarifa,
  children,
}: {
  cod_tarifa: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const cookies = useCookies();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["rates-interval", cod_tarifa],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<any>(`/rates/${cod_tarifa}/chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const chartConfig = {
    valor: {
      label: "Valor",
    },
  } satisfies ChartConfig;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-72 sm:max-w-96 flex flex-col gap-8 items-center justify-center p-9 overflow-hidden border-none rounded-[1.25rem]">
        <div className="w-full flex justify-between">
        <AlertDialogTitle className="text-3xl font-bold text-secondary-foreground text-center items-stretch">
          Horários
        </AlertDialogTitle>
        <AlertDialogCancel asChild>
          <Button className="self-end p-2 h-fit border-none">
            <X size={24} className="text-black" />
          </Button>
        </AlertDialogCancel>
        </div>
        <div className="w-full h-fit">
        {data && data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-72 w-full">
            <BarChart
              accessibilityLayer
              data={data?.map((item: any) => ({
                name: `${convertMinutesToHourLabel(item.de)} - ${convertMinutesToHourLabel(item.ate)}`,
                valor: item.valor,
                tipo: item.tipo,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => `R$${value}`}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                verticalAlign="bottom"
                payload={[
                  { value: "Fora de Ponta", type: "square", color: "#5CB66D" },
                  { value: "Intermediaria", type: "square", color: "#66BB00" },
                  { value: "Ponta", type: "square", color: "#FF0000" },
                ]}
              />
              <Bar dataKey="valor">
                <LabelList position="top" dataKey="valor" fillOpacity={1} content={
                  (props: any) => {
                    return (
                      <text
                        x={props.x + props.width / 2}
                        y={props.y}
                        dy={-10}
                        fontSize={12}
                        textAnchor="middle"
                        fill={props.fill}
                      >
                        {`R$${props.value}`}
                      </text>
                    );
                  }
                } />
                {data?.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.tipo === "FORA_DE_PONTA"
                        ? "#5CB66D"
                        : entry.tipo === "PONTA"
                          ? "#FF0000"
                          : "#66BB00"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <p>Nenhum dado disponível para exibir o gráfico.</p>
        )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const convertMinutesToHourLabel = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  return `${hours < 10 ? `0${hours}` : hours}:${minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}`;
};
