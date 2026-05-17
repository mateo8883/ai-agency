'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createNoise3D } from 'simplex-noise'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'
import { BackgroundBeams } from '@/components/ui/background-beams'

gsap.registerPlugin(ScrollTrigger)

const noise = createNoise3D()

const BTNS = [
  { color: '#E63946', label: 'Alertas',  value: 14  },
  { color: '#F5C611', label: 'Neutral',  value: 38  },
  { color: '#2EB84B', label: 'Positivo', value: 247 },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

export default function MorphStage() {
  const { lang } = useLang()
  const t = translations[lang]

  const sectionRef    = useRef<HTMLDivElement>(null)
  const heroCopyRef   = useRef<HTMLDivElement>(null)
  const dashIntroRef  = useRef<HTMLDivElement>(null)
  const beamsWrapRef  = useRef<HTMLDivElement>(null)
  const buttonRefs    = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([])
  const valueRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([])
  const endPos        = useRef<{ x: number; y: number }[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const measure = () => {
      // When sticky is active the section's top is ≤ 0.
      // Before the user scrolls in, section.top = Nav height (~56px).
      // Subtracting that offset makes endPos the same regardless of when measure() runs.
      const navOffset = Math.max(0, section.getBoundingClientRect().top)
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        endPos.current[i] = {
          x: r.left + r.width / 2 - window.innerWidth / 2,
          y: r.top - navOffset - window.innerHeight / 2 - 58,
        }
      })
    }
    measure()
    requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)

    const st = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom' })

    const tick = (time: number) => {
      const p = st.progress ?? 0

      const heroFade = phase(p, 0.15, 0.38)
      if (heroCopyRef.current)   gsap.set(heroCopyRef.current,   { opacity: 1 - heroFade, y: -heroFade * 40 })

      const beamPeak = phase(p, 0.28, 0.55)
      const beamSettle = phase(p, 0.65, 0.90)
      if (beamsWrapRef.current) gsap.set(beamsWrapRef.current, { opacity: beamPeak * (1 - beamSettle * 0.7) * 0.62 })

      const introFade = phase(p, 0.48, 0.72)
      if (dashIntroRef.current) gsap.set(dashIntroRef.current, { opacity: introFade, y: (1 - introFade) * 32 })

      const morph = phase(p, 0.18, 0.82)
      const isMobile    = window.innerWidth < 768
      const heroOffsetX = isMobile ? 0 : window.innerWidth * 0.22
      const heroSpread  = isMobile ? Math.min(94, window.innerWidth * 0.26) : 165
      const heroScale   = isMobile ? 1.15 : 1.65
      const dashScale   = 0.55

      const dotFade = 1 - phase(p, 0.62, 0.80)

      buttonRefs.current.forEach((btn, i) => {
        if (!btn) return
        const nx = noise(i * 7, 0, time * 0.00038) * 8
        const ny = noise(0, i * 7, time * 0.00038) * 8
        const heroX = heroOffsetX + (i - 1) * heroSpread
        const ep = endPos.current[i]
        gsap.set(btn, {
          x: lerp(heroX, ep.x, morph) + nx,
          y: lerp(0, ep.y, morph) + ny * morph,
          scale: lerp(heroScale, dashScale, morph),
          opacity: dotFade,
        })
      })

      const cardFade = phase(p, 0.68, 0.88)
      cardRefs.current.forEach(c => { if (c) gsap.set(c, { opacity: cardFade }) })
      labelRefs.current.forEach(l => { if (l) gsap.set(l, { opacity: cardFade }) })

      const valP = phase(p, 0.74, 0.95)
      valueRefs.current.forEach((v, i) => {
        if (!v) return
        v.textContent = Math.round(BTNS[i].value * valP).toString()
        gsap.set(v, { opacity: valP })
      })
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: '300vh', background: '#0A0A08', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <div ref={beamsWrapRef} style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}>
          <BackgroundBeams />
        </div>

        <div ref={heroCopyRef} className="fx-hero-copy" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, padding: '0 64px', zIndex: 5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,198,17,0.08)', border: '1px solid rgba(245,198,17,0.22)', borderRadius: 100, padding: '5px 14px 5px 10px', alignSelf: 'flex-start' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F5C611', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#F5C611' }}>{t.hero.label}</span>
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)', lineHeight: 1.05, letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0, whiteSpace: 'pre-line' as const }}>
            {t.hero.headline}
          </h1>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.0625rem', lineHeight: 1.7, color: 'rgba(245,240,232,0.5)', maxWidth: '22ch', margin: 0 }}>{t.hero.body}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
            <a
              href="#contact"
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: '0.9375rem', letterSpacing: '-0.01em',
                background: '#2EB84B', color: '#0A0A08',
                borderRadius: 100, padding: '14px 32px',
                textDecoration: 'none', display: 'inline-block',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {t.hero.cta}
            </a>
            <a
              href="#how-it-works"
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400,
                fontSize: '0.9375rem', color: 'rgba(245,240,232,0.55)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.55)')}
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

        </div>

        <div ref={dashIntroRef} style={{ position: 'absolute', left: '50%', top: '10%', transform: 'translateX(-50%)', width: 'min(640px, 88vw)', opacity: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,198,17,0.08)', border: '1px solid rgba(245,198,17,0.22)', borderRadius: 100, padding: '5px 14px 5px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F5C611', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#F5C611' }}>{t.dashboard.label}</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.08, letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0, whiteSpace: 'pre-line' as const }}>{t.dashboard.headline}</h2>
        </div>

        <div style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%, -50%)', width: 'min(880px, 92vw)', zIndex: 3 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {BTNS.map(({ color, label }, i) => (
              <div key={i} ref={el => { cardRefs.current[i] = el }} style={{ opacity: 0, background: 'rgba(245,240,232,0.025)', border: '1px solid rgba(245,240,232,0.06)', borderRadius: 14, padding: '36px 20px 28px', textAlign: 'center' }}>
                <span ref={el => { valueRefs.current[i] = el }} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color, letterSpacing: '-0.03em', lineHeight: 1, display: 'block', opacity: 0, fontVariantNumeric: 'tabular-nums' }}>0</span>
                <div ref={el => { labelRefs.current[i] = el }} style={{ opacity: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginTop: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, zIndex: 8 }}>
          {BTNS.map(({ color }, i) => (
            <div key={i} ref={el => { buttonRefs.current[i] = el }} style={{
              position: 'absolute', left: -32, top: -32, width: 64, height: 64,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${color}EE, ${color} 55%, ${color}AA 100%)`,
              boxShadow: `0 0 36px 8px ${color}55, inset 0 0 0 1.5px rgba(255,255,255,0.1)`,
              pointerEvents: 'none',
            }} />
          ))}
        </div>

      </div>
    </section>
  )
}
