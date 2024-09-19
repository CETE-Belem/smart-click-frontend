"use client";

import Input, { InputIcon } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import WhiteLogo from "public/images/white-logo.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecoverPasswordSchema, RecoverPasswordSchemaType } from "@/schemas/recover-password.schema";
import { useSearchParams } from "next/navigation";
import { recoverPassword } from "@/action/recover-password.action";
import { resendConfirmationCode } from "@/action/resend-confirmation-code.action";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { CiCircleInfo } from "react-icons/ci";

export default function RecoverPassword() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const {
        register,
        handleSubmit,
        setFocus,
        watch,
        formState: { isValid, errors },
    } = useForm<RecoverPasswordSchemaType>({
        mode: "all",
        resolver: zodResolver(RecoverPasswordSchema),
    });

    useEffect(() => {
        setFocus("code");
    }, [setFocus]);

    async function onSubmit(data: RecoverPasswordSchemaType) {
        router.prefetch("/login");
        setLoading(true);
        if (!email) return router.push("/login");

        const response = await recoverPassword(data, email).finally(() => {
            setLoading(false)
        })

        if (response.success) {
            toast({
                title: "Sucesso",
                description: response?.message,
                variant: "success"
            })
            router.push("/login")
        } else {
            toast({
                title: "Erro",
                description: response?.message,
                variant: "destructive"
            })
        }
    }

    async function handleResendCode() {
        if (!email) return router.push("/login");
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
        <main className="min-h-screen solaris-background flex flex-col lg:flex-row-reverse">
            <div className="flex-1 py-12 md:py-20 lg:flex lg:items-center lg:justify-center">
                <div className="relative w-40 h-40 mx-auto md:w-60 md:h-60 lg:w-80 lg:h-80">
                    <Image src={WhiteLogo} alt="Logo do Smart Click" fill />
                </div>
            </div>
            <div className="bg-white shadow-2xl rounded-t-[64px] py-8 flex flex-col justify-center items-center lg:flex-1 lg:max-w-screen-sm lg:rounded-tl-none lg:rounded-br-[64px] lg:py-16">
                <div className="space-y-6 max-w-80 w-full">
                    <h1 className="text-5xl font-bold text-[#333333] lg:max-w-[12ch]">
                        Redefinir sua senha
                    </h1>
                    <p className="text-sm text-muted-foreground/80">
                        Um código foi enviado para o seu e-mail. Por favor, insira o código
                        abaixo para redefinir sua senha.
                    </p>
                    <div className="space-y-2">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                type="text"
                                placeholder="Digite o código de recuperação"
                                label="Código de recuperação"
                                {...register("code")}
                            />
                            {errors.code && (
                                <span className="text-red-500 text-sm">
                                    {errors.code.message}
                                </span>
                            )}
                            <Input
                                type="password"
                                placeholder="Digite sua senha"
                                label="Senha"
                                iterativeIcon={
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InputIcon icon={CiCircleInfo} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-[#999] text-white px-6 py-4">
                                                <ul className="list-disc">
                                                    <li>Pelo menos 6 caracteres</li>
                                                    <li>Uma letra minúscula</li>
                                                    <li>Uma letra maiúscula</li>
                                                    <li>Um número</li>
                                                    <li>Um caractere especial</li>
                                                    <li>No máximo 30 caracteres</li>
                                                </ul>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                }
                                {...register("password")} />
                            <Input type="password" placeholder="Digite sua senha novamente" label="Confirmar senha" {...register("confirmPassword")} />
                            <Button
                                variant="solar"
                                type="submit"
                                className="w-full"
                                loading={loading}
                            >
                                Trocar senha
                            </Button>
                        </form>
                        {/* <Button onClick={handleResendCode} variant="link" className="text-xs">
                            Não recebeu nada? Reenviar código.
                        </Button> */}
                    </div>
                    <div className="space-y-4 pt-6">
                        <div className="flex justify-between gap-3 items-center">
                            <span className="opacity-70 text-sm">Não tem uma conta?</span>
                            <Button variant="solar-outline" asChild>
                                <Link href="/register">Criar conta</Link>
                            </Button>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                            <span className="opacity-70 text-sm">Já tem uma conta?</span>
                            <Button variant="solar-outline" asChild>
                                <Link href="/login">Fazer Login</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
