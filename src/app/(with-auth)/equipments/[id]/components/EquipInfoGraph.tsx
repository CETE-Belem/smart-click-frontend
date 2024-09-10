"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  date: Date
  faseA: number
  faseB?: number
  faseC?: number
}

interface EquipInfoGraphProps {
  title: string;
  data?: ChartData[];
  phaseNumber?: number;
  startDate?: Date;
  endDate?: Date;
  scale?: "hour" | "day" | "week" | "month" | "year";
}

export default function EquipInfoGraph({title, data, phaseNumber = 1, scale }: EquipInfoGraphProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {
              data ? (
                `De ${dayjs(data[0]?.date).format("DD/MM/YYYY HH:mm")} a ${dayjs(data[data.length - 1]?.date).format("DD/MM/YYYY HH:mm")}`
              ) : "Sem dados"
            }
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillFaseA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-faseA)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-faseA)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {phaseNumber > 1 && (
                <linearGradient id="fillFaseB" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-faseB)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-faseB)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              )}
              {phaseNumber > 2 && (
                <linearGradient id="fillFaseC" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-faseC)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-faseC)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                switch (scale) {
                  case "hour":
                    return date.toLocaleTimeString("pt-BR", {
                      hour: "numeric",
                      minute: "numeric",
                    });
                  case "day":
                    return date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "numeric",
                    });
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
                  default: {
                    return date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    });
                  }
                }
              }}
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
                        return date.toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "numeric",
                        });
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
                      default: {
                        return date.toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        });
                      }
                    }
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="faseA"
              type="natural"
              fill="url(#fillFaseA)"
              stroke="var(--color-faseA)"
              stackId="a"
            />
            {phaseNumber > 1 && (
              <Area
                dataKey="faseB"
                type="natural"
                fill="url(#fillFaseB)"
                stroke="var(--color-faseB)"
                stackId="a"
              />
            )}
            {phaseNumber > 2 && (
              <Area
                dataKey="faseC"
                type="natural"
                fill="url(#fillFaseC)"
                stroke="var(--color-faseC)"
                stackId="a"
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
