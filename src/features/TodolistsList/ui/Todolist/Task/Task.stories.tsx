import type { Meta, StoryObj } from '@storybook/react'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import { TaskPriorities, TaskStatuses } from 'common/enums'

const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/Task',
  component: Task,
  tags: ['autodocs'],
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
