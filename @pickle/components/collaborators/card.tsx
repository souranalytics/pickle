import React, { FunctionComponent } from 'react'
import { twMerge } from 'tailwind-merge'

import { Collaborator, Profile } from '@pickle/types/prisma'

import { Icon } from '../common/icon'

type Props = {
  className?: string
  collaborator: Collaborator & {
    profile: Profile
  }
}

export const CollaboratorCard: FunctionComponent<Props> = ({
  className,
  collaborator
}) => (
  <div
    className={twMerge(
      'flex items-center bg-white rounded-lg shadow p-4',
      className
    )}>
    <div className="flex-1">
      <div className="font-medium">{collaborator.profile.name}</div>
      <div className="text-sm text-gray-600">{collaborator.profile.email}</div>
    </div>

    {collaborator.role === 'owner' && (
      <Icon className="ml-4 text-amber-600" name="crown" />
    )}
  </div>
)
