"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

const chartConfig = {
  faseA: {
    label: "Fase A",
    color: "hsl(var(--chart-solar-blue))",
  },
  faseB: {
    label: "Fase B",
    color: "hsl(var(--chart-solar-green))",
  },
  faseC: {
    label: "Fase C",
    color: "hsl(var(--chart-solar-yellow))",
  },
} satisfies ChartConfig;

export interface EquipmentChartData {
  date: Date;
  faseA: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
  faseB?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
  faseC?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
}

export interface ChartData {
  date: Date;
  faseA: number;
  faseB?: number;
  faseC?: number;
}

interface EquipInfoGraphProps {
  title: string;
  data?: ChartData[];
  phaseNumber?: number;
  startDate?: Date;
  endDate?: Date;
  scale?: "hour" | "day" | "week" | "month" | "year";
  type?: "line" | "bar";
}

export default function EquipInfoGraph({
  title,
  data,
  phaseNumber = 1,
  scale,
  type = "line",
  startDate,
  endDate,
}: EquipInfoGraphProps) {
  const getMinMaxValues = () => {
    let min = Infinity;
    let max = -Infinity;
    data?.forEach((item) => {
      min = Math.min(min, item.faseA, item.faseB ?? 0, item.faseC ?? 0);
      max = Math.max(max, item.faseA, item.faseB ?? 0, item.faseC ?? 0);
    });
    return { min, max };
  };

  const { min, max } = getMinMaxValues();
  const yAxisDomain = [Math.ceil(min), Math.ceil(max * 1.01)];
  data?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {data && data.length > 0
              ? `De ${dayjs(startDate).format("DD/MM/YYYY HH:mm")} a ${dayjs(endDate).format("DD/MM/YYYY HH:mm")}`
              : "Sem dados"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {type === "line" ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart
            accessibilityLayer
             data={data}
             margin={{
              left: 12,
              right: 12,
            }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                minTickGap={24}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  switch (scale) {
                    case "hour":
                      return date.toLocaleTimeString("pt-BR", {
                        hour: "numeric",
                        minute: "numeric",
                      });
                    case "day":
                    case "week":
                      return date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "numeric",
                      });
                    case "month":
                      return date.toLocaleDateString("pt-BR", {
                        month: "numeric",
                        year: "numeric",
                      });
                    case "year":
                      return date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                      });
                    default:
                      return date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      });
                  }
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={yAxisDomain}
                tickFormatter={(value) => value.toLocaleString("pt-BR")}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      switch (scale) {
                        case "hour":
                          return date.toLocaleTimeString("pt-BR", {
                            hour: "numeric",
                            minute: "numeric",
                          });
                        case "day":
                        case "week":
                          return date.toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "numeric",
                          });
                        case "month":
                          return date.toLocaleDateString("pt-BR", {
                            month: "numeric",
                            year: "numeric",
                          });
                        case "year":
                          return date.toLocaleDateString("pt-BR", {
                            year: "numeric",
                          });
                        default:
                          return date.toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          });
                      }
                    }}
                    indicator="dot"
                  />
                }
              />
              <Line
                dataKey="faseA"
                type="natural"
                fill="url(#fillFaseA)"
                stroke="var(--color-faseA)"
                strokeWidth={2}
                dot={false}
              />
              {phaseNumber > 1 && (
                <Line
                  dataKey="faseB"
                  type="natural"
                  fill="url(#fillFaseB)"
                  stroke="var(--color-faseB)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {phaseNumber > 2 && (
                <Line
                  dataKey="faseC"
                  type="natural"
                  fill="url(#fillFaseC)"
                  stroke="var(--color-faseC)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                minTickGap={24}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  switch (scale) {
                    case "hour":
                      return date.toLocaleTimeString("pt-BR", {
                        hour: "numeric",
                        minute: "numeric",
                      });
                    case "day":
                    case "week":
                      return date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "numeric",
                      });
                    case "month":
                      return date.toLocaleDateString("pt-BR", {
                        month: "numeric",
                        year: "numeric",
                      });
                    case "year":
                      return date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                      });
                    default:
                      return date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      });
                  }
                }}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="faseA"
                fill="var(--color-faseA)"
                radius={4}
              />
              {phaseNumber > 1 && (
                <Bar
                  dataKey="faseB"
                  fill="var(--color-faseB)"
                  radius={4}
                />
              )}
              {phaseNumber > 2 && (
                <Bar
                  dataKey="faseC"
                  fill="var(--color-faseC)"
                  radius={4}
                />
              )}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
