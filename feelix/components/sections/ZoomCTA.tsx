'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)

const ORBS = [
  { color: '#E63946', x: '18%',  y: '52%', size: 260 },
  { color: '#F5C611', x: '50%',  y: '35%', size: 340 },
  { color: '#2EB84B', x: '80%',  y: '60%', size: 420 },
]

export default function ZoomCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const st = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom' })

    const tick = () => {
      const p = st.progress ?? 0

      const pullBack = phase(p, 0, 1)
      const bgScale  = 1.14 - pullBack * 0.22
      const bgOpacity = 1 - phase(p, 0.42, 0.80)
      if (bgRef.current) gsap.set(bgRef.current, { scale: bgScale, opacity: bgOpacity })

      const ctaFade = phase(p, 0.58, 0.88)
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: ctaFade, y: (1 - ctaFade) * 36 })
    }

    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill() }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: '220vh', background: '#0A0A08', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Zooming data background */}
        <div ref={bgRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {ORBS.map(({ color, x, y, size }) => (
            <div key={color} style={{
              position: 'absolute', left: x, top: y,
              transform: 'translate(-50%, -50%)',
              width: size, height: size, borderRadius: '50%',
              background: `radial-gradient(circle, ${color}28 0%, transparent 68%)`,
              filter: 'blur(48px)',
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: 'clamp(6rem, 18vw, 14rem)',
              color: 'rgba(245,240,232,0.03)', letterSpacing: '-0.06em',
              userSelect: 'none',
            }}>94%</span>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{
          position: 'relative', zIndex: 5, opacity: 0,
          textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 36, padding: '0 32px',
        }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', lineHeight: 1.08,
            letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0,
          }}>
            Ready to change how your<br />restaurant listens?
          </h2>
          <a
            href="#contact"
            className="hover:opacity-90 transition-opacity"
            style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#2EB84B', color: '#0A0A08',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: '0.9375rem', letterSpacing: '-0.01em',
              padding: '15px 36px', borderRadius: 100,
              textDecoration: 'none',
              boxShadow: '0 0 40px rgba(46,184,75,0.38)',
            }}
          >
            Talk to us
          </a>
        </div>

      </div>
    </section>
  )
}
