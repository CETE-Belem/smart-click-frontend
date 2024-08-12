"use client";
import NewEquipmentImage from "@/../public/images/new-equipment-image.svg";
import Image from "next/image";
import { z } from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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

export default function NewEquipmentPage() {
  const form = useForm<NewEquipmentSchemaType>({
    resolver: zodResolver(NewEquipmentSchema),
  });

  function onSubmit(values: NewEquipmentSchemaType) {
    console.log(values);
  }

  return (
    <div className="grid grid-cols-2 p-14 gap-9">
      <div className="flex flex-col w-full space-y-6">
        <h1 className="text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Cadastrar</span> novo
          equipamento
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        {...field}
                        label="Nome do equipamento"
                        placeholder="Nome..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:max-w-80 lg:gap-5">
                <FormField
                  control={form.control}
                  name="mac"
                  render={({ field }) => (
                    <FormItem className="max-w-40">
                      <FormControl>
                        <Input
                          {...field}
                          label="Endereço MAC"
                          placeholder="00:00:00:00:00:00"
                        />
                      </FormControl>
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
                          {...field}
                          label="Unidade Consumidora"
                          placeholder="0 0 0 0 0 0 0 0"
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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="max-w-[500px]">
                    <FormControl>
                      <Textarea
                        variant="solar"
                        label="Descrição"
                        {...field}
                        placeholder="Adicione a descrição do equipamento..."
                        className="h-28"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:max-w-80 lg:gap-5">
                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem className="max-w-40">
                      <FormControl>
                        <Input {...field} label="UF" placeholder="PA" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="max-w-40">
                      <FormControl>
                        <Input {...field} label="Cidade" placeholder="Belém" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:max-w-80 lg:gap-5">
                <FormField
                  control={form.control}
                  name="monitoredPhases"
                  render={({ field }) => (
                    <FormItem className="max-w-40">
                      <FormControl>
                        <Input
                          {...field}
                          label="Fase monitorada"
                          placeholder="Monofásica"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ratedVoltage"
                  render={({ field }) => (
                    <FormItem className="max-w-40">
                      <FormControl>
                        <Input
                          {...field}
                          label="Tensão nominal"
                          placeholder="127V"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="solar"
              className="w-full max-w-[500px] mt-12"
            >
              Finalizar Cadastro
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        <Image className="w-full h-auto" src={NewEquipmentImage} alt="New Equipment" />
      </div>
    </div>
  );
}
