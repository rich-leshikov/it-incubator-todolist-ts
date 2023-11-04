import { instance, BaseResponse } from 'common/api/common.api'

export const authAPI = {
  login: (data: LoginParams) => {
    return instance.post<BaseResponse<{ userId: number }>>('auth/login', data)
  },
  logout: () => {
    return instance.delete<BaseResponse>('auth/login')
  },
  me: () => {
    return instance.get<BaseResponse<AuthMe>>('auth/me')
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