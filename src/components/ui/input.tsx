import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef, HTMLAttributes, ReactNode, Ref } from 'react'

import { InputHTMLAttributes } from 'react'
import { IconType } from 'react-icons'

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    iterativeIcon?: ReactNode
}

type InputIconButtonProps = {
    type: 'button'
    icon: IconType
} & ButtonHTMLAttributes<HTMLButtonElement>

type InputIconProps =
    | {
        type?: 'button' | 'span'
        icon: IconType
    }
    | InputIconButtonProps

const Input = forwardRef(
    (
        {
            label,
            className,
            iterativeIcon,
            ...props
        }: InputProps,
        ref: Ref<HTMLInputElement>,
    ) => {
        return (
            <label className="relative flex flex-col gap-[10px]">
                <span className={cn('text-sm font-medium text-[#333333] opacity-70')}>{label}</span>
                <div className='flex items-center gap-3 w-full rounded-3xl px-3 bg-[#BBBBBB33] border border-[#888]'>
                    <input
                        className={cn(
                            'w-full bg-transparent py-3 font-semibold text-[#999999] text-sm outline-none placeholder:text-[#999999] placeholder:font-semibold ',
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                    {iterativeIcon}
                </div>
            </label>
        )
    },
)

const InputIcon = ({icon: Icon, className, type = "span", ...props}: InputIconProps & HTMLAttributes<HTMLSpanElement>) => {
    const Component = type

    return (
        <Component 
            type="button"
            className={cn("text-inherit transition-all opacity-40 hover:text-[#757373]", type === "button" && "border-none bg-transparent transition-all")}
        >
            <Icon size={24} />
        </Component>
    )
}

Input.displayName = 'Input'

export default Input
export {InputIcon}