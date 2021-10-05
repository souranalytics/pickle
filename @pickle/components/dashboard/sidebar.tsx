import compact from 'lodash/compact'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { SideBarLinks } from '@pickle/types/components'

import { Icon } from '../common/icon'
import { Logo } from '../common/logo'
import { AuthCard } from './auth'
import { AppPicker } from './picker'

export const SideBar: FunctionComponent = () => {
  const router = useRouter()

  const [visible, setVisible] = useState(false)

  const slug = String(router.query.app)

  const links: SideBarLinks = [
    [
      {
        href: '',
        icon: 'chart',
        label: 'Dashboard'
      },
      {
        href: 'collaborators',
        icon: 'team',
        label: 'Collaborators'
      },
      {
        href: 'keys',
        icon: 'key',
        label: 'Keys'
      }
    ],
    [
      {
        href: 'events',
        icon: 'calendar',
        label: 'Events'
      },
      {
        href: 'screens',
        icon: 'mobile',
        label: 'Screens'
      },
      {
        href: 'users',
        icon: 'group',
        label: 'Users'
      }
    ]
  ]

  return (
    <>
      <div
        className={twMerge(
          'fixed lg:hidden top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 opacity-0 pointer-events-none transition-opacity',
          visible && 'pointer-events-auto opacity-100'
        )}
        onClick={() => setVisible(false)}
      />
      <button
        className="fixed z-20 p-3 text-white rounded-full bg-primary-600 lg:hidden bottom-4 right-4"
        onClick={() => setVisible(!visible)}>
        <Icon name={visible ? 'close' : 'menu'} size={24} />
      </button>

      <aside
        className={twMerge(
          'fixed lg:static lg:translate-x-0 top-0 bottom-0 left-0 z-10 flex flex-col text-sm transition-transform transform bg-gray-100 right-1/4 lg:border-r lg:border-gray-200 lg:w-52',
          visible ? 'translate-x-0' : '-translate-x-full'
        )}>
        <Link href="/">
          <a className="p-4 lg:hidden">
            <Logo size={24} />
          </a>
        </Link>

        <AppPicker />

        {links.map((links, index) => (
          <div className="mt-4" key={`section-${index}`}>
            {links.map(({ href, icon, label }, index) => {
              const base = `/dashboard/${slug}`
              const url = compact([base, href]).join('/')

              return (
                <Link href={url} key={`item-${index}`}>
                  <a
                    className={twMerge(
                      'flex items-center px-4 py-2 font-medium text-gray-800 hover:bg-white',
                      (href === ''
                        ? router.asPath === url
                        : router.asPath.startsWith(url)) && 'bg-white'
                    )}>
                    <Icon name={icon} />
                    <span className="ml-2">{label}</span>
                  </a>
                </Link>
              )
            })}
          </div>
        ))}

        <AuthCard className="mt-auto" />
      </aside>
    </>
  )
}
