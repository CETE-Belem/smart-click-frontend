"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { Equipments } from "@/types/equipments";

export interface GetEquipmentResponse {
  equipment: Equipments;
}

export async function getEquipmentAction(
  id: string
): Promise<GetEquipmentResponse> {
  const token = cookies().get("token")?.value;
  const response = await api.get<GetEquipmentResponse>(`/equipments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
