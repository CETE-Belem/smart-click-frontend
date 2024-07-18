"use client"

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Turnstile from "react-turnstile";
import Image from "next/image";
import WhiteLogo from "public/images/white-logo.svg"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema, AuthSchemaType } from "@/schemas/auth.schema";
import { useEffect, useState } from "react";
import { authAction } from "@/action/auth.action";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()
    const { register, handleSubmit, setValue, setFocus, trigger, formState: {
        isValid,
    } } = useForm<AuthSchemaType>({
        mode: "all",
        resolver: zodResolver(AuthSchema)
    })

    useEffect(() => {
        setFocus("email")
    }, [setFocus])

    async function onSubmit(data: AuthSchemaType) {
        router.prefetch("/dashboard")
        setLoading(true)
        const response = await authAction(data).finally(() => {
            setLoading(false)
        })

        if (response.success) {
            toast({
                title: "Sucesso",
                description: response.message,
                variant: "success"
            })
            router.push("/dashboard")
        } else {
            toast({
                title: "Erro",
                description: response.message,
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
                    <h1 className="text-4xl font-bold text-[#333333] lg:max-w-[10ch]"><span className="text-[#1C5790]">Acesse</span> sua conta</h1>
                    <div>
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <Input type="email" placeholder="Digite seu e-mail" label="Email" {...register("email")} />
                            <Input type="password" placeholder="Digite sua senha" label="Senha" {...register("password")} />
                            <Turnstile
                                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_KEY as string}
                                theme="light"
                                fixedSize
                                style={{ width: "100%" }}
                                onVerify={(token) => {
                                    setValue("captcha", token)
                                    trigger("captcha")
                                }}
                                onExpire={() => {
                                    setValue("captcha", "")
                                    trigger("captcha")
                                }}
                            />
                            <Button className="w-full" disabled={!isValid} loading={loading}>Acessar</Button>
                        </form>
                        <Button variant="link" className="text-xs">Esqueceu sua senha?</Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="opacity-70 text-sm">Não tem uma conta?</span>
                        <Button variant="outline">Criar conta</Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
