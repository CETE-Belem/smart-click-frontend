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
import { Routes } from "@/enums/Routes.enum";
import { adminEditConsumerUnitAction } from "@/action/edit-consumer-unit.action";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import EditConsumerUnit from "public/images/new-consumer-unit-image.svg";

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

  const [loading, setLoading] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.perfil === Role.ADMIN;

  const form = useForm<NewConsumerUnitSchemaType>({
    defaultValues: {
      number: data.numero,
      city: data.cidade,
      uf: data.uf,
      subGroup: data.subgrupo,
      cod_concessionaire: data.cod_concessionaria,
    },
    resolver: zodResolver(NewConsumerUnitSchema),
  });

  useEffect(() => {
    if (data?.uf) {
      const ufId = ufs?.find((uf) => uf.sigla === data.uf)?.id;
      ufId && setUf(ufId);
    }
  }, [uf, ufs]);

  async function onSubmit(values: NewConsumerUnitSchemaType) {
    router.prefetch(Routes.ConsumerUnit);
    setLoading(true);
    let response: any = null;
    if (user?.perfil === Role.ADMIN) {
      response = await adminEditConsumerUnitAction(
        values,
        params.id.toString()
      ).finally(() => {
        setLoading(false);
      });
    } else {
      response = await adminEditConsumerUnitAction(
        values,
        params.id.toString()
      ).finally(() => {
        setLoading(false);
      });
    }

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["consumerUnit"] });
      queryClient.invalidateQueries({ queryKey: ["consumerUnit", params.id] });
      router.push(Routes.ConsumerUnit);
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col-reverse items-center lg:grid lg:grid-cols-2 lg:p-14 py-6 gap-9">
      <div className="flex flex-col items-center lg:items-start w-full space-y-6 col-span-1">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Editar</span> unidade
          consumidora
        </h1>
        <Form {...form}></Form>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        <Image
          src={EditConsumerUnit}
          className="w-full h-auto max-w-[500px]"
          alt="Editar Equipamento"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Editar</span> unidade consumidora
      </h1>
    </div>
  );
}
