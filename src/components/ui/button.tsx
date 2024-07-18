import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot'
import { forwardRef, Ref } from 'react'
import { ButtonHTMLAttributes } from "react";
import { ImSpinner2 } from "react-icons/im";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean, loading?: boolean, success?: boolean, invalid?: boolean, thank?: boolean, variant?: "primary" | "outline" | "link" }

const Button = forwardRef(({ children, className, disabled, asChild, success, invalid, thank, loading, variant, ...props }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
  const Component = asChild ? Slot : "button"

  function buttonChildren() {
    if (loading) {
      return <ImSpinner2 className="animate-spin" />
    }

    if (thank) {
      return "Obrigado!"
    }

    if (success) {
      return "Sucesso!"
    }

    if (invalid) {
      return "Erro!"
    }

    return children
  }

  return (
    <Component disabled={disabled || loading || invalid || success || thank} className={cn("bg-[#1C5790] text-white text-base font-semibold px-8 py-2 rounded-2xl transition-colors disabled:opacity-50 disabled:pointer-events-none hover:bg-[#12406B] active:bg-[#0B243B]", {
      "bg-[#96B562] disabled:opacity-100": success,
      "disabled:opacity-100": loading || thank,
      "bg-[#FF2244]": invalid,
      "bg-transparent border border-[#1C5790] text-[#1C5790] hover:bg-[#12406B] active:bg-[#12406B]": variant === "outline",
      "bg-transparent px-2 text-[#1C5790] hover:text-[#013B6E] hover:underline hover:bg-transparent active:bg-transparent active:text-[#111111] active:underline": variant === 'link'
    }, className)} ref={ref} {...props}>
      {buttonChildren()}
    </Component>
  )
})

Button.displayName = "Button"
export default Button