import type { Meta, StoryObj } from '@storybook/react'
import { AddInputElement } from 'common/components/AddInputElement/AddInputElement'

const meta: Meta<typeof AddInputElement> = {
  title: 'TODOLISTS/AddInputElement',
  component: AddInputElement,
  tags: ['autodocs'],
  argTypes: {
    addElement: {
      description: 'Button clicked inside form',
      action: 'clicked'
    }
  }
}

export default meta
type Story = StoryObj<typeof AddInputElement>

export const AddInputElementStory: Story = {
  args: {
  }
}
