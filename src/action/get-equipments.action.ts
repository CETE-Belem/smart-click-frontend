"use server";

import { api } from "@/lib/axios";
import { Equipments } from "../app/(with-auth)/dashboard/equipments/types/equipments";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export interface GetEquipmentsResponse {
  limit: number;
  page: number;
  totalPages: number;
  totalEquipments: number;
  equipments: Equipments[];
}

export async function getEquipmentsAction(
  page: number,
  limit: number
): Promise<GetEquipmentsResponse | any> {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetEquipmentsResponse>(
    `/equipments?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
}
