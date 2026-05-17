'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { createNoise2D } from 'simplex-noise'

gsap.registerPlugin(ScrollTrigger)
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

const noise = createNoise2D()

const COLORS = [
  { id: 'red'   as const, color: '#E63946', glow: 'rgba(230,57,70,0.5)'   },
  { id: 'amber' as const, color: '#F5C611', glow: 'rgba(245,198,17,0.5)'  },
  { id: 'green' as const, color: '#2EB84B', glow: 'rgba(46,184,75,0.5)'   },
]

export default function LiveDemo() {
  const { lang } = useLang()
  const t = translations[lang].product

  const [activeStep, setActiveStep] = useState(0)

  const sectionRef  = useRef<HTMLDivElement>(null)
  const btnRefs     = useRef<(HTMLButtonElement | null)[]>([])
  const glowRefs    = useRef<(HTMLDivElement | null)[]>([])
  const ambientRef  = useRef<HTMLDivElement>(null)
  const haloRefs    = useRef<(HTMLDivElement | null)[]>([])

  // Glow pools — slow, calm breathing
  useEffect(() => {
    glowRefs.current.forEach((g, i) => {
      if (!g) return
      gsap.to(g, { opacity: 0.5, scale: 1.16, duration: 2.6 + i * 0.32, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.55 })
    })
  }, [])

  // Ambient candlelight — organic warm flicker
  useEffect(() => {
    const el = ambientRef.current
    if (!el) return
    const tick = (time: number) => {
      const n  = noise(time * 0.00022, 0)
      const n2 = noise(0, time * 0.00041)
      gsap.set(el, { opacity: 0.72 + n * 0.28, scale: 1 + n2 * 0.05 })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let lastStep = -1

    const pressButtons = (step: number) => {
      setActiveStep(step)
      btnRefs.current.forEach((btn, i) => {
        if (!btn) return
        const halo = haloRefs.current[i]
        if (i < step) {
          // tactile depress into the tabletop, then soft settle
          gsap.timeline({ overwrite: true })
            .to(btn, { scale: 0.93, scaleY: 0.82, y: 4, duration: 0.16, ease: 'power3.in' })
            .to(btn, { scale: 1, scaleY: 0.9, y: 2, duration: 0.7, ease: 'expo.out' })
          // service-call halo radiates outward once
          if (halo) {
            gsap.fromTo(halo,
              { scale: 0.55, opacity: 0.5 },
              { scale: 1.9, opacity: 0, duration: 1.1, ease: 'power2.out', overwrite: true })
          }
        } else {
          gsap.to(btn, { scale: 1, scaleY: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true })
          if (halo) gsap.set(halo, { opacity: 0 })
        }
      })
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: [0, 1 / 3, 2 / 3, 1],
        duration: { min: 0.5, max: 0.9 },
        ease: 'power3.inOut',
        delay: 0.1,
      },
      onUpdate: (self) => {
        const step = Math.round((self.progress ?? 0) * 3)
        if (step !== lastStep) {
          lastStep = step
          pressButtons(step)
        }
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="producto"
      style={{ height: '300vh', background: '#0A0A08', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Ambient candlelight glow */}
      <div ref={ambientRef} style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 860, height: 440,
        background: 'radial-gradient(ellipse, rgba(245,184,90,0.06) 0%, rgba(245,198,17,0.02) 45%, transparent 72%)',
        pointerEvents: 'none', willChange: 'opacity, transform',
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>

        {/* Header — real copy from translations */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
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

        {/* Device + surface */}
        <div className="fx-scale-device" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, perspective: '900px' }}>

          {/* Device body */}
          <div style={{
            width: 380, height: 218,
            background: 'linear-gradient(160deg, #2E2B28 0%, #1C1A18 55%, #111010 100%)',
            borderRadius: 52,
            border: '1.5px solid rgba(255,255,255,0.07)',
            boxShadow: '0 48px 96px rgba(0,0,0,0.9), 0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 26, padding: '24px 40px',
            position: 'relative',
          }}>
            {/* Edge highlight */}
            <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: 'rgba(255,255,255,0.08)' }} />
            {/* Bottom shadow */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', pointerEvents: 'none' }} />

            {/* Logo + TRY IT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                <circle cx="3"  cy="5" r="3" fill="#E63946" opacity="0.4" />
                <circle cx="13" cy="5" r="3" fill="#F5C611" opacity="0.4" />
                <circle cx="23" cy="5" r="3" fill="#2EB84B" opacity="0.4" />
              </svg>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.6rem', color: 'rgba(245,240,232,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>feelix</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.58rem', color: 'rgba(245,198,17,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>· try it</span>
            </div>

            {/* Interactive buttons — green | amber | red */}
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {COLORS.map(({ id, color, glow }, i) => (
                <div key={id} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <div
                    ref={el => { haloRefs.current[i] = el }}
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: 68, height: 68, borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      border: `2px solid ${color}`,
                      opacity: 0, pointerEvents: 'none', willChange: 'transform, opacity',
                    }}
                  />
                  <button
                    ref={el => { btnRefs.current[i] = el }}
                  style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: `radial-gradient(circle at 36% 28%, ${color}FF, ${color}D0 50%, ${color}80 100%)`,
                    boxShadow: `0 10px 28px ${glow}, 0 4px 8px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.28), inset 0 2px 4px rgba(255,255,255,0.14)`,
                    border: 'none',
                    position: 'relative' as const,
                    flexShrink: 0,
                    willChange: 'transform',
                  }}
                >
                  <div style={{ position: 'absolute', top: '20%', left: '20%', width: '32%', height: '24%', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', filter: 'blur(3px)', pointerEvents: 'none' }} />
                </button>
                </div>
              ))}
            </div>
          </div>

          {/* Surface glow pools */}
          <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
            {COLORS.map(({ color }, i) => (
              <div key={i} ref={el => { glowRefs.current[i] = el }} style={{ width: 68, height: 16, borderRadius: '50%', background: color, opacity: 0.3, filter: 'blur(14px)', flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ width: 480, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,240,232,0.06) 30%, rgba(245,240,232,0.06) 70%, transparent)', marginTop: 2 }} />
        </div>

        {/* Cards — animate in as each button is pressed */}
        <div className="fx-cards-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%' }}>
          {t.buttons.map(({ color, glow, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={activeStep >= i + 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9 }}
              style={{
                background: 'linear-gradient(135deg, rgba(245,240,232,0.03) 0%, rgba(245,240,232,0.015) 100%)',
                border: `1px solid ${color}55`,
                borderRadius: 20,
                padding: '32px 28px 36px',
                display: 'flex', flexDirection: 'column', gap: 16,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', bottom: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: color, opacity: 0.08, filter: 'blur(32px)', pointerEvents: 'none' }} />
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
            </motion.div>
          ))}
        </div>

      </div>
      </div>
    </section>
  )
}
