import Input from "@/components/ui/input";
import {Meta, StoryObj} from  "@storybook/react"

export default {
    title: "Components/Input",
    component: Input,
    tags: ['autodocs'],
    decorators: [
        (Story) => <div className="grid place-items-center py-8"><Story /></div>
    ]
} as Meta<typeof Input>

type Story = StoryObj<typeof Input>

export const Default: Story = {
    args: {
        placeholder: "Digite seu email",
        type: "email"
    }
}

export const Label: Story = {
    args: {
        label: "Email",
        placeholder: "Digite seu email",
        type: "email"
    }
}