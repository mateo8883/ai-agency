import Nav from '@/components/shared/Nav'
import Footer from '@/components/shared/Footer'
import LoadScreen from '@/components/shared/LoadScreen'
import MorphStage from '@/components/sections/MorphStage'
import SentenceReveal from '@/components/sections/SentenceReveal'
import WhyItWorks from '@/components/sections/WhyItWorks'
import LiveDemo from '@/components/sections/LiveDemo'
import HowItWorks from '@/components/sections/HowItWorks'
import FinalCTA from '@/components/sections/FinalCTA'
import DissolveContact from '@/components/sections/DissolveContact'

export default function Home() {
  return (
    <main>
      <LoadScreen />
      <Nav />
      <MorphStage />
      <LiveDemo />
      <SentenceReveal />
      <WhyItWorks />
      <HowItWorks />
      <FinalCTA />
      <DissolveContact />
      <Footer />
    </main>
  )
}
