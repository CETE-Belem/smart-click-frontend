'use server'

import { api } from "@/lib/axios"
import { IUser } from "@/types/IUser"
import { cookies } from "next/headers"

export interface GetUsersResponse {
    limit: number;
    page: number;
    totalPages: number
    totalUsers: number;
    users: IUser[];
}

export  async function GetUsersAction(
    page: number,
    limit: number
): Promise<GetUsersResponse | any> {
    const token = cookies().get("token")?.value
    const  data = await api.get<GetUsersResponse>(
        `/users?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return data
}