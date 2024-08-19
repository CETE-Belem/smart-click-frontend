import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"
import { cva, VariantProps } from "class-variance-authority"


// focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
const textAreaVariants = cva(
  "flex min-h-[80px] w-full rounded-md text-xs focus-visible:outline-none ring-offset-background placeholder:text-xs placeholder:font-normal placeholder:text-[#58585A]/40 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background ring-offset-background px-3 py-2 border border-input",
        solar: "bg-[#F5F5F5] font-normal p-4 rounded-2xl resize-none shadow-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textAreaVariants> {
    label?: string,
    invalid?: boolean,
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, variant, invalid, required, ...props }, ref) => {
    return (
      <div className="grid w-full gap-4">
        <Label className="text-base font-medium text-black/50" htmlFor="message">
          {label}
          {required && (<span className='text-[#FF0000]'>*</span>)}
        </Label>
        <textarea
          className={cn(
            textAreaVariants({ variant, className }),
            invalid && "border-[#FF0000] border",
          )}
          ref={ref}
          {...props}
        />
    </div>
      
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
