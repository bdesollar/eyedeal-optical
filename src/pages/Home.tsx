import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import TopStrip from '../components/sections/TopStrip'
import SiteNav from '../components/sections/SiteNav'
import HeroSection from '../components/sections/HeroSection'
import StorySection from '../components/sections/StorySection'
import ServicesSection from '../components/sections/ServicesSection'
import DesignersSection from '../components/sections/DesignersSection'
import LensTechSection from '../components/sections/LensTechSection'
import EyeHealthSection from '../components/sections/EyeHealthSection'
import InsuranceSection from '../components/sections/InsuranceSection'
import ContactSection from '../components/sections/ContactSection'
import SiteFooter from '../components/sections/SiteFooter'

export default function Home() {
  const location = useLocation()
  useReveal()

  useLayoutEffect(() => {
    if (location.pathname !== '/') return
    const h = location.hash
    if (!h || h.length < 2) return
    const id = h.slice(1)
    if (!/^[A-Za-z][\w:-]*$/.test(id)) return
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.pathname, location.hash])

  return (
    <>
      <TopStrip />
      <SiteNav />
      <HeroSection />
      <StorySection />
      <ServicesSection />
      <DesignersSection />
      <LensTechSection />
      <EyeHealthSection />
      <InsuranceSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
