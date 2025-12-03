// export const runtime = 'edge'
import { NextRequest, NextResponse } from "next/server"
import { getPublishPosts, getFilterPosts, addPost, updatePost, likePost, delPost } from "@/lib/prisma"

// GET: read post list
export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams
    const page = params.get('page') || 1
    const size = params.get('size') || 10
    const status = params.get('status')
      ? params.get('status')?.split(',').map(num => Number(num))
      : [1, 2]
    const filter = params.get('filter') || ''
    let result = {}
    if (page) {
      if (filter) {
        result = await getFilterPosts(Number(page), Number(size), status, filter)
      } else {
        result = await getPublishPosts(Number(page), Number(size), status)
      }
    }
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('get posts error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST: create prompot item
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = body.id ?
      await updatePost(body) :
      await addPost(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('add/update post error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT: like prompot item
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await likePost(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('put like post error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: delete prompot item
export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await delPost(body)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.log('delete post error::', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}