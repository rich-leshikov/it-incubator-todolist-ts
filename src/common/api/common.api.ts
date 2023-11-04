import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '99bd0ff6-13b6-4774-a7f5-1bbc0224aa2f'
  }
})

export type BaseResponse<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
  fieldsErrors: FieldError[]
}
type FieldError = {
  error: string
  field: string
}