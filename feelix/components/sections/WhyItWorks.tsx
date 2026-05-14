'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { whyItWorks } from '@/config/site'

gsap.registerPlugin(ScrollTrigger)

const COLOR_MAP = {
  green: '#2EB84B',
  amber: '#F5C611',
  red:   '#E63946',
}

const ICONS = {
  green: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="#2EB84B" strokeWidth="1.5" />
      <path d="M7 11.5l2.5 2.5 5.5-5.5" stroke="#2EB84B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  amber: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="#F5C611" strokeWidth="1.5" />
      <path d="M11 7v4.5l3 1.5" stroke="#F5C611" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  red: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="#E63946" strokeWidth="1.5" />
      <path d="M8 8l6 6M14 8l-6 6" stroke="#E63946" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
}

export default function WhyItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' } }
      )

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: card, start: 'top 85%' } }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="product"
      style={{ background: '#0A0A08', padding: '120px 48px 140px' }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        <div ref={headRef} style={{ opacity: 0, marginBottom: 72, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
            fontSize: '0.65rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#F5C611',
          }}>
            {whyItWorks.label}
          </span>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.06,
            letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0,
            whiteSpace: 'pre-line',
          }}>
            {whyItWorks.headline}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {whyItWorks.cards.map(({ color, title, body }, i) => {
            const hex = COLOR_MAP[color]
            return (
              <div
                key={i}
                ref={el => { cardsRef.current[i] = el }}
                style={{
                  opacity: 0,
                  background: `linear-gradient(135deg, rgba(245,240,232,0.03) 0%, rgba(245,240,232,0.015) 100%)`,
                  border: `1px solid ${hex}22`,
                  borderRadius: 20,
                  padding: '40px 36px 44px',
                  display: 'flex', flexDirection: 'column', gap: 20,
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = hex + '55' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = hex + '22' }}
              >
                {/* subtle accent glow in corner */}
                <div style={{
                  position: 'absolute', bottom: -40, right: -40,
                  width: 140, height: 140, borderRadius: '50%',
                  background: hex, opacity: 0.05, filter: 'blur(32px)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {ICONS[color]}
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    fontSize: '0.65rem', letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: hex,
                  }}>
                    {title}
                  </span>
                </div>

                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400,
                  fontSize: '1rem', lineHeight: 1.7,
                  color: 'rgba(245,240,232,0.55)', margin: 0,
                }}>
                  {body}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
