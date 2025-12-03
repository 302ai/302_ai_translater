import { TLoginData, TAuthData } from "./type"
// constants
export const LOCAL_AUTH_KEY = "gpt-translator-auth-v1"

export const DEFAULT_LOGIN_DATA: TLoginData = {
  remember: true,
  domain: '',
  code: '',
}

export const DEFAULT_AUTH_DATA: TAuthData = {
  remember: true,
  domain: '',
  code: '',
  key: '',
  user: '',
  totalLimit: 0,
  todayLimit: 0,
  totalCost: 0,
  todayCost: 0,
}