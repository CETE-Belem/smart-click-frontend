"use client";
import NewEquipmentImage from "@/../public/images/new-equipment-image.svg";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  NewEquipmentSchema,
  NewEquipmentSchemaType,
} from "@/schemas/new-equipment.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input, { InputIcon } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CiCircleInfo } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useMask from "@/hooks/useMask";
import useUfs from "@/hooks/useUF";
import useCities from "@/hooks/useCities";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Routes } from "@/enums/Routes.enum";
import useUserStore from "@/store/user.store";
import { Role } from "@/enums/Role.enum";
import { Equipments } from "@/types/equipments";
import {
  adminEditEquipmentAction,
  userEditEquipmentAction,
} from "@/action/edit-equipment.action";

export default function EditEquipmentForm({ data }: { data: Equipments }) {
  const { handleChange: handleMACInputChange } = useMask({
    mask: "00:00:00:00:00:00",
  });
  const { ufs, loading: ufLoading } = useUfs();
  const [ufId, setUfId] = useState<number | null>(null);
  const { cities, loading: citiesLoading } = useCities({
    fetchAll: false,
    ufId: ufId,
  });
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.perfil === Role.ADMIN;

  const form = useForm<NewEquipmentSchemaType>({
    defaultValues: {
      name: data?.nome,
      description: data?.descricao,
      mac: data?.mac,
      consumerUnityNumber: data?.unidade_consumidora.numero,
      uf: data?.uf,
      city: data?.cidade,
      monitoredPhases: data?.fases_monitoradas as
        | "MONOFASE"
        | "BIFASE"
        | "TRIFASE",
      ratedVoltage: data?.tensao_nominal.toString(),
    },
    resolver: zodResolver(NewEquipmentSchema),
  });

  useEffect(() => {
    if (ufs && !ufId) {
      setUfId(ufs.find((uf) => uf.sigla === data.uf)!.id);
      return;
    }

    if (ufs) {
      const newUfId = ufs.find(
        (uf) =>
          uf.sigla === ufs.find((ufSelected) => ufSelected.id === ufId)?.sigla
      )?.id;

      setUfId(newUfId!);
    }
  }, [ufId, ufs]);

  async function onSubmit(values: NewEquipmentSchemaType) {
    router.prefetch(Routes.Equipments);
    setLoading(true);
    let response: any = null;
    if (user?.perfil === Role.ADMIN) {
      response = await adminEditEquipmentAction(
        values,
        params.id.toString()
      ).finally(() => {
        setLoading(false);
      });
    } else {
      response = await userEditEquipmentAction(
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
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipment", params.id] });
      router.push(Routes.Equipments);
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
          <span className="text-solaris-primary">Editar</span> equipamento
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
                        label="Nome do equipamento"
                        placeholder="Nome..."
                        invalid={!!form.formState.errors.name}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAdmin && (
                <div className="flex flex-row flex-wrap gap-3 w-full sm:gap-5">
                  <FormField
                    control={form.control}
                    name="mac"
                    render={({ field }) => (
                      <FormItem className="max-w-40">
                        <FormControl>
                          <Input
                            required
                            {...field}
                            label="Endereço MAC"
                            placeholder="00:00:00:00:00:00"
                            maxLength={17}
                            onInput={handleMACInputChange}
                            invalid={!!form.formState.errors.mac}
                            disabled={loading || !isAdmin}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consumerUnityNumber"
                    render={({ field }) => (
                      <FormItem className="max-w-40">
                        <FormControl>
                          <Input
                            required
                            {...field}
                            label="Unidade Consumidora"
                            placeholder="0 0 0 0 0 0 0 0"
                            maxLength={8}
                            iterativeIcon={
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <InputIcon icon={CiCircleInfo} />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-[#999] text-white px-6 py-4">
                                    <ul className="list-disc text-xs">
                                      <li>Número da sua unidade consumidora</li>
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            }
                            invalid={
                              !!form.formState.errors.consumerUnityNumber
                            }
                            disabled={loading || !isAdmin}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="max-w-[500px]">
                    <FormControl>
                      <Textarea
                        invalid={!!form.formState.errors.description}
                        variant="solar"
                        label="Descrição"
                        {...field}
                        placeholder="Adicione a descrição do equipamento..."
                        className="h-28"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAdmin && (
                <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-5">
                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem className="max-w-40 w-full">
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setUfId(
                                ufs?.find((uf) => uf.sigla === value)?.id ??
                                  null
                              );
                            }}
                            defaultValue={field.value}
                            disabled={ufLoading || loading || !isAdmin}
                          >
                            <FormControl>
                              <SelectTrigger
                                label="UF"
                                required
                                invalid={!!form.formState.errors.uf}
                              >
                                <SelectValue
                                  placeholder={
                                    ufLoading ? "Carregando..." : "PA"
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
                            disabled={
                              ufId === null ||
                              citiesLoading ||
                              loading ||
                              !isAdmin
                            }
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
              )}
              {isAdmin && (
                <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-5">
                  <FormField
                    control={form.control}
                    name="monitoredPhases"
                    render={({ field }) => (
                      <FormItem className="max-w-40 w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger
                                required
                                label="Fase monitorada"
                                invalid={
                                  !!form.formState.errors.monitoredPhases
                                }
                              >
                                <SelectValue placeholder="Monofásico" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MONOFASE">
                                Monofásico
                              </SelectItem>
                              <SelectItem value="BIFASE">Bifásico</SelectItem>
                              <SelectItem value="TRIFASE">Trifásico</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ratedVoltage"
                    render={({ field }) => (
                      <FormItem className="max-w-40 w-full">
                        <FormControl>
                          <Input
                            required
                            {...field}
                            type="number"
                            label="Tensão nominal (V)"
                            placeholder="127"
                            invalid={!!form.formState.errors.ratedVoltage}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="solar"
              className="w-full max-w-[500px] mt-12"
              disabled={loading}
              loading={loading}
            >
              Finalizar Edição
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        <Image
          className="w-full h-auto max-w-[500px]"
          src={NewEquipmentImage}
          alt="Editar Equipamento"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Editar</span> equipamento
      </h1>
    </div>
  );
}
