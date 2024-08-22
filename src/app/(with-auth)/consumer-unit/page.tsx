"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetConsumerUnitResponse } from "@/action/get-consumer-unit.action";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { Routes } from "@/enums/Routes.enum";
import { Role } from "@/enums/Role.enum";
import { apiClient } from "@/lib/axios-client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCookies } from "next-client-cookies";

// Components
import { CirclePlus, Trash2, Filter } from "lucide-react";
import SearchInput from "@/components/search";
import TotalCountData from "@/components/total-count-data";
import { Button } from "@/components/ui/button";
import CardView from "@/components/card-view";
import useUserStore from "@/store/user.store";

export default function ConsumerUnitPage() {
  const cookies = useCookies();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const pageIndex = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const perPage = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 5;

  const query = searchParams.get("query") ?? "";

  const { data, isLoading } = useQuery<GetConsumerUnitResponse>({
    queryKey: ["consumerUnit", pageIndex, perPage, query],
    queryFn: async () => {
      const token = cookies.get("token");
      const response = await apiClient.get<GetConsumerUnitResponse>(
        `/consumer-unit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: pageIndex,
            limit: perPage,
            query,
          },
        }
      );

      return response.data;
    },

    placeholderData: keepPreviousData,
  });

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-row justify-between">
        <Button variant={"solar"} className="w-fit flex" asChild>
          <Link href={Routes.ConsumerUnitNew}>
            <CirclePlus size={24} className="mr-2" />
            <p className="text-sm font-bold text-white">
              Nova unidade <br /> consumidora
            </p>
          </Link>
        </Button>

        <Button variant="link" className="w-fit p-3">
          <Filter
            size={24}
            className="fill-white stroke-solaris-primary hover:fill-solaris-primary"
          />
        </Button>

        <Button className="w-fit bg-destructive-foreground border border-solid border-destructive rounded-full p-3">
          <Trash2 size={24} className="text-destructive" />
        </Button>
      </div>

      <SearchInput />

      <div className="w-full flex flex-col gap-12">
        <TotalCountData label="Resultados de pesquisa " />
        <CardView<ConsumerUnit>
          accessorKey="cod_unidade_consumidora"
          canEdit
          canDelete={user?.perfil === Role.ADMIN}
        />
      </div>
    </div>
  );
}
