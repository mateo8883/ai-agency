'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

gsap.registerPlugin(ScrollTrigger)

export default function ProductShowcase() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const headRef     = useRef<HTMLDivElement>(null)
  const deviceWrap  = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([])
  const btnRefs     = useRef<(HTMLDivElement | null)[]>([])
  const glowRefs    = useRef<(HTMLDivElement | null)[]>([])

  const { lang } = useLang()
  const t = translations[lang].product

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' } }
      )

      gsap.fromTo(deviceWrap.current,
        { opacity: 0, y: 72 },
        { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: deviceWrap.current, start: 'top 80%' } }
      )

      btnRefs.current.forEach((btn, i) => {
        if (!btn) return
        gsap.to(btn, {
          scale: 1.06,
          duration: 1.1 + i * 0.15,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.38,
        })
      })

      glowRefs.current.forEach((g, i) => {
        if (!g) return
        gsap.to(g, {
          opacity: 0.55,
          scale: 1.25,
          duration: 1.3 + i * 0.18,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.38,
        })
      })

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%' } }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="product-device"
      style={{ background: '#0A0A08', padding: '140px 48px 160px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle ambient background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 800, height: 400,
        background: 'radial-gradient(ellipse, rgba(245,198,17,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 72 }}>

        {/* Header */}
        <div ref={headRef} style={{ opacity: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,198,17,0.08)', border: '1px solid rgba(245,198,17,0.22)', borderRadius: 100, padding: '5px 14px 5px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F5C611', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#F5C611' }}>{t.label}</span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.06, letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0, whiteSpace: 'pre-line' as const, textAlign: 'center' }}>
            {t.headline}
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: 'rgba(245,240,232,0.42)', maxWidth: '38ch', margin: 0 }}>
            {t.body}
          </p>
        </div>

        {/* Device */}
        <div ref={deviceWrap} style={{ opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, perspective: '900px' }}>

          {/* Device body */}
          <div style={{
            width: 380, height: 218,
            background: 'linear-gradient(160deg, #2E2B28 0%, #1C1A18 55%, #111010 100%)',
            borderRadius: 52,
            border: '1.5px solid rgba(255,255,255,0.07)',
            boxShadow: '0 48px 96px rgba(0,0,0,0.9), 0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 26, padding: '24px 40px',
            position: 'relative', overflow: 'hidden',
            transform: 'rotateX(14deg)',
            transformStyle: 'preserve-3d' as const,
          }}>
            {/* Edge highlight */}
            <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: 'rgba(255,255,255,0.08)' }} />
            {/* Bottom edge shadow */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', pointerEvents: 'none' }} />

            {/* Logo mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                <circle cx="3"   cy="5" r="3" fill="#E63946" opacity="0.4" />
                <circle cx="13"  cy="5" r="3" fill="#F5C611" opacity="0.4" />
                <circle cx="23"  cy="5" r="3" fill="#2EB84B" opacity="0.4" />
              </svg>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.6rem', color: 'rgba(245,240,232,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>feelix</span>
            </div>

            {/* 3 buttons */}
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {t.buttons.map(({ color, glow }, i) => (
                <div key={i} ref={el => { btnRefs.current[i] = el }} style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: `radial-gradient(circle at 36% 28%, ${color}FF, ${color}D0 50%, ${color}80 100%)`,
                  boxShadow: `0 10px 28px ${glow}, 0 4px 8px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.28), inset 0 2px 4px rgba(255,255,255,0.14)`,
                  position: 'relative' as const, flexShrink: 0,
                }}>
                  <div style={{ position: 'absolute', top: '20%', left: '20%', width: '32%', height: '24%', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', filter: 'blur(3px)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Surface glow pools */}
          <div style={{ display: 'flex', gap: 32, marginTop: 8, paddingLeft: 0 }}>
            {t.buttons.map(({ color }, i) => (
              <div key={i} ref={el => { glowRefs.current[i] = el }} style={{
                width: 68, height: 16, borderRadius: '50%',
                background: color, opacity: 0.3,
                filter: 'blur(14px)',
                flexShrink: 0,
              }} />
            ))}
          </div>

          {/* Table surface line */}
          <div style={{ width: 480, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,240,232,0.06) 30%, rgba(245,240,232,0.06) 70%, transparent)', marginTop: 2 }} />
        </div>

        {/* Button explanation cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%' }}>
          {t.buttons.map(({ color, glow, title, desc }, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el }}
              style={{
                opacity: 0,
                background: `linear-gradient(135deg, rgba(245,240,232,0.03) 0%, rgba(245,240,232,0.015) 100%)`,
                border: `1px solid ${color}22`,
                borderRadius: 20,
                padding: '32px 28px 36px',
                display: 'flex', flexDirection: 'column', gap: 16,
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + '55' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + '22' }}
            >
              {/* Corner glow */}
              <div style={{ position: 'absolute', bottom: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: color, opacity: 0.04, filter: 'blur(32px)', pointerEvents: 'none' }} />

              {/* Button dot */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 36% 28%, ${color}FF, ${color}CC 55%, ${color}88 100%)`,
                boxShadow: `0 6px 20px ${glow}, inset 0 -2px 4px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.12)`,
                position: 'relative' as const,
              }}>
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '30%', height: '22%', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', filter: 'blur(2px)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color }}>{title}</span>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.65, color: 'rgba(245,240,232,0.5)', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
