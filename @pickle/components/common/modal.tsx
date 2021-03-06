import React, { FunctionComponent } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
  visible: boolean

  onClose: () => void
}

export const Modal: FunctionComponent<Props> = ({
  children,
  className,
  onClose,
  visible
}) => {
  if (visible) {
    return createPortal(
      <div
        className="fixed top-0 bottom-0 cursor-[zoom-out] left-0 right-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 lg:p-8"
        onClick={event => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}>
        <div
          className={twMerge(
            'bg-white shadow-xl max-h-full overflow-auto rounded-xl w-full cursor-default lg:w-96',
            className
          )}>
          {children}
        </div>
      </div>,
      document.querySelector('#modal') as Element
    )
  }

  return null
}
