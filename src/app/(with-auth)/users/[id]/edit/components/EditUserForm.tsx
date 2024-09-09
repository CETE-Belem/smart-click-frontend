"use client";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/types/IUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NewUserSchema, NewUserSchemaType } from "@/schemas/new-user.schema";
import { adminEditUserAction } from "@/action/edit-user-action";
import { Routes } from "@/enums/Routes.enum";
import useUserStore from "@/store/user.store";
import { Role } from "@/enums/Role.enum";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditUserForm({ data }: { data: IUser }) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);

  const form = useForm<NewUserSchemaType>({
    defaultValues: {
      name: data.nome,
      email: data.email,
      role: data.perfil,
    },
    resolver: zodResolver(NewUserSchema),
  });

  async function onSubmit(formData: NewUserSchemaType) {
    router.prefetch(Routes.Users);
    setLoading(true);

    toast({
      title: "Editando usuário...",
      description: `O usuário ${data.nome} está sendo editado.`,
      variant: "loading",
    });

    let response: any = null;
    if (user?.perfil === Role.ADMIN) {
      response = await adminEditUserAction(
        formData,
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", params.id],
      });
      router.push(Routes.Users);
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
                name="role"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            label="Cargo"
                            required
                            invalid={!!form.formState.errors.role}
                          >
                            <SelectValue placeholder="Cargo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="-mt-8">
                          {/* O sistema considera o valor como USUARIO e não USER */}
                          {Object.values(Role).map((role) => (
                            <SelectItem
                              key={role}
                              value={role === Role.USER ? "USUARIO" : role}
                            >
                              {role}
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
        <span className="text-solaris-primary">Editar</span> usuário
      </h1>
    </div>
  );
}
