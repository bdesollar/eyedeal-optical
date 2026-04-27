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
  useReveal()
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
