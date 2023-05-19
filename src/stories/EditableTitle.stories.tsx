import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {EditableTitle} from '../components/Todolist/EditableTitle';


const meta: Meta<typeof EditableTitle> = {
  title: 'TODOLISTS/EditableTitle',
  component: EditableTitle,
  tags: ['autodocs'],
  argTypes: {
    changeTitle: {
      description: 'Button clicked inside form',
      action: 'clicked'
    }
  },
}

export default meta;
type Story = StoryObj<typeof EditableTitle>;

export const AddInputElementStory: Story = {
  args: {
    changeTitle: action('Button clicked inside form'),
    title: 'JS'
  },
}