import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from './store';


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

export type TaskActionType =
  AddTaskActionType |
  RemoveTaskActionType |
  UpdateTaskActionType |
  AddTodolistActionType |
  RemoveTodolistActionType |
  SetTodolistsActionType |
  SetTasksActionType
export type AddTaskActionType = {
  type: 'ADD-TASK'
  task: TaskType
}
export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  taskID: string
  todolistID: string
}
export type UpdateTaskActionType = {
  type: 'UPDATE-TASK'
  taskID: string
  model: UpdateDomainTaskModelType
  todolistID: string
}
export type SetTasksActionType = {
  type: 'SET-TASKS'
  tasks: Array<TaskType>
  todolistId: string
}


const initialState: TasksStateType = {}


export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {
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
      const stateCopy = {...state}
      delete stateCopy[action.id]
      return stateCopy
    default:
      return state
  }
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
  return {type: 'SET-TASKS', tasks, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return {type: 'ADD-TASK', task}
}
export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => {
  return {type: 'REMOVE-TASK', taskID, todolistID}
}
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string): UpdateTaskActionType => {
  return {type: 'UPDATE-TASK', taskID, model, todolistID}
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.getTasks(todolistId)
    .then((res) => dispatch(setTasksAC(res.data.items, todolistId)))
}
export const addTaskTC = (taskTitle: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.addTask(todolistId, taskTitle)
    .then(res => dispatch(addTaskAC(res.data.data.item)))
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.removeTask(todolistId, taskId)
    .then(() => dispatch(removeTaskAC(taskId, todolistId)))
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
    }).then(() => dispatch(updateTaskAC(taskId, domainModel, todolistId)))
  }
}