"use client";
import NewRateImage from "@/../public/images/new-rates-image.svg";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { NewRateSchema, NewRateSchemaType } from "@/schemas/new-rates.schema";
import { DatePicker } from "@/components/ui/date-picker";
import { X } from "lucide-react";
import { Routes } from "@/enums/Routes.enum";
import { newRateAction } from "@/action/new-rate.action";
import useMask from "@/hooks/useMask";
import { formatMoney } from "@/lib/utils";
import AlertNoIntervals from "../components/alertNoIntervals";

export default function NewRatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { handleChange } = useMask({
    mask: "00:00",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCloseAlert = () => {
    setIsOpen(false);
  };

  const form = useForm<NewRateSchemaType>({
    resolver: zodResolver(NewRateSchema),
  });

  function verifyIfIntervalFillsAllDay(intervals: NewRateSchemaType["intervalos_tarifas"]) {
    const sortedIntervals = intervals
    .filter((intervalo) => intervalo.de !== null && intervalo.ate !== null)
    .sort((a, b) => (a.de || 0) - (b.de || 0));

  let isCompleteDayCovered = true;
  let previousEnd = 0;

  for (const intervalo of sortedIntervals) {
    if (intervalo.de! > previousEnd) {
      isCompleteDayCovered = false;
      break;
    }
    previousEnd = intervalo.ate!;
  }

  // Verifica se o último intervalo termina exatamente no final do dia (1440 minutos)
  if (previousEnd !== 1440) {
    isCompleteDayCovered = false;
  }
  console.log(isCompleteDayCovered);
  return isCompleteDayCovered;
}

  async function onSubmit(values: NewRateSchemaType) {

    if(!verifyIfIntervalFillsAllDay(values.intervalos_tarifas)) {
      console.log("Os intervalos de tarifa não cobrem o dia inteiro.");
      toast({
        title: "Erro",
        description: "Os intervalos de tarifa não cobrem o dia inteiro.",
        variant: "destructive",
      });
      return;
    }

    if (values.intervalos_tarifas.length === 0) {
      setIsOpen(true);
      return;
    }

    router.prefetch(Routes.ConcessionaireRates.replace("[id]", id.toString()));
    setLoading(true);
    toast({
      title: "Criando...",
      description: `A tarifa para o dia ${values.dt_tarifa} está sendo criado`,
      variant: "loading",
    });
    const response = await newRateAction(values, id.toString()).finally(() => {
      setLoading(false);
    });

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["concessionaires-rates"] });
      router.push(Routes.ConcessionaireRates.replace("[id]", id.toString()));
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }

  const {
    fields: intervalos,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "intervalos_tarifas",
  });

  return (
    <div className="flex flex-col-reverse items-start lg:grid lg:grid-cols-2 lg:p-14 py-6 gap-9">
      <div className="flex flex-col items-center lg:items-start w-full space-y-6 col-span-1">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Cadastrar</span> nova tarifa
        </h1>

        <AlertNoIntervals open={isOpen} onClose={handleCloseAlert} />

        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full max-w-[500px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row flex-wrap gap-12 w-full sm:gap-5">
                {/* Campo de Valor */}
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          label="Valor Convencional (R$)"
                          {...field}
                          placeholder="R$ 0,00"
                          className="w-full"
                          type="number"
                          onChange={(e) =>
                            field.onChange(formatMoney(Number(e.target.value)))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex flex-row gap-5">
                  {/* Campo de Data */}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo de Subgrupo */}
                  <FormField
                    control={form.control}
                    name="subgrupo"
                    render={({ field }) => (
                      <FormItem className="max-w-24 w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <SelectTrigger
                              label="Subgrupo"
                              required
                              invalid={!!form.formState.errors.subgrupo}
                            >
                              <SelectValue placeholder="A1" />
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
              {/* Intervalos Tarifas */}
              <FormField
                control={form.control}
                name="intervalos_tarifas"
                render={() => (
                  <div className="flex flex-col gap-5 max-h-80 overflow-y-auto">
                    {intervalos.map((field, index) => (
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
                            className="w-full"
                            maxLength={5}
                            onInput={handleChange}
                          />
                          <FormMessage />

                          <p className="text-base text-black/50">até</p>

                          {/* Campo de "Até" */}
                          <Input
                            placeholder="00:00"
                            {...form.register(
                              `intervalos_tarifas.${index}.ate`
                            )}
                            disabled={loading}
                            className="w-full"
                            maxLength={5}
                            onInput={handleChange}
                          />
                          <FormMessage />
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                          {/* Campo de Valor do Intervalo */}
                          <Input
                            label="Valor do intervalo"
                            placeholder="R$ 0,00"
                            // {...form.register(`intervalos_tarifas.${index}.valor`, {
                            //   setValueAs: (value) => value === "" ? undefined : Number(value), // Converte a string para número
                            // })}
                            {...form.register(
                              `intervalos_tarifas.${index}.valor`
                            )}
                            onChange={(e) =>
                              form.setValue(
                                `intervalos_tarifas.${index}.valor`,
                                formatMoney(Number(e.target.value))
                              )
                            }
                            disabled={loading}
                            className="w-full"
                            step="0.01"
                            type="number"
                          />
                          <FormMessage />

                          {/* Campo de Tipo */}
                          <FormField
                            control={form.control}
                            name={`intervalos_tarifas.${index}.tipo`}
                            render={({ field, fieldState }) => (
                              <FormItem className="max-w-xs w-full">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? ""}
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
                                <FormMessage />
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
              Finalizar Cadastro
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
