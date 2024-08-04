"use client"

import Input, { InputIcon } from "@/components/ui/input"
import Button from "@/components/ui/button"
import Turnstile from "react-turnstile"
import Image from "next/image"
import WhiteLogo from "public/images/white-logo.svg"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RegisterSchema, RegisterSchemaType } from "@/schemas/register.schema"
import { registerAction } from "@/action/register.action"
import { CiCircleInfo } from "react-icons/ci";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function Register() {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()
    // UseForm
    const { register, handleSubmit, setValue, setFocus, trigger, formState: {
        isValid
    } } = useForm<RegisterSchemaType>({
        mode: "all",
        resolver: zodResolver(RegisterSchema)
    })

    useEffect(() => {
        setFocus("name")
    }, [setFocus])

    async function onSubmit(data: RegisterSchemaType) {
        router.prefetch("/confirm-email")
        setLoading(true)
        const response = await registerAction(data).finally(() => {
            setLoading(false)
        })

        if(response.success) {
            toast({
                title: "Sucesso",
                description: response.message,
                variant: "success"
            })
            router.push("/confirm-email?email=" + data.email)
        } else {
            toast({
                title: "Erro",
                description: response.message,
                variant: "destructive"
            })
        }
    }

    return (
        <main className="min-h-screen solaris-background flex flex-col lg:flex-row-reverse">
            <div className="flex-1 py-12 md:py-20 lg:flex lg:items-center lg:justify-center">
                <div className="relative w-40 h-40 mx-auto md:w-60 md:h-60 lg:w-80 lg:h-80">
                    <Image src={WhiteLogo} alt="Logo da Smart Click" fill />
                </div>
            </div>
            <div className="bg-white shadow-2xl rounded-t-[64px] py-8 flex flex-col justify-center items-center lg:flex-1 lg:max-w-screen-sm lg:rounded-tl-none lg:rounded-br-[64px] lg:py-16">
                <div className="space-y-6 max-w-80 w-full">
                    <h1 className="text-4xl font-bold text-[#333] lg:max-w-[10ch]">Crie uma conta</h1>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <Input type="text" placeholder="Digite seu nome" label="Nome" {...register("name")} />
                        <Input type="email" placeholder="Digite seu e-mail" label="E-mail" {...register("email")} />
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
                        <Input type="text" placeholder="Digite o número da sua unidade consumidora" label="Número da Unidade Consumidora" {...register("consumerUnityNumber")} />
                        <Turnstile
                            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_KEY as string}
                            theme="light"
                            style={{ width: "100%" }}
                            fixedSize
                            onVerify={(token) => {
                                setValue("captcha", token)
                                trigger("captcha")
                            }}
                            onExpire={() => {
                                setValue("captcha", "")
                                trigger("captcha")
                            }}
                        />
                        <Button className="w-full" disabled={!isValid} loading={loading}>Cadastrar</Button>
                    </form>
                    <div className="flex justify-between items-center">
                        <span className="opacity-70 text-sm">Já tem uma conta?</span>
                        <Button variant="outline">
                            <Link href="/login">
                                Fazer login
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}