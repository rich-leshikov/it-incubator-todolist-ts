import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType
} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {AppActionType, setAppErrorAC, setAppStatusAC} from '../../api/app-reducer';


export const tasksReducer = (state: TasksStateType = {}, action: TaskActionType): TasksStateType => {
  switch (action.type) {
    case 'SET-TASKS':
      return {...state, [action.todolistId]: action.tasks}
    case 'ADD-TASK':
      return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
    case 'REMOVE-TASK':
      return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, ...action.model} : t)
      }
    case 'SET-TODOLISTS': {
      const stateCopy = {...state}
      action.todolists.forEach((tl: TodolistType) => {
        stateCopy[tl.id] = []
      })
      return stateCopy
    }
    case 'ADD-TODOLIST':
      return {[action.todolist.id]: [], ...state}
    case 'REMOVE-TODOLIST':
      const {[action.id]: [], ...rest} = state
      return rest
    default:
      return state
  }
}

// actions
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({type: 'SET-TASKS', tasks, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
  ({type: 'ADD-TASK', task} as const)
export const removeTaskAC = (taskID: string, todolistID: string) =>
  ({type: 'REMOVE-TASK', taskID, todolistID} as const)
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string) =>
  ({type: 'UPDATE-TASK', taskID, model, todolistID} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TaskActionType | AppActionType>) => {
  dispatch(setAppStatusAC('loading'))
  todolistAPI.getTasks(todolistId)
    .then((res) => {
      dispatch(setTasksAC(res.data.items, todolistId))
      dispatch(setAppStatusAC('succeeded'))
    })
}
export const addTaskTC = (taskTitle: string, todolistId: string) =>
  (dispatch: Dispatch<TaskActionType | AppActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.addTask(todolistId, taskTitle)
      .then(res => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(res.data.data.item))
          dispatch(setAppStatusAC('succeeded'))
        } else {
          if (res.data.messages.length) {
            dispatch(setAppErrorAC(res.data.messages[0]))
          } else {
            dispatch(setAppErrorAC('Some error occurred'))
          }
          dispatch(setAppStatusAC('failed'))
        }
      })
  }
export const removeTaskTC = (taskId: string, todolistId: string) =>
  (dispatch: Dispatch<TaskActionType | AppActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.removeTask(todolistId, taskId)
      .then(() => {
        dispatch(removeTaskAC(taskId, todolistId))
        dispatch(setAppStatusAC('succeeded'))
      })
  }
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch<TaskActionType | AppActionType>, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    todolistAPI.updateTask(todolistId, taskId, {
      title: task.title,
      startDate: task.startDate,
      priority: task.priority,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      ...domainModel
    }).then(() => {
      dispatch(updateTaskAC(taskId, domainModel, todolistId))
      dispatch(setAppStatusAC('succeeded'))
    })
  }

// types
export type TaskActionType =
  | SetTasksActionType
  | AddTaskActionType
  | RemoveTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

export type TasksStateType = {
  [key: string]: Array<TaskType>
}
type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}