import { Link } from 'react-router-dom'
import TopStrip from './sections/TopStrip'
import SiteNav from './sections/SiteNav'
import SiteFooter from './sections/SiteFooter'

type Props = { children: React.ReactNode; backTo?: string; backLabel?: string }

export default function PublicPageShell({ children, backTo = '/', backLabel = 'Back to home' }: Props) {
  return (
    <>
      <TopStrip />
      <SiteNav />
      <div className="book-page-wrap">
        <p className="book-back">
          <Link to={backTo} className="book-back-link">
            ← {backLabel}
          </Link>
        </p>
        {children}
      </div>
      <SiteFooter />
    </>
  )
}
