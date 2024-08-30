"use client";
import { useState, useEffect } from "react";
import useUfs from "@/hooks/useUF";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import useCities from "@/hooks/useCities";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user.store";
import { Role } from "@/enums/Role.enum";
import { useForm } from "react-hook-form";
import {
  NewConsumerUnitSchema,
  NewConsumerUnitSchemaType,
} from "@/schemas/new-consumer-unit.schema";
import useConcessionaires from "@/hooks/useConcessionaires";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditConsumerUnitForm({ data }: { data: ConsumerUnit }) {
  const { ufs, loading: ufLoading } = useUfs();
  const [uf, setUf] = useState<number | null>(null);
  const { cities, loading: citiesLoading } = useCities({
    fetchAll: false,
    ufId: uf,
  });
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();

  const [loadingHere, setLoadingHere] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.perfil === Role.ADMIN;

  const { concessionaireOptions, loading, error } = useConcessionaires();

  const dynamicSchema = NewConsumerUnitSchema.extend({
    cod_concessionaire: z.enum(concessionaireOptions as [string, ...string[]], {
      message: "Concessionária inválida",
    }),
  });

  const form = useForm<NewConsumerUnitSchemaType>({
    defaultValues: {
      number: data.numero,
      city: data.cidade,
      uf: data.uf,
      subGroup: data.subgrupo,
      cod_concessionaire: data.cod_concessionaria,
    },
    resolver: zodResolver(dynamicSchema),
  });

  return <h1>oi</h1>;
}
