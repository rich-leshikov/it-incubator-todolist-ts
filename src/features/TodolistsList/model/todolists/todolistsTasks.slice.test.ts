import { todolistsSlice, todolistsThunks } from 'features/TodolistsList/model/todolists/todolists.slice'
import { tasksSlice } from 'features/TodolistsList/model/tasks/tasks.slice'
import { TaskPriorities, TaskStatuses } from 'common/enums/enums'
import { TasksState } from 'features/TodolistsList/model/tasks/task.types'
import { TodolistDomain } from 'features/TodolistsList/model/todolists/todolist.types'

test('ids should be equals', () => {
  const startTasksState: TasksState = {}
  const startTodolistsState: Array<TodolistDomain> = []

  const newTodolistTitle = 'New Todolist'
  const action = {
    type: todolistsThunks.addTodolist.fulfilled.type,
    payload: {
      todolist: {
        id: '231442',
        title: newTodolistTitle,
        addedDate: '',
        order: 0
      }
    }
  }

  const endTasksState = tasksSlice(startTasksState, action)
  const endTodolistsState = todolistsSlice(startTodolistsState, action)

  const idFromTasks = Object.keys(endTasksState)[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

test('property with todolistId should be deleted', () => {
  const startState: TasksState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      }
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        entityStatus: 'idle'
      }
    ]
  }

  const action = {
    type: todolistsThunks.removeTodolist.fulfilled.type,
    payload: { id: 'todolistId2' }
  }

  const endState = tasksSlice(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).toBeUndefined()
})
