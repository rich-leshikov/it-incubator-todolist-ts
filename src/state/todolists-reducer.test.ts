import {
  addTodolistAC,
  changeTodolistFilterAC,
  updateTodolistAC,
  FilterType,
  removeTodolistAC,
  todolistsReducer,
  TodolistDomainType
} from './todolists-reducer'
import {v1} from 'uuid'


let todolistId1: string
let todolistId2: string
let todolistId3: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  todolistId3 = v1()

  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      addedDate: '',
      order: 0,
      filter: 'all'
    }, {
      id: todolistId2,
      title: 'What to buy',
      addedDate: '',
      order: 0,
      filter: 'all'
    }
  ]
})


test('todolist should be removed', () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('todolist should be added', () => {
  const newTodolistTitle = 'New Todolist'

  const endState = todolistsReducer(startState, addTodolistAC({
    id: todolistId3,
    title: 'New Todolist',
    addedDate: '',
    order: 0
  }))

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
})

test('todolist should change its name', () => {
  const newTodolistTitle = 'New Todolist'
  const action = updateTodolistAC(todolistId2, newTodolistTitle)

  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(2)
  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('filter of todolist should be changed', () => {
  const newFilter: FilterType = 'completed'
  const action = changeTodolistFilterAC(todolistId2, newFilter)

  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})
