import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef, HTMLAttributes, ReactNode, Ref } from 'react'

import { InputHTMLAttributes } from 'react'
import { IconType } from 'react-icons'

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    labelClassName?: string
    iterativeIcon?: ReactNode
    invalid?: boolean
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
            labelClassName,
            iterativeIcon,
            invalid,
            required,
            disabled,
            ...props
        }: InputProps,
        ref: Ref<HTMLInputElement>,
    ) => {
        return (
            <label className={cn("relative flex flex-col gap-[10px]", labelClassName)}>
                { label && (<span className={cn('text-sm font-medium text-[#333333] opacity-70')}>{label}
                    {required && (<span className='text-[#FF0000]'>*</span>)}
                </span>)}
                <div className={cn('flex items-center w-full rounded-3xl bg-[#BBBBBB33] shadow-input', {
                    'border border-[#FF0000]': invalid,
                    "opacity-50": disabled
                })}>
                    <input
                        className={cn(
                            'h-12 w-full bg-transparent p-3 font-semibold text-[#58585A] text-sm outline-none placeholder:font-normal placeholder:text-[#58585A]/40 disabled:cursor-not-allowed',
                            {
                                "pr-1": iterativeIcon
                            },
                            className,
                        )}
                        ref={ref}
                        disabled={disabled}
                        {...props}
                    />
                    {
                        iterativeIcon && (
                            <div className='pr-3 flex items-center justify-center text-[#58585A]/40'>
                                {iterativeIcon}
                            </div>
                        )
                    }
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