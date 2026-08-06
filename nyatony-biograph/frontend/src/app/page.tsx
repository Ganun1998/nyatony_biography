import HeroSection from '@/components/sections/HeroSection'
import MusicPlayerSection from '@/components/sections/MusicPlayerSection'
import BiographySection from '@/components/sections/BiographySection'
import FamilySection from '@/components/sections/FamilySection'
import FAQSection from '@/components/sections/FAQSection'
import GalleryPreview from '@/components/sections/GalleryPreview'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BiographySection />
      <FamilySection />
      <MusicPlayerSection />
      <GalleryPreview />
       <FAQSection />
    </>
  )
}
