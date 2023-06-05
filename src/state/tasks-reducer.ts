import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
  todolistId1,
  todolistId2
} from './todolists-reducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI} from '../api/todolist-api';
import {Dispatch} from 'redux';


export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export type TaskActionType =
  AddTaskActionType |
  RemoveTaskActionType |
  ChangeTaskStatusActionType |
  ChangeTaskTitleActionType |
  AddTodolistActionType |
  RemoveTodolistActionType |
  SetTodolistsActionType |
  SetTasksActionType
export type AddTaskActionType = {
  type: 'ADD-TASK'
  title: string
  todolistId: string
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
export type SetTasksActionType = {
  type: 'SET-TASKS'
  tasks: Array<TaskType>
  todolistId: string
}


const initialState: TasksStateType = {
  // [todolistId1]: [
  //   {
  //     id: '1',
  //     title: 'CSS',
  //     status: TaskStatuses.New,
  //     todoListId: 'todolistId1',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0,
  //     priority: TaskPriorities.Low
  //   }, {
  //     id: '2',
  //     title: 'JS',
  //     status: TaskStatuses.Completed,
  //     todoListId: 'todolistId1',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0,
  //     priority: TaskPriorities.Low
  //   }, {
  //     id: '3',
  //     title: 'React',
  //     status: TaskStatuses.New,
  //     todoListId: 'todolistId1',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0,
  //     priority: TaskPriorities.Low
  //   }
  // ],
  // [todolistId2]: [
  //   {
  //     id: '1',
  //     title: 'bread',
  //     status: TaskStatuses.New,
  //     todoListId: 'todolistId2',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0, priority: TaskPriorities.Low
  //   }, {
  //     id: '2',
  //     title: 'milk',
  //     status: TaskStatuses.Completed,
  //     todoListId: 'todolistId2',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0,
  //     priority: TaskPriorities.Low
  //   }, {
  //     id: '3',
  //     title: 'tea',
  //     status: TaskStatuses.New,
  //     todoListId: 'todolistId2',
  //     description: '',
  //     startDate: '',
  //     deadline: '',
  //     addedDate: '',
  //     order: 0,
  //     priority: TaskPriorities.Low
  //   }
  // ]
}


export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionType): TasksStateType => {
  switch (action.type) {
    case 'SET-TASKS':
      return {...state, [action.todolistId]: action.tasks}
    case 'ADD-TASK':
      const newTask: TaskType = {
        id: v1(),
        title: action.title,
        status: TaskStatuses.New,
        todoListId: action.todolistId,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low
      }
      return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
    case 'REMOVE-TASK':
      return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {
          ...t,
          status: action.status
        } : t)
      }
    case 'CHANGE-TASK-TITLE':
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)
      }
    case 'SET-TODOLISTS': {
      const stateCopy = {...state}
      action.todolists.forEach((tl) => {
        stateCopy[tl.id] = []
      })
      return stateCopy
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

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
  return {
    type: 'SET-TASKS',
    tasks,
    todolistId
  }
}
export const addTaskAC = (taskTitle: string, todolistID: string): AddTaskActionType => {
  return {
    type: 'ADD-TASK',
    title: taskTitle,
    todolistId: todolistID
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

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.getTasks(todolistId)
    .then((res) => dispatch(setTasksAC(res.data.items, todolistId)))
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistAPI.deleteTask(todolistId, taskId)
    .then(res => dispatch(removeTaskAC(taskId, todolistId)))
}