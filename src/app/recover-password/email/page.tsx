"use client";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Image from "next/image";
import WhiteLogo from "public/images/white-logo.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecoverPasswordEmailSchema, RecoverPasswordEmailSchemaType } from "@/schemas/recover-password.schema";
import { sendEmailToRecoverPassword } from "@/action/recover-password.action";

export default function RecoverPasswordEmail() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { isValid, errors },
    } = useForm<RecoverPasswordEmailSchemaType>({
        mode: "all",
        resolver: zodResolver(RecoverPasswordEmailSchema),
    });

    useEffect(() => {
        setFocus("email");
    }, [setFocus]);

    async function onSubmit(data: RecoverPasswordEmailSchemaType) {
        router.prefetch("/recover-password/password");
        setLoading(true);

        const response = await sendEmailToRecoverPassword(data).finally(() => {
            setLoading(false)
        })

        if (response.success) {
            toast({
                title: "Sucesso",
                description: response?.message,
                variant: "success"
            })
            router.push("/recover-password/password?email=" + data.email)
        } else {
            toast({
                title: "Erro",
                description: response?.message,
                variant: "destructive"
            })
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
                    <h1 className="text-5xl font-bold text-[#333333] lg:max-w-[12ch]">
                        Redefinir sua senha
                    </h1>
                    <div className="space-y-2">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                type="email"
                                placeholder="Digite seu e-mail"
                                label="E-mail"
                                {...register("email")}
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">
                                    {errors.email.message}
                                </span>
                            )}
                            <Button
                                type="submit"
                                className="w-full"
                                loading={loading}
                                disabled={!isValid || loading}
                            >
                                Enviar
                            </Button>
                        </form>
                    </div>
                    <div className="space-y-4 pt-6">
                        <div className="flex justify-between gap-3 items-center">
                            <span className="opacity-70 text-sm">Não tem uma conta?</span>
                            <Button variant="outline" asChild>
                                <Link href="/register">Criar conta</Link>
                            </Button>
                        </div>
                        <div className="flex justify-between gap-3 items-center">
                            <span className="opacity-70 text-sm">Já tem uma conta?</span>
                            <Button variant="outline" asChild>
                                <Link href="/login">Fazer Login</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
