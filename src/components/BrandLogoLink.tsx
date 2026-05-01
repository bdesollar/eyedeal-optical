import { Link } from 'react-router-dom'

const LOGO_SRC = '/eyedeal-logo-full.png'
const LOGO_ALT = 'Eyedeal Optical'

type Props = {
  variant: 'nav' | 'footer'
  onClick?: () => void
  className?: string
}

export default function BrandLogoLink({ variant, onClick, className = '' }: Props) {
  if (variant === 'nav') {
    return (
      <Link to="/" className={`logo logo--brand-img logo--nav-bar ${className}`} onClick={onClick}>
        <img src={LOGO_SRC} alt={LOGO_ALT} className="logo-img logo-img--nav" />
      </Link>
    )
  }

  return (
    <Link to="/" className={`logo logo--brand-img logo--footer-brand ${className}`} onClick={onClick}>
      <img src={LOGO_SRC} alt={LOGO_ALT} className="logo-img logo-img--footer" />
    </Link>
  )
}
