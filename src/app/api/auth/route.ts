export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server'

// get
export const POST = async (request: NextRequest) => {
  const data = await request.json()

  // validata auth
  // const authUrl = `https://test-api2.proxy302.com/bot/v1/${data.domain}?pwd=${data.code}`
  const authUrl = data.code ?
    `${process.env.NEXT_PUBLIC_302AI_AUTH}${data.domain}?pwd=${data.code}` :
    `${process.env.NEXT_PUBLIC_302AI_AUTH}${data.domain}`


  const authFetch = await fetch(authUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const authRes = await authFetch.json()

  if (authRes.code === 0) {
    const { data } = authRes
    const response = new NextResponse(
      JSON.stringify({
        success: false, message: 'authentication success!', data: {
          name: 'gpt-translator-v1-auth',
          value: data.api_key,
        }
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    )
    // set cookie
    // response.cookies.set({
    //   name: 'gpt-translator-v1-auth',
    //   value: data.api_key,
    // })
    return response
  } else {
    return NextResponse.json(
      { error: authRes.code },
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}
