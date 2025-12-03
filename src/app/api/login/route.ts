export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server'

// admin account
const account = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
}

// post
export const POST = async (request: NextRequest) => {
  const data = await request.json()
  const isAuth = JSON.stringify(data) === JSON.stringify(account)
  const token = {
    name: process.env.ADMIN_TOEKN_NAME || '',
    value: process.env.ADMIN_TOEKN_VALUE || '',
  }

  if (isAuth) {
    const response = new NextResponse(
      JSON.stringify({
        success: false, message: 'login success!', data: {
          token: token,
        }
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    )
    // set cookie
    response.cookies.set(token)
    return response
  } else {
    return NextResponse.json({ error: '账户信息错误' }, { status: 401 })
  }
}
