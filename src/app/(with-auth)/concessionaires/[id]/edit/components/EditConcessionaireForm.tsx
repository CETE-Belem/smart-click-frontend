"use client";
import { adminEditConcessionaireAction } from "@/action/edit-concessionaire.action";
import { useToast } from "@/components/ui/use-toast";
import { Role } from "@/enums/Role.enum";
import { Routes } from "@/enums/Routes.enum";
import useCities from "@/hooks/useCities";
import useUFs from "@/hooks/useUF";
import {
  NewConcessionaireSchema,
  NewConcessionaireSchemaType,
} from "@/schemas/new-concessionaire.schema";
import useUserStore from "@/store/user.store";
import { Concessionaire } from "@/types/concessionaire";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import EditConcessionaireImage from "public/images/new-concessionaire-image.svg";

export default function EditConcessionaireForm({
  data,
}: {
  data: Concessionaire;
}) {
  const { ufs, loading: ufLoading } = useUFs();
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

  const form = useForm<NewConcessionaireSchemaType>({
    defaultValues: {
      name: data.nome,
      city: data.cidade,
      uf: data.uf,
    },
    resolver: zodResolver(NewConcessionaireSchema),
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

  async function onSubmit(values: NewConcessionaireSchemaType) {
    router.prefetch(Routes.Concessionaires);
    setLoading(true);

    // toast({
    //   title: "Editando...",
    //   description: `A concessionária ${values.name} está sendo editada`,
    //   variant: "loading",
    // });

    let response: any = null;
    if (user?.perfil === Role.ADMIN) {
      response = await adminEditConcessionaireAction(
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
      queryClient.invalidateQueries({ queryKey: ["concessionaires"] });
      queryClient.invalidateQueries({
        queryKey: ["concessionaires", params.id],
      });
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
    <div className="flex flex-col-reverse items-center lg:grid lg:grid-cols-2 lg:p-14 py-6 gap-9 lg:gap-16">
      <div className="flex flex-col items-center lg:items-start w-full space-y-6 col-span-1">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Editar</span> concessionária
        </h1>
        <Form {...form}>
          <form
            className="w-full max-w-[500px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <div className="flex flex-col w-full gap-3 sm:gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="max-w-full w-full">
                      <FormControl>
                        <Input
                          required
                          {...field}
                          label="Concessionária"
                          placeholder={data.nome}
                          invalid={!!form.formState.errors.name}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row w-full gap-3 sm:gap-5">
                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem className="max-w-full w-full">
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
                      <FormItem className="max-w-full w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={ufId === null || citiesLoading || loading}
                          >
                            <FormControl>
                              <SelectTrigger
                                label="Cidade"
                                required
                                invalid={!!form.formState.errors.city}
                              >
                                <SelectValue
                                  placeholder={
                                    citiesLoading
                                      ? "Carregando..."
                                      : data?.cidade
                                  }
                                />
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
          src={EditConcessionaireImage}
          className="w-full h-auto max-w-[500px]"
          alt="Editar Equipamento"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Editar</span> concessionária
      </h1>
    </div>
  );
}
