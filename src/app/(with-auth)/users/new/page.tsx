"use client";

import { NewAdminAction } from "@/action/new-admin.action";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import { NewAdminSchema, NewAdminSchemaType } from "@/schemas/new-admin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import NewUserImage from "public/images/new-user-image.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useAlert } from "@/providers/alert.provider";

export default function NewUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { openAlert } = useAlert();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<NewAdminSchemaType>({
    resolver: zodResolver(NewAdminSchema),
  });

  async function onSubmit(values: NewAdminSchemaType) {
    try {
      const confirmed = await openAlert({
        title:
          "Tem certeza de que deseja conceder essas permissões a este usuário?",
        description:
          "Você está prestes a criar um usuário com permissões de administrador. Administradores têm acesso total ao sistema, podendo visualizar, modificar e excluir dados, além de gerenciar outros usuários e alterar configurações importantes.",
        confirmText: "Sim",
        cancelText: "Não",
      });

      if (!confirmed) return;

      toast({
        title: "Criando...",
        description: `O usuário ${values.name} está sendo criado`,
        variant: "loading",
      });

      const response = await NewAdminAction(values).finally(() => {
        setLoading(false);
      });

      if (response.success) {
        toast({
          title: "Sucesso",
          description: response.message,
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        router.push(Routes.Users);
      } else {
        toast({
          title: "Erro",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao cadastrar o usuário ${values.name}`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col-reverse items-center lg:grid lg:grid-cols-2 lg:p-14 py-6 gap-9">
      <div className="flex flex-col items-center lg:items-start w-full space-y-6">
        <h1 className="hidden lg:block text-3xl font-bold text-secondary-foreground">
          <span className="text-solaris-primary">Cadastrar</span> administrador
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
                        label="Nome de usuário"
                        placeholder="Nome..."
                        invalid={!!form.formState.errors.name}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        required
                        {...field}
                        label="E-mail"
                        placeholder="E-mail..."
                        invalid={!!form.formState.errors.email}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        required
                        {...field}
                        label="Senha"
                        placeholder="Senha..."
                        type="password"
                        invalid={!!form.formState.errors.password}
                        disabled={loading}
                      />
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
              loading={loading}
              disabled={loading}
            >
              Finalizar Cadastro
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex justify-center items-start w-full h-full">
        <Image
          className="w-full h-auto max-w-[500px]"
          src={NewUserImage}
          alt="Novo usuário"
        />
      </div>
      <h1 className="lg:hidden text-2xl sm:text-3xl font-bold text-secondary-foreground">
        <span className="text-solaris-primary">Cadastrar</span> administrador
      </h1>
    </div>
  );
}
