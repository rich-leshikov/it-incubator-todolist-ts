import {v1} from 'uuid';
import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';


export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
}

export type TodolistActionType =
  AddTodolistActionType |
  RemoveTodolistActionType |
  ChangeTodolistTitleActionType |
  ChangeTodolistFilterActionType |
  SetTodolistsActionType
export type AddTodolistActionType = {
  type: 'ADD-TODOLIST'
  id: string
  title: string
  filter: FilterType
}
export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  id: string
}
export type ChangeTodolistTitleActionType = {
  type: 'CHANGE-TODOLIST-TITLE'
  id: string
  title: string
}
export type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER'
  id: string
  filter: FilterType
}
export type SetTodolistsActionType = {
  type: 'SET-TODOLISTS'
  todolists: Array<TodolistType>
}


export const todolistId1 = v1()
export const todolistId2 = v1()

const initialState: TodolistDomainType[] = [
  // {
  //   id: todolistId1,
  //   title: 'What to learn',
  //   addedDate: '',
  //   order: 0,
  //   filter: 'all'
  // }, {
  //   id: todolistId2,
  //   title: 'What to buy',
  //   addedDate: '',
  //   order: 0,
  //   filter: 'all'
  // }
]


export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({...tl, filter: 'all'}))
    case 'ADD-TODOLIST':
      return [{
        id: action.id,
        title: action.title,
        addedDate: '',
        order: 0,
        filter: action.filter
      }, ...state]
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
    default:
      return state
  }
}

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
  return {type: 'SET-TODOLISTS', todolists}
}
export const addTodolistAC = (todolistTitle: string): AddTodolistActionType => {
  return {
    type: 'ADD-TODOLIST',
    id: v1(),
    title: todolistTitle,
    filter: 'all'
  }
}
export const removeTodolistAC = (todolistID: string): RemoveTodolistActionType => {
  return {
    type: 'REMOVE-TODOLIST',
    id: todolistID
  }
}
export const changeTodolistTitleAC = (todolistID: string, todolistTitle: string): ChangeTodolistTitleActionType => {
  return {
    type: 'CHANGE-TODOLIST-TITLE',
    id: todolistID,
    title: todolistTitle
  }
}
export const changeTodolistFilterAC = (todolistID: string, todolistFilter: FilterType): ChangeTodolistFilterActionType => {
  return {
    type: 'CHANGE-TODOLIST-FILTER',
    id: todolistID,
    filter: todolistFilter
  }
}

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
  todolistAPI.getTodolists()
    .then(res => dispatch(setTodolistsAC(res.data)))
}
