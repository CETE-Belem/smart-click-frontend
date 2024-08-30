"use client";

import { useEffect, useState } from "react";
import EquipmentCardInfo from "./components/EquipInfoCard";
import EquipInfoGraph from "./components/EquipInfoGraph";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { apiClient } from "@/lib/axios-client";
import { EquipmentSchemaType } from "@/schemas/equipment.schema";
import EquipmentCardInfoSkeleton from "./components/EquipmentCardInfoSkeleton";
import EquipInfoGraphSkeleton from "./components/EquipInfoGraphSkeleton";
import dayjs from "dayjs";

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

export default function EquipmentInfo() {
  const params = useParams();
  const cookies = useCookies();
  const [vA, setVA] = useState<number | null>(null);
  const [vB, setVB] = useState<number | null>(null);
  const [vC, setVC] = useState<number | null>(null);
  const [iA, setIA] = useState<number | null>(null);
  const [iB, setIB] = useState<number | null>(null);
  const [iC, setIC] = useState<number | null>(null);
  const [paA, setPaA] = useState<number | null>(null);
  const [paB, setPaB] = useState<number | null>(null);
  const [paC, setPaC] = useState<number | null>(null);
  const [prA, setPrA] = useState<number | null>(null);
  const [prB, setPrB] = useState<number | null>(null);
  const [prC, setPrC] = useState<number | null>(null);
  const [fpA, setFpA] = useState<number | null>(null);
  const [fpB, setFpB] = useState<number | null>(null);
  const [fpC, setFpC] = useState<number | null>(null);
  const [phaseNumber, setPhaseNumber] = useState<number>(1);

  const { data: chartData, isLoading: isChartLoading } = useQuery<
    EquipmentChartData[]
  >({
    queryKey: ["equipment-chart", params.id],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get(`/sensor-data/${params.id}/chart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          from: dayjs().startOf('day').toDate(),
          to: dayjs().endOf('day').toDate(),
        }
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const { data, isLoading } = useQuery<EquipmentSchemaType>({
    queryKey: ["equipment", params.id],
    queryFn: async () => {
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
       * Tensão
       */
      socket.on(`${data.mac}/smartclick/tfa`, (res) => {
        setVA(res.data);
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

      /**
       * Potência Aparente
       */
      socket.on(`${data.mac}/smartclick/pafa`, (res) => {
        setPaA(res.data);
      });
      socket.on(`${data.mac}/smartclick/pafb`, (res) => {
        setPaB(res.data);
      });
      socket.on(`${data.mac}/smartclick/pafc`, (res) => {
        setPaC(res.data);
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

  return (
    <div className="space-y-4 my-10">
      <div className="flex flex-col md:grid md:grid-cols-3 gap-5">
        {isLoading ? (
          <EquipmentCardInfoSkeleton />        
        ) : (
          <EquipmentCardInfo value={{ V: vA, I: iA, Pa: paA, Pr: prA, Fp: fpA }} phase="A" />
        )}
        {phaseNumber > 1 ? (
          isLoading ? (
            <EquipmentCardInfoSkeleton />
          ) : (
            <EquipmentCardInfo value={{ V: vB, I: iB, Pa: paB, Pr: prB, Fp: fpB }} phase="B" />
          )
        ) : null}
        {phaseNumber > 2 ? (
          isLoading ? (
            <EquipmentCardInfoSkeleton />
          ) : (
            <EquipmentCardInfo value={{ V: vC, I: iC, Pa: paC, Pr: prC, Fp: fpC }} phase="C" />
          )
        ) : null}
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
            phaseNumber={phaseNumber}
            data={chartData?.map((e) => {
              return {
                date: e.date,
                faseA: e.faseA.v,
                faseB: e.faseB?.v,
                faseC: e.faseC?.v,
              };
            })}
            title="Tensão (V)"
          />
          <EquipInfoGraph
            phaseNumber={phaseNumber}
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
            phaseNumber={phaseNumber}
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
  );
}
