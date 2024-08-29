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


const chartData = [
  { date: "2024-08-29T16:00:00.000Z", faseA: 222, faseB: 150, faseC: 100 },
  { date: "2024-08-29T16:05:00.000Z", faseA: 97, faseB: 180, faseC: 120 },
  { date: "2024-08-29T16:10:00.000Z", faseA: 167, faseB: 120, faseC: 90 },
  { date: "2024-08-29T16:15:00.000Z", faseA: 242, faseB: 260, faseC: 180 },
  { date: "2024-08-29T16:20:00.000Z", faseA: 373, faseB: 290, faseC: 200 },
  { date: "2024-08-29T16:25:00.000Z", faseA: 301, faseB: 340, faseC: 250 },
  { date: "2024-08-29T16:30:00.000Z", faseA: 245, faseB: 180, faseC: 130 },
  { date: "2024-08-29T16:35:00.000Z", faseA: 409, faseB: 320, faseC: 220 },
  { date: "2024-08-29T16:40:00.000Z", faseA: 59, faseB: 110, faseC: 80 },
  { date: "2024-08-29T16:45:00.000Z", faseA: 261, faseB: 190, faseC: 140 },
  { date: "2024-08-29T16:50:00.000Z", faseA: 327, faseB: 350, faseC: 260 },
  { date: "2024-08-29T16:55:00.000Z", faseA: 292, faseB: 210, faseC: 150 },
  { date: "2024-08-29T17:00:00.000Z", faseA: 342, faseB: 380, faseC: 280 },
  { date: "2024-08-29T17:05:00.000Z", faseA: 137, faseB: 220, faseC: 160 },
  { date: "2024-08-29T17:10:00.000Z", faseA: 120, faseB: 170, faseC: 110 },
];

export default function EquipmentInfo() {
  const params = useParams();
  const cookies = useCookies();
  const [vA, setVA] = useState<number | null>(null);
  const [vB, setVB] = useState<number | null>(null);
  const [vC, setVC] = useState<number | null>(null);
  const [iA, setIA] = useState<number | null>(null);
  const [iB, setIB] = useState<number | null>(null);
  const [iC, setIC] = useState<number | null>(null);
  const [pA, setPA] = useState<number | null>(null);
  const [pB, setPB] = useState<number | null>(null);
  const [pC, setPC] = useState<number | null>(null);



  const { data, isLoading } = useQuery<EquipmentSchemaType>({
    queryKey: ["equipment", params.id],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get(
        `/equipments/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
  const token = cookies.get('token');
  useEffect(() => {
    if(data){
      const socket = io("ws://localhost:3000/", {
        extraHeaders: {
          authorization: `bearer ${token}`
        }
      });
      /**
       * Tensão
       */
      socket.on(`${data.mac}/smartclick/tfa`, (res) => {
        setVA(res.data);
      })
      socket.on(`${data.mac}/smartclick/tfb`, (res) => {
        setVB(res.data);
      })
      socket.on(`${data.mac}/smartclick/tfc`, (res) => {
        setVC(res.data);
      })

      /**
       * Corrente
       */
      socket.on(`${data.mac}/smartclick/cfa`, (res) => {
        setIA(res.data);
      })
      socket.on(`${data.mac}/smartclick/cfb`, (res) => {
        setIB(res.data);
      })
      socket.on(`${data.mac}/smartclick/cfc`, (res) => {
        setIC(res.data);
      })

      /**
       * Potência
       */
      socket.on(`${data.mac}/smartclick/prfa`, (res) => {
        setPA(res.data);
      })
      socket.on(`${data.mac}/smartclick/prfb`, (res) => {
        setPB(res.data);
      })
      socket.on(`${data.mac}/smartclick/prfc`, (res) => {
        setPC(res.data);
      })
    }
  }, [data, token])

  return (
    <div className="space-y-4 my-10">
      <div className="flex flex-col md:grid md:grid-cols-3 gap-5">
        <EquipmentCardInfo value={{V: vA, I: iA, P: pA}} phase="A" />
        <EquipmentCardInfo value={{V: vB, I: iB, P: pB}} phase="B" />
        <EquipmentCardInfo value={{V: vC, I: iC, P: pC}} phase="C" />
      </div>
      <EquipInfoGraph data={chartData} title="Tensão (V)"/>
      <EquipInfoGraph data={chartData} title="Corrente (A)"/>
      <EquipInfoGraph data={chartData} title="Potência (W)"/>
    </div>
  );
}
