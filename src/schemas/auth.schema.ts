import z from "zod";
import {
  maxEmailLength,
  passwordRegex,
  maxPasswordLength,
  minPasswordLength,
} from "@/constants/auth";

export const AuthSchema = z.object({
  email: z
    .string({
      required_error: "O e-mail é obrigatório",
    })
    .email("E-mail inválido")
    .min(1, "O e-mail é obrigatório")
    .max(
      maxEmailLength,
      `O e-mail deve ter no máximo ${maxEmailLength} caracteres`
    ),
  password: z
    .string({
      required_error: "A senha é obrigatória",
    })
    .regex(
      passwordRegex,
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
    )
    .min(
      minPasswordLength,
      `A senha deve ter no mínimo ${minPasswordLength} caracteres`
    )
    .max(
      maxPasswordLength,
      `A senha deve ter no máximo ${maxPasswordLength} caracteres`
    ),
  captcha: z
    .string({
      required_error: "O captcha é obrigatório",
    })
    .min(1, "O captcha é obrigatório"),
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;
