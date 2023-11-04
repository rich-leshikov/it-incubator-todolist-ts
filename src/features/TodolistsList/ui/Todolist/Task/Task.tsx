import { ChangeEvent, FC, memo } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import styles from 'features/TodolistsList/ui/Todolist/Task/Task.module.css'
import { EditableTitle } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { TaskDomain } from 'features/TodolistsList/model/tasks/task.types'
import { useAppDispatch } from 'app/store'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasks.slice'

type TaskProps = {
  task: TaskDomain
}

export const Task: FC<TaskProps> = memo(({ task }) => {
  // console.log('render task')

  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(tasksThunks.removeTask({ taskId: task.id, todolistId: task.todoListId }))
  }
  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(tasksThunks.updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      domainModel: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New }
    }))
  }
  const changeTitleCallback = (title: string) => {
    dispatch(tasksThunks.updateTask({
      taskId: task.id,
      todolistId: task.todoListId,
      domainModel: { title }
    }))
  }

  return (
    <div className={`${styles.task} ${task.status === TaskStatuses.Completed && styles.isCompleted}`}>
      <div className={styles.content}>
        <Checkbox
          color={'success'}
          checked={task.status === TaskStatuses.Completed}
          onChange={changeStatusHandler}
          disabled={task.entityStatus === 'loading'}
        />
        <EditableTitle
          title={task.title}
          changeTitle={changeTitleCallback}
          isDisabled={task.entityStatus === 'loading'}
        />
      </div>
      <IconButton onClick={removeTaskHandler} disabled={task.entityStatus === 'loading'}>
        <Delete style={{ color: '#ccc0c0' }} />
      </IconButton>
    </div>
  )
})
