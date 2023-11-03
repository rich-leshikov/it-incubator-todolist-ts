import { FC, memo } from 'react'
import styles from 'features/TodolistsList/ui/Todolist/Todolist.module.css'
import { useAppDispatch } from 'app/store'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.reducer'
import { AddInputElement } from 'common/components'
import { TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types.reducer'
import { FilterTasksButtons } from 'features/TodolistsList/ui/Todolist/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/ui/Todolist/Tasks'
import { TodolistTitle } from 'features/TodolistsList/ui/Todolist/TodolistTitle'

type TodolistProps = {
  todolist: TodolistDomain
}

export const Todolist: FC<TodolistProps> = memo(({ todolist }) => {
  // console.log('render todolist')

  const dispatch = useAppDispatch()

  const addTaskCallback = (taskTitle: string) => {
    return dispatch(tasksThunks.addTask({ taskTitle, todolistId: todolist.id })).unwrap()
  }

  return (
    <div className={'todolist'}>
      <TodolistTitle todolist={todolist} />
      <div className={styles.buttons}>
        <FilterTasksButtons todolist={todolist} />
      </div>
      <Tasks todolist={todolist} />
      <AddInputElement addElement={addTaskCallback} isDisabled={todolist.entityStatus === 'loading'} />
    </div>
  )
})
