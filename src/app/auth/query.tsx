import LocalStorageManager from "../../../utils/LocalStorage"
import { TLoginData, TAuthData } from "./type"
import { LOCAL_AUTH_KEY, DEFAULT_AUTH_DATA } from "./constant"

// Get: local auth data
export const GetLocalAuthDataService = async () => {
  const data = LocalStorageManager.getItem(LOCAL_AUTH_KEY) || DEFAULT_AUTH_DATA
  return data
}
// Update: local auth data
export const UpdateLocalAuthDataService = async (value: TAuthData) => {
  const newData = value
  // 不记住验证码的话要清清除
  if (!newData.remember) {
    newData.code = ''
  }
  LocalStorageManager.setItem(LOCAL_AUTH_KEY, value);
};



// GET: login
export const LoginService = async (values: TLoginData) => {
  const authUrl = values.code ?
    `${process.env.NEXT_PUBLIC_302AI_AUTH}${values.domain}?pwd=${values.code}` :
    `${process.env.NEXT_PUBLIC_302AI_AUTH}${values.domain}`
  const response = await fetch(authUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('网络错误!')
    // throw new Error(response.statusText)
  }

  const data = response.body
  if (!data) {
    throw new Error('数据错误!')
  }

  const res = await response.json()
  if (res.code === -1) {
    throw new Error('验证码错误!')
  }
  if (res.code === -99) {
    throw new Error('验证码错误!')
  }
  if (res.code === -100) {
    throw new Error('账号已被禁用，请联系管理员恢复!')
  }
  if (res.code === -101) {
    throw new Error('账号已被注销，请联系管理员恢复!')
  }
  if (res.code === 0) {
    return {
      ...values,
      key: res.data.api_key,
      user: res.data.created_by,
      totalLimit: res.data.limit_cost,
      todayLimit: res.data.limit_daily_cost,
      totalCost: res.data.cost,
      todayCost: res.data.current_date_cost,
    }
  }
  throw new Error('请求错误!')

}
