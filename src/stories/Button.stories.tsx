import Button from "@/components/ui/button"
import {Meta, StoryObj} from "@storybook/react"

export default {
    title: "Components/Button",
    component: Button,
    tags: ['autodocs'],
    decorators: [
        (Story) => <div className="grid place-items-center py-8"><Story /></div>
    ]
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        children: "Teste"
    }
}

export const Disabled: Story = {
    args: {
        children: "Teste",
        disabled: true
    }
}

export const Loading: Story = {
    args: {
        children: "Teste",
        loading: true
    }
}

export const Success: Story = {
    args: {
        children: "Teste",
        success: true
    }
}

export const Invalid: Story = {
    args: {
        children: "Teste",
        invalid: true
    }
}

export const Thank: Story = {
    args: {
        children: "Teste",
        thank: true
    }
}

export const Outline: Story = {
    args: {
        children: "Teste",
        variant: "outline"
    }
}

export const OutlineLoading: Story = {
    args: {
        children: "Teste",
        variant: "outline",
        loading: true
    }
}

export const OutlineSuccess: Story = {
    args: {
        children: "Teste",
        variant: "outline",
        success: true
    }
}

export const OutlineInvalid: Story = {
    args: {
        children: "Teste",
        variant: "outline",
        invalid: true
    }
}