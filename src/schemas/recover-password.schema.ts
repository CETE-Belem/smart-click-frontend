import { maxEmailLength, maxPasswordLength, minPasswordLength, passwordRegex } from "@/constants/auth"
import z from "zod"

export const RecoverPasswordEmailSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório").max(maxEmailLength, `O e-mail deve ter no máximo ${maxEmailLength} caracteres`),
})

export const RecoverPasswordSchema = z.object({
    code: z.string().min(1, "O código de recuperação é obrigatório").length(6, "O código de recuperação deve ter 6 caracteres"),
    password: z.string().regex(passwordRegex, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial").min(minPasswordLength, `A senha deve ter no mínimo ${minPasswordLength} caracteres`).max(maxPasswordLength, `A senha deve ter no máximo ${maxPasswordLength} caracteres`),
    confirmPassword: z.string().regex(passwordRegex, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial").min(minPasswordLength, `A senha deve ter no mínimo ${minPasswordLength} caracteres`).max(maxPasswordLength, `A senha deve ter no máximo ${maxPasswordLength} caracteres`),
})

export type RecoverPasswordEmailSchemaType = z.infer<typeof RecoverPasswordEmailSchema>
export type RecoverPasswordSchemaType = z.infer<typeof RecoverPasswordSchema>

export const RecoverPasswordSchemaTransformed = RecoverPasswordSchema.transform(({ confirmPassword, ...data}) => data)