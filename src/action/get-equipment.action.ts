"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { Equipments } from "@/types/equipments";

export async function getEquipmentAction(id: string): Promise<Equipments> {
  const token = cookies().get("token")?.value;
  const response = await api.get(`/equipments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
