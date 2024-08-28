"use client";
import { newConsumerUnitAction } from "@/action/new-consumer-unit-action.action";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import useCities from "@/hooks/useCities";
import useMask from "@/hooks/useMask";
import useUFs from "@/hooks/useUF";
import {
  NewConsumerUnitSchema,
  NewConsumerUnitSchemaType,
} from "@/schemas/new-consumer-unit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewConsumerUnitPage() {
  const { handleChange: handleMACInputChange } = useMask({
    mask: "00:00:00:00:00:00",
  });
  const { ufs, loading: ufLoading } = useUFs();
  const [uf, setUf] = useState<number | null>(null);
  const { cities, loading: citiesLoading } = useCities({
    fetchAll: false,
    ufId: uf,
  });
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<NewConsumerUnitSchemaType>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(NewConsumerUnitSchema),
  });

  async function onSubmit(values: NewConsumerUnitSchemaType) {
    router.prefetch(Routes.ConsumerUnit);
    setLoading(true);
    const response = await newConsumerUnitAction(values).finally(() => {
      setLoading(false);
    });

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["consumerUnit"] });
      router.push(Routes.ConsumerUnit);
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }

  return <h1>Cadastrar unidade</h1>;
}
