import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        solar: "bg-[#1C5790] text-white flex justify-center items-center text-base font-semibold px-5 py-3 rounded-3xl transition-colors disabled:opacity-50 disabled:pointer-events-none hover:bg-[#12406B] active:bg-[#0B243B]",
        "solar-destructive": "rounded-3xl px-14 py-3 gap-2 disabled:bg-transparent disabled:border-[#EB7575] disabled:border disabled:text-[#EB7575] bg-[#FF0026] text-white hover:bg-[#FF2244]",
        "solar-outline": "border-[#1C5790] text-[#1C5790] border bg-transparent flex justify-center items-center text-base font-semibold px-5 py-3 rounded-3xl transition-colors disabled:opacity-50 disabled:pointer-events-none hover:bg-[#12406B] hover:text-white active:bg-[#0B243B]",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-md px-8",
        icon: "h-10 w-10",
        link: "px-0 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.loading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : props.children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
