import { instance, ResponseType } from 'common/api/common.api'

export const authAPI = {
  login: (data: LoginParams) => {
    return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
  },
  logout: () => {
    return instance.delete<ResponseType>('auth/login')
  },
  me: () => {
    return instance.get<ResponseType<AuthMe>>('auth/me')
  }
}

export type AuthMe = {
  id: number
  email: string
  login: string
}
export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}