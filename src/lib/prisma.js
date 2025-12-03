import { PrismaClient } from '@prisma/client'

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


// Promps////////////////////////////////
// 查询当前用户所有prompt
export async function getUserPrompts(user) {
  const list = await prisma.prompt.findMany(
    {
      where: {
        author: user,
        status: {
          gt: 0
        }
      },
      orderBy: [
        {
          id: 'desc' // 按id从大到小排序
        }
      ]
    }
  )
  return list
}
// 查询所有prompt
export async function getPublishPrompts(page = 1) {
  const list = await prisma.prompt.findMany(
    {
      where: {
        status: 2
      },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: [
        {
          like: 'desc' // 按点赞数从最多到最少排序
        },
        {
          id: 'desc' // 按id从大到小排序
        }
      ]

    }
  )
  return list
}

export async function addPrompt(data) {
  const result = await prisma.prompt.create({
    data: {
      like: data.like,
      status: data.status,
      agent: data.agent,
      author: data.author,
      name: data.name,
      content: data.content,
      origin: data.origin,
      target: data.target,
    },
  })
  return result
}

export async function updatePrompt(data) {
  const result = await prisma.prompt.update({
    where: {
      id: data.id
    },
    data: {
      like: data.like,
      status: data.status,
      agent: data.agent,
      author: data.author,
      name: data.name,
      content: data.content,
      origin: data.origin,
      target: data.target,
    }
  })
  return result
}

export async function likePrompt(data) {
  const post = await prisma.prompt.findUnique({ where: { id: data.id } });
  const result = await prisma.prompt.update({
    where: {
      id: data.id
    },
    data: { like: post.like + 1 },
  })
  return result
}

export async function delPrompt(data) {
  const result = await prisma.prompt.update({
    where: {
      id: data.id
    },
    data: {
      status: 0,
    }
  })
  return result
}


// Post////////////////////////////////
// 查询当前用户所有post
// export async function getUserPosts(user) {
//   const list = await prisma.post.findMany(
//     {
//       where: {
//         author: user,
//         status: {
//           gt: 0
//         }
//       }
//     }
//   )
//   return list
// }

// 查询当前用户所有post
export async function getPublishPosts(page, size, status) {
  const list = await prisma.post.findMany(
    {
      where: {
        status: {
          in: status
        }
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: [
        {
          like: 'desc' // 按点赞数从最多到最少排序
        },
        {
          id: 'desc' // 按id从大到小排序
        }
      ]

    }
  )
  const count = await prisma.post.count(
    {
      where: {
        status: {
          in: status
        }
      },
    }
  )
  return { list, count }
}

// 搜索当前用户所有post
export async function getFilterPosts(page, size, status, filter) {
  const list = await prisma.post.findMany(
    {
      where: {
        status: {
          in: status
        },
        OR: [
          { name: { contains: filter } },
          { content: { contains: filter } },
        ],
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: [
        {
          like: 'desc' // 按点赞数从最多到最少排序
        },
        {
          id: 'desc' // 按id从大到小排序
        }
      ]

    }
  )
  const count = await prisma.post.count(
    {
      where: {
        status: {
          in: status
        },
        OR: [
          { name: { contains: filter } },
          { content: { contains: filter } },
        ],
      },
    }
  )
  return { list, count }
}

export async function addPost(data) {
  const exit = await prisma.post.findFirst({
    where: {
      author: data.author,
      name: data.name,
      content: data.content,
      status: {
        gt: 0
      }
    },
  });
  if (exit) {
    return null
  }
  const result = await prisma.post.create({
    data: {
      like: data.like,
      status: data.status,
      agent: data.agent,
      author: data.author,
      name: data.name,
      content: data.content,
      origin: data.origin,
      target: data.target,
    },
  })
  return result
}

export async function updatePost(data) {
  const result = await prisma.post.update({
    where: {
      id: data.id
    },
    data: {
      like: data.like,
      status: data.status,
      agent: data.agent,
      author: data.author,
      name: data.name,
      content: data.content,
      origin: data.origin,
      target: data.target,
    }
  })
  return result
}

export async function likePost(data) {
  const post = await prisma.post.findUnique({ where: { id: data.id } });
  const result = await prisma.post.update({
    where: {
      id: data.id
    },
    data: { like: post.like + 1 },
  })
  return result
}

export async function delPost(data) {
  const result = await prisma.post.update({
    where: {
      id: data.id
    },
    data: {
      status: 0,
    }
  })
  return result
}

export default prisma
