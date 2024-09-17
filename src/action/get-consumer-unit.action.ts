"use server";

import { api } from "@/lib/axios";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { cookies } from "next/headers";
import { GetEquipmentsResponse } from "./get-equipments.action";

export interface GetConsumerUnitResponse {
  consumerUnits: ConsumerUnit;
}

export async function getConsumerUnitAction(
  id: string
): Promise<GetConsumerUnitResponse | any> {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetConsumerUnitResponse>(`/consumer-units/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export async function getConsumerUnitEquipmentsAction(
  id: string,
  page: number,
  limit: number,
  query: string
): Promise<GetEquipmentsResponse | any> {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetEquipmentsResponse>(`/consumer-units/${id}/equipments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      query
    },
  }).catch((error) =>{
    console.log(error.response.data);
  })
  return data;
}
