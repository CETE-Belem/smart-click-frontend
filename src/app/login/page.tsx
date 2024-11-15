"use client";

import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Turnstile from "react-turnstile";
import Image from "next/image";
import WhiteLogo from "public/images/white-logo.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema, AuthSchemaType } from "@/schemas/auth.schema";
import { useEffect, useState } from "react";
import { authAction } from "@/action/auth.action";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Routes } from "@/enums/Routes.enum";
import useUserStore from "@/store/user.store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function Login() {
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
  });

  useEffect(() => {
    form.setFocus("email");
  }, [form.setFocus]);

  async function onSubmit(data: AuthSchemaType) {
    router.prefetch(Routes.MainPage);
    setLoading(true);
    const response = await authAction(data).finally(() => {
      setLoading(false);
    });

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response.message,
        variant: "success",
      });
      response.user && setUser(response.user);
      router.push(Routes.MainPage);
    } else {
      toast({
        title: "Erro",
        description: response.message,
        variant: "destructive",
      });
    }
  }

  return (
    <main className="h-screen solaris-background flex flex-col lg:flex-row-reverse">
      <div className="flex-1 py-12 md:py-20 lg:flex lg:items-center lg:justify-center">
        <div className="relative w-40 h-40 mx-auto md:w-60 md:h-60 lg:w-80 lg:h-80">
          <Image src={WhiteLogo} alt="Logo do Smart Click" fill />
        </div>
      </div>
      <div className="bg-white shadow-2xl rounded-t-[64px] py-8 flex flex-col justify-center items-center lg:flex-1 lg:max-w-screen-sm lg:rounded-tl-none lg:rounded-br-[64px] lg:py-16">
        <div className="space-y-6 max-w-80 w-full">
          <h1 className="text-4xl font-bold text-[#333333] lg:max-w-[10ch]">
            <span className="text-[#1C5790]">Acesse</span> sua conta
          </h1>
          <div>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="max-w-96">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite seu e-mail"
                          label="Email"
                          {...field}
                          invalid={!!form.formState.errors.email}
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
                          type="password"
                          placeholder="Digite sua senha"
                          label="Senha"
                          {...field}
                          invalid={!!form.formState.errors.password}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="captcha"
                  render={({ field }) => (
                    <FormItem className="max-w-96">
                      <FormControl>
                        <Turnstile
                          {...field}
                          sitekey={
                            process.env.NEXT_PUBLIC_TURNSTILE_KEY as string
                          }
                          theme="light"
                          fixedSize
                          style={{ width: "100%" }}
                          onVerify={(token) => {
                            form.setValue("captcha", token);
                            form.trigger("captcha");
                          }}
                          onExpire={() => {
                            form.setValue("captcha", "");
                            form.trigger("captcha");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="solar"
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  Acessar
                </Button>
              </form>
            </Form>
            <div className="flex justify-start">
              <Button variant="link" className="text-xs" size="link" asChild>
                <Link href={Routes.RecoverPasswordByEmail}>Esqueceu sua senha?</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70 text-sm">Não tem uma conta?</span>
            <Button variant="solar-outline" asChild>
              <Link href={Routes.Register}>Criar conta</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
