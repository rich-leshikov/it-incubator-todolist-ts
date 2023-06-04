import {AddTodolistActionType, RemoveTodolistActionType, todolistId1, todolistId2} from './todolists-reducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses, TaskType} from '../api/todolist-api';


export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export type TaskActionType =
  AddTaskActionType |
  RemoveTaskActionType |
  ChangeTaskStatusActionType |
  ChangeTaskTitleActionType |
  AddTodolistActionType |
  RemoveTodolistActionType
export type AddTaskActionType = {
  type: 'ADD-TASK'
  title: string
  todolistID: string
}
export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  taskID: string
  todolistID: string
}
export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  taskID: string
  status: TaskStatuses
  todolistID: string
}
export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  taskID: string
  title: string
  todolistID: string
}


const initialState: TasksStateType = {
  [todolistId1]: [
    {
      id: '1',
      title: 'CSS',
      status: TaskStatuses.New,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low
    }, {
      id: '2',
      title: 'JS',
      status: TaskStatuses.Completed,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low
    }, {
      id: '3',
      title: 'React',
      status: TaskStatuses.New,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low
    }
  ],
  [todolistId2]: [
    {
      id: '1',
      title: 'bread',
      status: TaskStatuses.New,
      todoListId: 'todolistId2',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0, priority: TaskPriorities.Low
    }, {
      id: '2',
      title: 'milk',
      status: TaskStatuses.Completed,
      todoListId: 'todolistId2',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low
    }, {
      id: '3',
      title: 'tea',
      status: TaskStatuses.New,
      todoListId: 'todolistId2',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low
    }
  ]
}


export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {
  switch (action.type) {
    case 'ADD-TASK':
      const newTask: TaskType = {
        id: v1(),
        title: action.title,
        status: TaskStatuses.New,
        todoListId: action.todolistID,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
      return {...state, [action.todolistID]: [newTask, ...state[action.todolistID]]}
    case 'REMOVE-TASK':
      return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, status: action.status} : t)
      }
    case 'CHANGE-TASK-TITLE':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)
      }
    case 'ADD-TODOLIST':
      return {[action.id]: [], ...state}
    case 'REMOVE-TODOLIST':
      const stateCopy = {...state}
      delete stateCopy[action.id]
      return stateCopy
    default:
      return state
  }
}

export const addTaskAC = (taskTitle: string, todolistID: string): AddTaskActionType => {
  return {
    type: 'ADD-TASK',
    title: taskTitle,
    todolistID: todolistID
  }
}
export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => {
  return {
    type: 'REMOVE-TASK',
    taskID: taskID,
    todolistID: todolistID
  }
}
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string): ChangeTaskStatusActionType => {
  return {
    type: 'CHANGE-TASK-STATUS',
    taskID: taskID,
    status: status,
    todolistID: todolistID
  }
}
export const changeTaskTitleAC = (taskID: string, taskTitle: string, todolistID: string): ChangeTaskTitleActionType => {
  return {
    type: 'CHANGE-TASK-TITLE',
    taskID: taskID,
    title: taskTitle,
    todolistID: todolistID
  }
}