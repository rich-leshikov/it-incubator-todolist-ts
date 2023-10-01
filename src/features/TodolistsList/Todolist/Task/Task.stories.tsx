import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Task } from './Task'
import { TaskPriorities, TaskStatuses } from 'api/todolists-api'

const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/Task',
  component: Task,
  tags: ['autodocs'],
  args: {
    checkTask: action('Status changed inside Task'),
    changeTaskTitle: action('Title changed inside Task'),
    removeTask: action('Remove Button clicked changed inside Task'),
    task: {
      id: '1',
      title: 'CSS',
      status: TaskStatuses.New,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      entityStatus: 'idle'
    }
  }
}

export default meta
type Story = StoryObj<typeof Task>

export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {
  args: {
    task: {
      id: '1',
      title: 'CSS',
      status: TaskStatuses.New,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      entityStatus: 'idle'
    }
  }
}
