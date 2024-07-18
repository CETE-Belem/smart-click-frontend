import { cn } from '@/lib/utils'
import { forwardRef, Ref } from 'react'

import { InputHTMLAttributes } from 'react'

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Input = forwardRef(
    (
        {
            label,
            className,
            ...props
        }: InputProps,
        ref: Ref<HTMLInputElement>,
    ) => {
        return (
            <label className="relative flex flex-col gap-[10px]">
                <span className={cn('text-sm font-medium text-[#333333] opacity-70')}>{label}</span>
                <input
                    className={cn(
                        'w-full rounded-3xl text-[#999999] py-2 px-3 text-sm outline-none border border-[#888888] placeholder:text-[#999999] placeholder:font-semibold bg-[#BBBBBB33]',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
            </label>
        )
    },
)

Input.displayName = 'Input'

export default Input
