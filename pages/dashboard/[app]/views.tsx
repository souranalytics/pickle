import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { twMerge } from 'tailwind-merge'

import { Message } from '@pickle/components/common/message'
import { Layout } from '@pickle/components/dashboard/layout'
import { Pagination } from '@pickle/components/dashboard/pagination'
import { ViewCard } from '@pickle/components/views/card'
import { getUser } from '@pickle/lib/auth'
import { ViewsResponse } from '@pickle/types/api'

type Props = {
  slug: string
}

const Dashboard: NextPage<Props> = ({ slug }) => {
  const router = useRouter()

  const url = useMemo(() => {
    const query = new URLSearchParams({
      slug
    })

    if (router.query.after !== undefined) {
      query.set('after', String(router.query.after))
    }

    return `/views?${query.toString()}`
  }, [router.query.after, slug])

  const { data, error, isValidating } = useSWR<ViewsResponse>(url)

  return (
    <Layout
      header={
        <Pagination
          className="m-4"
          next={data?.next}
          onChange={id => router.push(`/dashboard/${slug}/views?after=${id}`)}
        />
      }
      loading={isValidating}
      title="Views">
      {error && (
        <Message className={twMerge(data && 'mb-8')} type="error">
          {error.message}
        </Message>
      )}

      {data && (
        <div className="overflow-x-auto whitespace-pre">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>User</th>
                <th colSpan={2}>Created</th>
              </tr>
            </thead>

            <tbody className="font-mono text-sm">
              {data.views.map(view => (
                <ViewCard key={view.id} view={view} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req
}) => {
  const user = await getUser(req)

  if (!user) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false
      }
    }
  }

  return {
    props: {
      slug: String(query.app)
    }
  }
}

export default Dashboard
