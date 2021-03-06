import { NextApiHandler, NextApiResponse } from 'next'
import connect from 'next-connect'
import { z } from 'zod'

import {
  apiOptions,
  getApp,
  getAppByKey,
  getUser,
  validateData
} from '@pickle/lib/api'
import { prisma } from '@pickle/lib/prisma'
import { upstash } from '@pickle/lib/upstash'
import { zodJson } from '@pickle/lib/zod'
import { ViewResponse, ViewsResponse } from '@pickle/types/api'
import { DashboardType } from '@pickle/types/dashboard'

const schemaGet = z.object({
  after: z
    .string()
    .optional()
    .transform(id => (id ? Number(id) : undefined)),
  slug: z.string()
})

const schemaPost = z.object({
  data: zodJson,
  meta: zodJson,
  name: z.string(),
  userId: z.string()
})

const handler: NextApiHandler = connect(apiOptions)
  .get(async (req, res: NextApiResponse<ViewsResponse>) => {
    const user = await getUser(req)

    const { after, slug } = validateData(schemaGet, req.query)

    const app = await getApp(user, slug)

    const views = await prisma.view.findMany({
      cursor:
        after !== undefined
          ? {
              id: after
            }
          : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      skip: after !== undefined ? 1 : undefined,
      take: 100,
      where: {
        app: {
          id: app.id
        }
      }
    })

    res.json({
      next: views[99]?.id,
      views
    })
  })
  .post(async (req, res: NextApiResponse<ViewResponse>) => {
    const app = await getAppByKey(req)

    const { data, meta, name, userId } = validateData(schemaPost, req.body)

    const view = await prisma.view.create({
      data: {
        app: {
          connect: {
            id: app.id
          }
        },
        data,
        meta,
        name,
        userId
      }
    })

    await upstash.increment(app.id, DashboardType.view)

    res.json({
      view
    })
  })

export default handler
