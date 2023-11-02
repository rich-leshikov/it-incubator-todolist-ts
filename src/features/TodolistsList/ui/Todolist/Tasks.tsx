import React, { FC } from 'react'
import { useAppSelector } from 'app/store'
import * as tasksSelectors from 'features/TodolistsList/model/tasks/tasks.selectors'
import { TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { TaskStatuses } from 'common/enums'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'

type TasksProps = {
  todolist: TodolistDomain
}

export const Tasks: FC<TasksProps> = ({ todolist }) => {
  let tasks = useAppSelector(tasksSelectors.tasks(todolist.id))

  if (todolist.filter === 'active') {
    tasks = tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return <div>{tasks.map(t => <Task key={t.id} task={t} />)}</div>
}