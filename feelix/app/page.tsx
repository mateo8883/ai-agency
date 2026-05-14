import Nav from '@/components/shared/Nav'
import Footer from '@/components/shared/Footer'
import LoadScreen from '@/components/shared/LoadScreen'
import MorphStage from '@/components/sections/MorphStage'
import SentenceReveal from '@/components/sections/SentenceReveal'
import WhyItWorks from '@/components/sections/WhyItWorks'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonial from '@/components/sections/Testimonial'
import FinalCTA from '@/components/sections/FinalCTA'
import DissolveContact from '@/components/sections/DissolveContact'

export default function Home() {
  return (
    <main>
      <LoadScreen />
      <Nav />
      <MorphStage />
      <SentenceReveal />
      <WhyItWorks />
      <HowItWorks />
      <Testimonial />
      <FinalCTA />
      <DissolveContact />
      <Footer />
    </main>
  )
}
