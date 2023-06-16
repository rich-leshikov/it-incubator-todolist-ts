import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {AppActionType, RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';


export const tasksReducer = (state: TasksStateType = {}, action: TaskActionType): TasksStateType => {
  switch (action.type) {
    case 'SET-TASKS':{
      return {...state, [action.todolistId]: action.tasks}
    }
    case 'ADD-TASK':
      return {...state, [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]}
    case 'REMOVE-TASK':
      return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, ...action.model} : t)
      }
    case 'CHANGE-TASK-ENTITY-STATUS':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID]
          .map(t => t.id === action.taskID ? {...t, entityStatus: action.entityStatus} : t)
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
export const setTasksAC = (tasks: Array<TaskDomainType>, todolistId: string) =>
  ({type: 'SET-TASKS', tasks, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
  ({type: 'ADD-TASK', task} as const)
export const removeTaskAC = (taskID: string, todolistID: string) =>
  ({type: 'REMOVE-TASK', taskID, todolistID} as const)
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string) =>
  ({type: 'UPDATE-TASK', taskID, model, todolistID} as const)
export const changeTaskEntityStatusAC = (taskID: string, entityStatus: RequestStatusType, todolistID: string) =>
  ({type: 'CHANGE-TASK-ENTITY-STATUS', taskID, entityStatus, todolistID} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TaskActionType | AppActionType>) => {
  dispatch(setAppStatusAC('loading'))
  todolistAPI.getTasks(todolistId)
    .then((res) => {
      const resData: TaskDomainType[] = res.data.items.map(task => ({...task, entityStatus: 'idle'}))
      dispatch(setTasksAC(resData, todolistId))
      dispatch(setAppStatusAC('succeeded'))
    })
    .catch(err => handleServerNetworkError(err, dispatch))
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
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(err => handleServerNetworkError(err, dispatch))
  }
export const removeTaskTC = (taskId: string, todolistId: string) =>
  (dispatch: Dispatch<TaskActionType | AppActionType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(taskId, 'loading', todolistId))
    todolistAPI.removeTask(todolistId, taskId)
      .then(() => {
        dispatch(removeTaskAC(taskId, todolistId))
        dispatch(setAppStatusAC('succeeded'))
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
        dispatch(changeTaskEntityStatusAC(taskId, 'failed', todolistId))
      })
  }
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch<TaskActionType | AppActionType>, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(taskId, 'loading', todolistId))
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
    })
      .then(res => {
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC(taskId, domainModel, todolistId))
          dispatch(setAppStatusAC('succeeded'))
          dispatch(changeTaskEntityStatusAC(taskId, 'succeeded', todolistId))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(err => {
        handleServerNetworkError(err, dispatch)
        dispatch(changeTaskEntityStatusAC(taskId, 'failed', todolistId))
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
  | ChangeTaskEntityStatusActionType
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}
export type TasksStateType = {
  [key: string]: Array<TaskDomainType>
}
type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}