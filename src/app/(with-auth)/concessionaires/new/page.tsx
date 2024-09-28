"use client";

import { newConcessionaireAction } from "@/action/new-concessionaire-action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import useCities from "@/hooks/useCities";
import useConcessionaires from "@/hooks/useConcessionaires";
import useUFs from "@/hooks/useUF";
import {
  NewConcessionaireSchema,
  NewConcessionaireSchemaType,
} from "@/schemas/new-concessionaire.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import NewConcessionaireImage from "public/images/new-concessionaire-image.svg";
import { Button } from "@/components/ui/button";

export default function NewConcessionairePage() {
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

  const form = useForm<NewConcessionaireSchemaType>({
    resolver: zodResolver(NewConcessionaireSchema),
  });

  async function onSubmit(values: NewConcessionaireSchemaType) {
    router.prefetch(Routes.Concessionaires);
    setLoading(true);

    // toast({
    //   title: "Criando...",
    //   description: `A concessionária ${values.name} está sendo criada`,
    //   variant: "loading",
    // });

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
      router.push(Routes.Concessionaires);
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
      <div className="flex flex-col items-center lg:items-start w-full space-y-6">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Cadastrar</span> nova
          concessionária
        </h1>
        <Form {...form}>
          <form
            className="w-full max-w-[500px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        required
                        {...field}
                        label="Concessionária"
                        placeholder="Nome..."
                        invalid={!!form.formState.errors.name}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-5">
                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem className="max-w-24 w-full">
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setUf(
                              ufs?.find((uf) => uf.sigla === value)?.id ?? null
                            );
                          }}
                          defaultValue={field.value}
                          disabled={ufLoading || loading}
                        >
                          <FormControl>
                            <SelectTrigger
                              label="UF"
                              required
                              invalid={!!form.formState.errors.uf}
                            >
                              <SelectValue
                                placeholder={ufLoading ? "Carregando..." : "PA"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ufs &&
                              ufs.map((uf) => (
                                <SelectItem key={uf.sigla} value={uf.sigla}>
                                  {uf.sigla}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="max-w-40 w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={uf === null || citiesLoading || loading}
                        >
                          <FormControl>
                            <SelectTrigger
                              label="Cidade"
                              required
                              invalid={!!form.formState.errors.city}
                            >
                              <SelectValue placeholder="Belém" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities &&
                              cities.map((city) => (
                                <SelectItem key={city.nome} value={city.nome}>
                                  {city.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="solar"
              className="w-full max-w-[500px] mt-12"
              disabled={loading}
              loading={loading}
            >
              Finalizar Cadastro
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        <Image
          className="w-full h-auto max-w-[500px]"
          src={NewConcessionaireImage}
          alt="New Equipment"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Cadastrar</span> nova
        concessionária
      </h1>
    </div>
  );
}
