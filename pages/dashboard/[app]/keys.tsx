import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import useSWR from 'swr'
import { twMerge } from 'tailwind-merge'

import { Message } from '@pickle/components/common/message'
import { Layout } from '@pickle/components/dashboard/layout'
import { KeyCard } from '@pickle/components/keys/card'
import { KeyCreate } from '@pickle/components/keys/create'
import { getUser } from '@pickle/lib/auth'
import { KeysResponse } from '@pickle/types/api'

type Props = {
  slug: string
}

const Dashboard: NextPage<Props> = ({ slug }) => {
  const { data, error, isValidating, mutate } = useSWR<KeysResponse>(
    `/keys?slug=${slug}`
  )

  return (
    <Layout
      header={<KeyCreate className="m-4" onCreate={mutate} slug={slug} />}
      loading={isValidating}
      title="Keys">
      {error && (
        <Message className={twMerge(data && 'mb-8')} type="error">
          {error.message}
        </Message>
      )}

      {data && (
        <div className="grid gap-4 lg:grid-cols-3">
          {data.keys.map(key => (
            <KeyCard data={key} key={key.id} />
          ))}
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
