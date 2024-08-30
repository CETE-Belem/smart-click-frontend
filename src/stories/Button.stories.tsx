import {Button} from "@/components/ui/button"
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
        children: "Teste",
        variant: "solar"
    }
}

export const Disabled: Story = {
    args: {
        children: "Teste",
        variant: "solar",
        disabled: true
    }
}

export const Loading: Story = {
    args: {
        children: "Teste",
        variant: "solar",
        loading: true
    }
}

export const Success: Story = {
    args: {
        children: "Teste",
        variant: "solar"
    }
}

export const Invalid: Story = {
    args: {
        children: "Teste",
        variant: "solar",
    }
}

export const Outline: Story = {
    args: {
        children: "Teste",
        variant: "solar-outline"
    }
}

export const OutlineLoading: Story = {
    args: {
        children: "Teste",
        variant: "solar-outline",
        loading: true
    }
}

export const OutlineSuccess: Story = {
    args: {
        children: "Teste",
        variant: "solar-outline",
    }
}

export const OutlineInvalid: Story = {
    args: {
        children: "Teste",
        variant: "solar-outline",
    }
}

export const Link: Story = {
    args: {
        children: "Teste",
        variant: "link"
    }
}