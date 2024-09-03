"use client";

import { newConcessionaireAction } from "@/action/new-concessionaire-action";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import useCities from "@/hooks/useCities";
import useConcessionaires from "@/hooks/useConcessionaires";
import {
  NewConcessionaireSchema,
  NewConcessionaireSchemaType,
} from "@/schemas/new-concessionaire.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function NewConcessionairePage() {
  const [uf, setUf] = useState<number | null>(null);
  const { cities, loading: citiesLoading } = useCities({
    fetchAll: false,
    ufId: uf,
  });
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { concessionaires, loading: isLoadingConcessionaires } =
    useConcessionaires();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<NewConcessionaireSchemaType>({
    resolver: zodResolver(NewConcessionaireSchema),
  });

  async function onSubmit(values: NewConcessionaireSchemaType) {
    setLoading(true);

    const response = await newConcessionaireAction(values).finally(() => {
      setLoading(false);
    });

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["concessionaires"] });
      router.push(Routes.Concessionaire);
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }
}
