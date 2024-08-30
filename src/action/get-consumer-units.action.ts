"use server";

import { api } from '@/lib/axios';
import { ConsumerUnit } from '@/types/unidade-consumidora'
import { cookies } from 'next/headers';

export interface GetConsumerUnitsResponse {
    limit: number;
    page: number;
    totalPages: number
    totalConsumerUnits: number;
    consumerUnits: ConsumerUnit[];
}

export async function getConsumerUnitsAction(
    page:number,
    limit: number
): Promise<GetConsumerUnitsResponse | any> {
    const token = cookies().get("token")?.value;
    const data = await api.get<GetConsumerUnitsResponse>(
        `/consumer-units?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
    return data;
}