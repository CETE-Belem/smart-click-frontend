import { apiClient } from "@/lib/axios-client";
import { IUser } from "@/types/IUser";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type UserOptions = {};

export default function useUser(options?: UserOptions) {
  const cookies = useCookies();
  const token = cookies.get("token");

  const { data: user, isLoading } = useQuery<IUser>({
    queryKey: ["user", token],
    queryFn: async () => {
      const response = await apiClient.get<IUser>(`/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return { user, loading: isLoading };
}
