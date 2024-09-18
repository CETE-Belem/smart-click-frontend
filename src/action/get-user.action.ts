"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { IUser } from "@/types/IUser";

export interface GetUserResponse {
  user: IUser;
}

export async function GetUserAction(
  id: string
): Promise<GetUserResponse | any> {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetUserResponse>(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
