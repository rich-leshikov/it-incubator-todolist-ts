import { instance, BaseResponseType } from 'common/api/common.api'

export const authAPI = {
  login: (data: LoginParams) => {
    return instance.post<BaseResponseType<{ userId: number }>>('auth/login', data)
  },
  logout: () => {
    return instance.delete<BaseResponseType>('auth/login')
  },
  me: () => {
    return instance.get<BaseResponseType<AuthMe>>('auth/me')
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