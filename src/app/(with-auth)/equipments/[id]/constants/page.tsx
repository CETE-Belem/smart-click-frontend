"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { apiClient } from "@/lib/axios-client";
import { cn } from "@/lib/utils";
import { EquipmentSchemaType } from "@/schemas/equipment.schema";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Power } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function EquipmentConstantsPage() {
  const { id } = useParams();
  const cookies = useCookies();
  const [vA, setVA] = useState<number | null>(null);
  const [vB, setVB] = useState<number | null>(null);
  const [vC, setVC] = useState<number | null>(null);
  const [iA, setIA] = useState<number | null>(null);
  const [iB, setIB] = useState<number | null>(null);
  const [iC, setIC] = useState<number | null>(null);
  const [ccA, setCCA] = useState<number | null>(null);
  const [ccB, setCCB] = useState<number | null>(null);
  const [ccC, setCCC] = useState<number | null>(null);
  const [ctA, setCTA] = useState<number | null>(null);
  const [ctB, setCTB] = useState<number | null>(null);
  const [ctC, setCTC] = useState<number | null>(null);
  const [online, setOnline] = useState<boolean>(false);

  const { data, isLoading } = useQuery<EquipmentSchemaType>({
    queryKey: ["equipment", id],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get(`/equipments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const token = cookies.get("token");
    const socket = io("wss://smartclick.zenithinova.com.br", {
      path: "/api/socket.io",
      extraHeaders: {
        authorization: `bearer ${token}`,
      },
    });
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("getConstants", JSON.stringify({ id }));
    });

    socket.on(`constants-${id}`, (data) => {
      setCCA(+data.ccfa);
      setCCB(+data.ccfb);
      setCCC(+data.ccfc);
      setCTA(+data.ctfa);
      setCTB(+data.ctfb);
      setCTC(+data.ctfc);
    });
    if (data) {
      /**
       * Tensão
       */
      socket.on(`${data.mac}/smartclick/tfa`, (res) => {
        setOnline(true);
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

      socket.on(`${data.mac}/smartclick/last_will`, (res) => {
        setOnline(res.data === "offline" ? false : true);
      });
    }
  }, [id, data]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="flex-1 flex">
        <CardHeader className="flex gap-2 space-y-3 border-b py-5 flex-1">
          <CardTitle className="w-full mb-4">
            <div className="flex gap-5 items-center justify-between">
              Informações do equipamento - {data?.nome}
              <div
                className={cn("flex gap-1 items-center text-[#96B562]", {
                  "text-[#F87171]": !online,
                })}
              >
                <Power width={14} height={14} />
                <p className="text-xs">{online ? "Ligado" : "Desligado"}</p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="grid grid-cols-3 gap-8 w-full justify-between items-center">
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{vA ?? "-"}</p>
                <p className="text-2xs">Fase A - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{vB ?? "-"}</p>
                <p className="text-2xs">Fase B - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{vC ?? "-"}</p>
                <p className="text-2xs">Fase C - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ctA ?? "-"}</p>
                <p className="text-2xs">Constante Fase A - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ctB ?? "-"}</p>
                <p className="text-2xs">Constante Fase B - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ctC ?? "-"}</p>
                <p className="text-2xs">Constante Fase C - Tensão (V)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{iA ?? "-"}</p>
                <p className="text-2xs">Fase A - Corrente (A)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{iB ?? "-"}</p>
                <p className="text-2xs">Fase B - Corrente (A)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{iC ?? "-"}</p>
                <p className="text-2xs">Fase C - Corrente (A)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ccA ?? "-"}</p>
                <p className="text-2xs">Constante Fase A - Corrente (A)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ccB ?? "-"}</p>
                <p className="text-2xs">Constante Fase B - Corrente (A)</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl">{ccC ?? "-"}</p>
                <p className="text-2xs">Constante Fase C - Corrente (A)</p>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
