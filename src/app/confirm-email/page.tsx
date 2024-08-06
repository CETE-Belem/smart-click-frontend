"use client";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Turnstile from "react-turnstile";
import Image from "next/image";
import WhiteLogo from "public/images/white-logo.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { authAction } from "@/action/auth.action";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthSchemaType } from "@/schemas/auth.schema";
import {
  ConfirmEmailType,
  ConfirmEmail as ConfirmEmailSchema,
} from "@/schemas/confirm-email.schema";

import { useSearchParams } from "next/navigation";
import { confirmEmail } from "@/action/confirm-email.action";
import { resendConfirmationCode } from "@/action/resend-confirmation-code.action";

export default function ConfirmEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    trigger,
    formState: { isValid, errors },
  } = useForm<ConfirmEmailType>({
    mode: "all",
    resolver: zodResolver(ConfirmEmailSchema),
  });

  useEffect(() => {
    setFocus("code");
  }, [setFocus]);

  async function onSubmit(data: ConfirmEmailType) {
    setLoading(true);
    if(!email) return router.push("/login");
    
    router.prefetch("/dashboard");
    const response = await confirmEmail(data, email).finally(() => {
        setLoading(false)
    })

    if (response.success) {
        toast({
            title: "Sucesso",
            description: response?.message,
            variant: "success"
        })
        router.push("/dashboard")
    } else {
        toast({
            title: "Erro",
            description: response?.message,
            variant: "destructive"
        })
    }
  }

  async function handleResendCode() {
    if(!email) return router.push("/login");
    const response = await resendConfirmationCode(email);

    if (response.success) {
      toast({
        title: "Sucesso",
        description: response?.message,
      });
    } else {
      toast({
        title: "Erro",
        description: response?.message,
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
        <div className="space-y-6 max-w-96 w-full">
          <h1 className="text-5xl font-bold text-[#333333] lg:max-w-[12ch]">
            Crie uma conta
          </h1>
          <p className="text-sm text-muted-foreground/80">
            Um código foi enviado para o seu e-mail. Por favor, insira o código
            abaixo para confirmar seu email.
          </p>
          <div className="space-y-2">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="text"
                placeholder="Digite o código de verificação"
                label="Código de verificação"
                {...register("code")}
              />
              {errors.code && (
                <span className="text-red-500 text-sm">
                  {errors.code.message}
                </span>
              )}
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Confirmar conta
              </Button>
            </form>
            <Button onClick={handleResendCode} variant="link" className="text-xs">
              Não recebeu nada? Reenviar código.
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70 text-sm">Já tem uma conta?</span>
            <Button variant="outline" asChild>
              <Link href="/register">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}