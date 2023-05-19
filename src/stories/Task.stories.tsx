import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions'
import {Task} from '../components/Todolist/Task/Task';


const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/Task',
  component: Task,
  tags: ['autodocs'],
  args: {
    checkTask: action('Status changed inside Task'),
    changeTaskTitle: action('Title changed inside Task'),
    removeTask: action('Remove Button clicked changed inside Task'),
    id: '12wsdewfijdei',
    taskTitle: 'JS',
    isDone: false,
    todolistID: 'fgdosrg8rgjuh'
  }
}

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskIsNotDoneStory: Story = {};

export const TaskIsDoneStory: Story = {
  args: {
    id: '12wsdewfijdei2343',
    taskTitle: 'CSS',
    isDone: true
  },
}
