"use client";

import { Button } from "@/components/ui/button";
import RangeDatePicker from "@/components/ui/range-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/axios-client";
import { cn } from "@/lib/utils";
import { EquipmentSchemaType } from "@/schemas/equipment.schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Printer, RefreshCw } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useReactToPrint } from "react-to-print";
import { io } from "socket.io-client";
import EquipmentDetailsInfo from "./components/EquipDetailsCard";
import EquipmentCardInfo from "./components/EquipInfoCard";
import EquipInfoGraph, {
  EquipmentChartData,
} from "./components/EquipInfoGraph";
import EquipInfoGraphSkeleton from "./components/EquipInfoGraphSkeleton";
import EquipmentCardInfoSkeleton from "./components/EquipmentCardInfoSkeleton";
import EquipmentDetailsSkeleton from "./components/EquipmentDetailsSkeleton";

export default function EquipmentInfo() {
  const graphRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => graphRef.current,
    documentTitle: "Gráficos",
  });

  const params = useParams();
  const cookies = useCookies();
  const [online, setOnline] = useState<boolean>(false);
  const [vA, setVA] = useState<number | null>(null);
  const [vB, setVB] = useState<number | null>(null);
  const [vC, setVC] = useState<number | null>(null);
  const [iA, setIA] = useState<number | null>(null);
  const [iB, setIB] = useState<number | null>(null);
  const [iC, setIC] = useState<number | null>(null);
  const [prA, setPrA] = useState<number | null>(null);
  const [prB, setPrB] = useState<number | null>(null);
  const [prC, setPrC] = useState<number | null>(null);
  const [phaseNumber, setPhaseNumber] = useState<number>(1);
  const [selectedFilter, setSelectedFilter] = useState<string>("hoje");
  const [date, setDate] = useState<DateRange>({
    from: dayjs().startOf("day").toDate(),
    to: dayjs().endOf("day").toDate(),
  });
  const [month, setMonth] = useState<Date>(new Date());
  const [scale, setScale] = useState<
    "hour" | "day" | "week" | "month" | "year"
  >("hour");

  const { data: chartData, isLoading: isChartLoading, refetch, isRefetching } = useQuery<
    EquipmentChartData[]
  >({
    queryKey: ["equipment-chart", params.id, date.to, date.from],
    queryFn: async () => {
      console.log(date)
      const token = cookies.get("token");
      const response = await apiClient.get(`/sensor-data/${params.id}/chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          from: date.from,
          to: date.to,
        },
      });
      return response.data;
    },
  });

  const { data, isLoading } =
    useQuery<EquipmentSchemaType>({
      queryKey: ["equipment", params.id],
      queryFn: async () => {
        console.log(date.from, date.to);
        const token = cookies.get("token");
        const response = await apiClient.get(`/equipments/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      },
      placeholderData: keepPreviousData,
    });

  const token = cookies.get("token");
  useEffect(() => {
    if (data) {
      const socket = io("wss://smartclick.zenithinova.com.br", {
        path: "/api/socket.io",
        extraHeaders: {
          authorization: `bearer ${token}`,
        },
      });

      /**
       * Online
       */
      socket.on(`${data.mac}/smartclick/last_will`, (res) => {
        setOnline(res.data === "offline" ? false : true);
      });

      /**
       * Tensão
       */
      socket.on(`${data.mac}/smartclick/tfa`, (res) => {
        setVA(res.data);
        setOnline(true);
      });
      socket.on(`${data.mac}/smartclick/tfb`, (res) => {
        setVB(res.data);
      });
      socket.on(`${data.mac}/smartclick/tfc`, (res) => {
        setVC(res.data);
      });

      /**
       * Corrente
       */
      socket.on(`${data.mac}/smartclick/cfa`, (res) => {
        setIA(res.data);
      });
      socket.on(`${data.mac}/smartclick/cfb`, (res) => {
        setIB(res.data);
      });
      socket.on(`${data.mac}/smartclick/cfc`, (res) => {
        setIC(res.data);
      });

      /**
       * Potência Real
       */
      socket.on(`${data.mac}/smartclick/prfa`, (res) => {
        setPrA(res.data);
      });
      socket.on(`${data.mac}/smartclick/prfb`, (res) => {
        setPrB(res.data);
      });
      socket.on(`${data.mac}/smartclick/prfc`, (res) => {
        setPrC(res.data);
      });
    }
  }, [data, token]);

  useEffect(() => {
    if (!data) return;

    switch (data.fases_monitoradas) {
      case "MONOFASE":
        setPhaseNumber(1);
        break;
      case "BIFASE":
        setPhaseNumber(2);
        break;
      case "TRIFASE":
        setPhaseNumber(3);
        break;
    }
  }, [data]);

  useEffect(() => {
    if (selectedFilter === "hoje") {
      setDate({
        from: dayjs().startOf("day").toDate(),
        to: dayjs().endOf("day").toDate(),
      });
      setScale("hour");
    }
    if (selectedFilter === "esseMes") {
      setDate({
        from: dayjs().startOf("month").toDate(),
        to: dayjs().endOf("month").toDate(),
      });
      setScale("day");
    }
    if (selectedFilter === "esseAno") {
      setDate({
        from: dayjs().startOf("year").toDate(),
        to: dayjs().endOf("year").toDate(),
      });
      setScale("month");
    }
    if (selectedFilter === "personalizado") {
      setScale("month");
    }
  }, [selectedFilter]);

  return (
    <div>
      <div className="w-full flex flex-row justify-end items-center py-4 border border-opacity-20 border-black shadow-lg px-4 rounded-md">
        <button
          onClick={handlePrint}
          className="flex gap-1 text-sm items-center"
        >
          <Printer size={24} /> Imprimir
        </button>
      </div>
      <div className="mt-6">
        {data ? (
          <EquipmentDetailsInfo equipment={data} online={online} />
        ) : (
          <EquipmentDetailsSkeleton />
        )}
      </div>
      <div ref={graphRef} className="space-y-4 my-10">
        {
          //flex-col md:grid md:grid-cols-3
        }
        <div className="flex flex-wrap gap-5">
          {isLoading ? (
            <EquipmentCardInfoSkeleton />
          ) : (
            <EquipmentCardInfo value={{ V: vA, I: iA, Pr: prA }} phase="A" />
          )}
          {phaseNumber > 1 ? (
            isLoading ? (
              <EquipmentCardInfoSkeleton />
            ) : (
              <EquipmentCardInfo value={{ V: vB, I: iB, Pr: prB }} phase="B" />
            )
          ) : null}
          {phaseNumber > 2 ? (
            isLoading ? (
              <EquipmentCardInfoSkeleton />
            ) : (
              <EquipmentCardInfo value={{ V: vC, I: iC, Pr: prC }} phase="C" />
            )
          ) : null}
        </div>
        <div className="flex flex-row-reverse w-full gap-5">
          <Button
            className="p-0 m-0"
            disabled={isRefetching}
            onClick={() => refetch()}
            variant="link"
          >
            <RefreshCw
              size={24}
              className={cn("text-solaris-primary", {
                "animate-spin": isRefetching,
              })}
            />
          </Button>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="esseMes">Esse Mês</SelectItem>
              <SelectItem value="esseAno">Esse Ano</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          {selectedFilter === "personalizado" && (
            <div className="flex gap-2">
              <RangeDatePicker
                date={date}
                setDate={setDate}
                month={month}
                setMonth={setMonth}
              />
            </div>
          )}
        </div>
        {isChartLoading ? (
          <>
            <EquipInfoGraphSkeleton />
            <EquipInfoGraphSkeleton />
            <EquipInfoGraphSkeleton />
          </>
        ) : (
          <>
            <EquipInfoGraph
              scale={scale}
              type={selectedFilter !== "hoje" ? "bar" : "line"}
              phaseNumber={phaseNumber}
              data={chartData?.map((e) => {
                return {
                  date: e.date,
                  faseA: e.faseA.v,
                  faseB: e.faseB?.v,
                  faseC: e.faseC?.v,
                };
              })}
              startDate={date.from}
              endDate={date.to}
              title="Tensão (V)"
            />
            <EquipInfoGraph
              scale={scale}
              type={selectedFilter !== "hoje" ? "bar" : "line"}
              phaseNumber={phaseNumber}
              startDate={date.from}
              endDate={date.to}
              data={chartData?.map((e) => {
                return {
                  date: e.date,
                  faseA: e.faseA.i,
                  faseB: e.faseB?.i,
                  faseC: e.faseC?.i,
                };
              })}
              title="Corrente (A)"
            />
            <EquipInfoGraph
              scale={scale}
              type={selectedFilter !== "hoje" ? "bar" : "line"}
              phaseNumber={phaseNumber}
              startDate={date.from}
              endDate={date.to}
              data={chartData?.map((e) => {
                return {
                  date: e.date,
                  faseA: e.faseA.potenciaAtiva,
                  faseB: e.faseB?.potenciaAtiva,
                  faseC: e.faseC?.potenciaAtiva,
                };
              })}
              title="Potência (W)"
            />
          </>
        )}
      </div>
    </div>
  );
}
