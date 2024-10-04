"use client";
import { editRateAction } from "@/action/edit-rate.action";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { NewRateSchema, NewRateSchemaType } from "@/schemas/new-rates.schema";
import { IntervalosTarifa, Rates } from "@/types/rates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Routes } from "@/enums/Routes.enum";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import NewRateImage from "@/../public/images/new-rates-image.svg";
import { convertMinutesToTimeString } from "@/lib/utils";
import useMask from "@/hooks/useMask";

export default function EditRateEdit({ data }: { data: Rates }) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const { handleChange } = useMask({
    mask: "00:00",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<NewRateSchemaType>({
    defaultValues: {
      dt_tarifa: new Date(data.dt_tarifa),
      subgrupo: data.subgrupo,
      valor: data.valor,
      intervalos_tarifas: data.intervalos_tarifas.flatMap((intervalo) => {
        return {
          de: convertMinutesToTimeString(intervalo.de),
          ate: convertMinutesToTimeString(intervalo.ate),
          valor: intervalo.valor,
          tipo: intervalo.tipo,
        };
      }),
    },
    resolver: zodResolver(NewRateSchema),
  });

  async function onSubmit(values: NewRateSchemaType) {
    router.prefetch(
      Routes.ConcessionaireRates.replace("[id]", params.id.toString())
    );
    setLoading(true);
    toast({
      title: "Editando tarifa...",
      description: `A tarifa para o dia ${values.dt_tarifa} está sendo editada.`,
      variant: "loading",
    });

    const response = await editRateAction(
      values,
      params.id.toString(),
      params.ratesId.toString()
    );

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["rates", params.id] });
      queryClient.invalidateQueries({ queryKey: ["rates-interval", data.cod_tarifa] });
      router.push(
        Routes.ConcessionaireRates.replace("[id]", params.id.toString())
      );
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "intervalos_tarifas",
  });

  return (
    <div className="flex flex-col-reverse items-start lg:grid lg:grid-cols-2 lg:p-14 py-6 gap-9">
      <div className="flex flex-col items-center lg:items-start w-full space-y-6 col-span-1">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Edição</span> de tarifa
        </h1>
        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full max-w-[500px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row flex-wrap gap-12 w-full sm:gap-5">
                {/* Valor */}
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="Valor Convencional (R$)"
                          {...field}
                          invalid={!!form.formState.errors.valor}
                          disabled={loading}
                          className="w-full"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data */}
                <div className="w-full flex flex-row gap-5">
                  <FormField
                    control={form.control}
                    name="dt_tarifa"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <DatePicker
                            label="Data da tarifa"
                            placeholder="XX/XX/XXXX"
                            date={field.value}
                            setDate={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage>
                          {fieldState.error ? fieldState.error.message : null}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Subgrupo */}
                  <FormField
                    control={form.control}
                    name="subgrupo"
                    render={({ field }) => (
                      <FormItem className="max-w-24 w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={loading}
                          >
                            <SelectTrigger
                              label="Subgrupo"
                              invalid={!!form.formState.errors.subgrupo}
                            >
                              <SelectValue placeholder={data.subgrupo} />
                            </SelectTrigger>
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
              </div>

              {/* Intervalos */}
              <FormField
                control={form.control}
                name="intervalos_tarifas"
                render={() => (
                  <div className="flex flex-col gap-5 max-h-80 overflow-y-auto">
                    {/* Resgatando os intervalos pré-existentes */}
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border rounded p-4 space-y-4 bg-secondary"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-black/50">
                            Intervalo {index + 1}
                          </p>
                          <Button
                            onClick={() => remove(index)}
                            variant="ghost"
                            className="p-0 h-6 hover:bg-transparent"
                          >
                            <X />
                          </Button>
                        </div>

                        <div className="flex gap-4 items-center">
                          {/* Campo de "De" */}
                          <Input
                            placeholder="00:00"
                            {...form.register(`intervalos_tarifas.${index}.de`)}
                            disabled={loading}
                            defaultValue={field.de ?? ""} // Corrigido para `field.de`
                            className="w-full"
                            onInput={handleChange}
                          />
                          <FormMessage>
                            {
                              form.formState.errors.intervalos_tarifas?.[index]
                                ?.de?.message
                            }
                          </FormMessage>

                          <p className="text-base text-black/50">até</p>

                          {/* Campo de "Até" */}
                          <Input
                            placeholder="00:00"
                            {...form.register(
                              `intervalos_tarifas.${index}.ate`
                            )}
                            disabled={loading}
                            defaultValue={field.ate ?? ""} // Corrigido para `field.ate`
                            className="w-full"
                            onInput={handleChange}
                          />
                          <FormMessage>
                            {
                              form.formState.errors.intervalos_tarifas?.[index]
                                ?.ate?.message
                            }
                          </FormMessage>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                          {/* Campo de Valor do Intervalo */}
                          <Input
                            label="Valor do intervalo"
                            placeholder="R$ 0,00"
                            {...form.register(
                              `intervalos_tarifas.${index}.valor`
                            )}
                            disabled={loading}
                            defaultValue={field.valor ?? ""} // Corrigido para `field.valor`
                            className="w-full"
                            type="number"
                          />
                          <FormMessage>
                            {
                              form.formState.errors.intervalos_tarifas?.[index]
                                ?.valor?.message
                            }
                          </FormMessage>

                          {/* Campo de Tipo */}
                          <FormField
                            control={form.control}
                            name={`intervalos_tarifas.${index}.tipo`}
                            render={({ field, fieldState }) => (
                              <FormItem className="max-w-xs w-full">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? ""} // Resgata o valor pré-existente
                                    disabled={loading}
                                  >
                                    <SelectTrigger label="Tipo de intervalo">
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="FORA_DE_PONTA">
                                        Fora de ponta
                                      </SelectItem>
                                      <SelectItem value="PONTA">
                                        Ponta
                                      </SelectItem>
                                      <SelectItem value="INTERMEDIARIA">
                                        Intermediária
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage>
                                  {fieldState.error
                                    ? fieldState.error.message
                                    : null}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />

              <Button
                onClick={() =>
                  append({
                    ate: null,
                    de: null,
                    valor: null,
                    tipo: "",
                  })
                }
                variant="secondary"
                type="button"
                className="text-black self-center justify-self-center"
              >
                Adicionar Intervalo
              </Button>
            </div>

            <Button
              type="submit"
              variant="solar"
              className="w-full max-w-[500px]"
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
          src={NewRateImage}
          alt="New Equipment"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Cadastrar</span> nova tarifa
      </h1>
    </div>
  );
}
