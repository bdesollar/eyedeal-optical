import TopStrip from './sections/TopStrip'
import SiteNav from './sections/SiteNav'
import SiteFooter from './sections/SiteFooter'

type Props = { children: React.ReactNode }

/** Shared chrome for marketing subpages (same strip + nav + footer as home). */
export default function PublicPageShell({ children }: Props) {
  return (
    <>
      <TopStrip />
      <SiteNav />
      <div className="subpage-shell">{children}</div>
      <SiteFooter />
    </>
  )
}
