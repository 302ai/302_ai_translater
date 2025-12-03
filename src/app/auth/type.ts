// interface
export interface TLoginData {
  remember: boolean,
  domain: string,
  code: string,
}

// interface
export interface TAuthData {
  remember: boolean,
  domain: string,
  code: string,
  key: string,
  user: string,
  totalLimit: number,
  todayLimit: number,
  totalCost: number,
  todayCost: number,
}