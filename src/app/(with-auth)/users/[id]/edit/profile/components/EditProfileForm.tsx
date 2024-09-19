"use client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  editProfileSchema,
  editProfileSchemaType,
} from "@/schemas/edit-profile.schema";
import { userProfileEditAction } from "@/action/edit-user-action";
import { Routes } from "@/enums/Routes.enum";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NewUserImage from "public/images/new-user-image.svg";
import Image from "next/image";
import useUserStore from "@/store/user.store";

export default function EditProfileForm({
  data,
}: {
  data: editProfileSchemaType;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const setUser  = useUserStore(state => state.setUser);

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<editProfileSchemaType>({
    defaultValues: {
      nome: data.nome,
      email: data.email,
    },
    resolver: zodResolver(editProfileSchema),
  });

  async function onSubmit(formData: editProfileSchemaType) {
    router.prefetch(Routes.Users);
    setLoading(true);

    // toast({
    //   title: "Editando usuário...",
    //   description: `O usuário ${data.nome} está sendo editado.`,
    //   variant: "loading",
    // });

    let response: any = null;

    response = await userProfileEditAction(formData).finally(() => {
      setLoading(false);
    });

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setUser(response.data);
      router.refresh();
      setTimeout(() => router.push(Routes.Users), 500);
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
          <span className="text-solaris-primary">Editar</span> usuário
        </h1>
        <Form {...form}>
          <form
            className="w-full max-w-96 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        required
                        {...field}
                        label="Nome de usuário"
                        placeholder="Nome..."
                        invalid={!!form.formState.errors.nome}
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Input
                        required
                        {...field}
                        label="Confirme sua senha"
                        placeholder="Confirmação de senha..."
                        type="password"
                        invalid={!!form.formState.errors.confirmPassword}
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
              className="w-full max-w-96 mt-12"
              loading={loading}
              disabled={loading}
            >
              Finalizar Edição
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
        <span className="text-solaris-primary">Editar</span> usuário
      </h1>
    </div>
  );
}
