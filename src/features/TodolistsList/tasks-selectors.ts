import { AppRootStateType } from 'app/store'

export const tasks = (todolistId: string) => (state: AppRootStateType) => state.tasks[todolistId]