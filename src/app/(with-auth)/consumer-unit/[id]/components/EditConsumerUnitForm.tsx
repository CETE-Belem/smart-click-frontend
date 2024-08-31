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
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";

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
  const { concessionaires, loading: isLoadingConcessionaires } =
    useConcessionaires();

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

  useEffect(() => {
    const selectedSubGroup = form.watch("subGroup");
    const selectedA = selectedSubGroup.startsWith("A");
    form.setValue("optanteTB", !selectedA);
  }, [form.watch("subGroup")]);

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
        <Form {...form}>
          <form
            className="w-full max-w-[500px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-5">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="max-w-96">
                      <FormControl>
                        <Input
                          required
                          {...field}
                          label="Número da unidade consumidora"
                          placeholder={data.numero}
                          invalid={!!form.formState.errors.number}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subGroup"
                  render={({ field }) => (
                    <FormItem className="max-w-24 w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger
                              label="Subgrupo"
                              required
                              invalid={!!form.formState.errors.subGroup}
                            >
                              <SelectValue placeholder={data.subgrupo} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A1">A1</SelectItem>
                            <SelectItem value="A2">A2</SelectItem>
                            <SelectItem value="A3">A3</SelectItem>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="A3a">A3a</SelectItem>
                            <SelectItem value="AS">AS</SelectItem>
                            <SelectSeparator />
                            <SelectItem value="B1">B1</SelectItem>
                            <SelectItem value="B2">B2</SelectItem>
                            <SelectItem value="B3">B3</SelectItem>
                            <SelectItem value="B4">B4</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                                placeholder={
                                  ufLoading ? "Carregando..." : data.uf
                                }
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
                              <SelectValue placeholder={data.cidade} />
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
              <FormField
                control={form.control}
                name="cod_concessionaire"
                render={({ field }) => (
                  <FormItem className="max-w-[500px] w-full">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingConcessionaires}
                      >
                        <FormControl>
                          <SelectTrigger
                            label="Concessionária"
                            required
                            invalid={!!form.formState.errors.subGroup}
                          >
                            <SelectValue
                              placeholder={data.concessionaria.nome}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {concessionaires.map((concessionaire) => (
                            <SelectItem
                              key={concessionaire.cod_concessionaria}
                              value={concessionaire.cod_concessionaria}
                            >
                              {`${concessionaire.nome} - ${concessionaire.cidade}/${concessionaire.uf}`}
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
                name="optanteTB"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <div className="flex flex-row gap-2 items-center">
                        <Checkbox
                          id="confirm"
                          checked={
                            form.watch("subGroup").startsWith("A")
                              ? field.value
                              : field.value === true
                          }
                          onCheckedChange={field.onChange}
                          disabled={!form.watch("subGroup").startsWith("A")}
                        />
                        <label htmlFor="confirm" className="text-sm">
                          Opção de faturamento pelo grupo tarifário B
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
