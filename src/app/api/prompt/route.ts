// export const runtime = 'edge'
import { NextRequest, NextResponse } from "next/server"
import { getUserPrompts, getPublishPrompts, addPrompt, updatePrompt, likePrompt, delPrompt } from "@/lib/prisma"

// GET: read prompt list
export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams
    const user = params.get('user')
    const page = params.get('page')

    let result = []
    if (user) {
      result = await getUserPrompts(user)
    }
    if (page) {
      result = await getPublishPrompts(Number(page))
    }
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('get prompts error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST: create prompot item
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = body.id ?
      await updatePrompt(body) :
      await addPrompt(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('add/update prompt error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT: like prompot item
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await likePrompt(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('put like prompt error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: delete prompot item
export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await delPrompt(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('delete prompt error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}