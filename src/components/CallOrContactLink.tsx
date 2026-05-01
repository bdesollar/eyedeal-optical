import type { MouseEvent, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SITE_LINKS } from '../lib/siteLinks'

type Props = {
  className?: string
  title?: string
  ariaLabel?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

function isMobileCallingDevice() {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent || ''
  const touchPointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) || touchPointer
}

export default function CallOrContactLink({ className, title, ariaLabel, onClick, children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (isMobileCallingDevice()) return

    e.preventDefault()

    if (location.pathname === '/') {
      const target = document.getElementById('contact')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        navigate({ hash: 'contact' }, { preventScrollReset: true })
        return
      }
    }

    navigate('/#contact')
  }

  return (
    <a href={SITE_LINKS.studioTelHref} className={className} title={title} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </a>
  )
}
