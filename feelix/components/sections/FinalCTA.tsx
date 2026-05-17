'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const { lang } = useLang()
  const finalCta = translations[lang].finalCta

  const sectionRef = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const children = innerRef.current?.children
      if (!children) return
      gsap.fromTo(Array.from(children),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A0A08',
        padding: '120px 48px 140px',
        display: 'flex', justifyContent: 'center',
      }}
    >
      <div
        ref={innerRef}
        style={{
          maxWidth: 680, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 40, textAlign: 'center',
        }}
      >
        <h2
          style={{
            opacity: 0,
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.06,
            letterSpacing: '-0.04em', color: '#F5F0E8',
            margin: 0, whiteSpace: 'pre-line',
          }}
        >
          {finalCta.headline}
        </h2>

        <a
          href="#contact"
          style={{
            opacity: 0,
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: '1rem', letterSpacing: '-0.01em',
            background: '#2EB84B', color: '#0A0A08',
            borderRadius: 100, padding: '16px 44px',
            textDecoration: 'none', display: 'inline-block',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.85'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {finalCta.cta}
        </a>
      </div>
    </section>
  )
}
