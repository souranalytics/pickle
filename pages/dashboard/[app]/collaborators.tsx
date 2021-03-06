import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import useSWR from 'swr'
import { twMerge } from 'tailwind-merge'

import { CollaboratorCard } from '@pickle/components/collaborators/card'
import { CollaboratorCreate } from '@pickle/components/collaborators/create'
import { Message } from '@pickle/components/common/message'
import { Layout } from '@pickle/components/dashboard/layout'
import { getUser } from '@pickle/lib/auth'
import { CollaboratorsResponse } from '@pickle/types/api'

type Props = {
  slug: string
}

const Dashboard: NextPage<Props> = ({ slug }) => {
  const { data, error, isValidating, mutate } = useSWR<CollaboratorsResponse>(
    `/collaborators?slug=${slug}`
  )

  return (
    <Layout
      header={
        <CollaboratorCreate className="m-4" onCreate={mutate} slug={slug} />
      }
      loading={isValidating}
      title="Collaborators">
      {error && (
        <Message className={twMerge(data && 'mb-8')} type="error">
          {error.message}
        </Message>
      )}

      {data && (
        <div className="grid gap-4 lg:grid-cols-3">
          {data.collaborators.map(collaborator => (
            <CollaboratorCard
              collaborator={collaborator}
              key={collaborator.id}
            />
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
