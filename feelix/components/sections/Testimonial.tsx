'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonial } from '@/config/site'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonial() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const quoteRef   = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.25,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A0A08',
        padding: '100px 48px 120px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: 720, width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>

        <div
          ref={lineRef}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,240,232,0.15) 50%, transparent)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />

        <div ref={quoteRef} style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
            fontSize: '0.65rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#2EB84B',
          }}>
            Lo que dicen los dueños
          </span>

          <blockquote style={{ margin: 0 }}>
            <p style={{
              fontFamily: 'Lora, serif', fontStyle: 'italic', fontWeight: 400,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.55,
              letterSpacing: '-0.01em', color: '#F5F0E8',
              margin: 0,
            }}>
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </blockquote>

          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400,
            fontSize: '0.875rem', color: 'rgba(245,240,232,0.38)',
            margin: 0, letterSpacing: '0.02em',
          }}>
            — {testimonial.author}
          </p>
        </div>

        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,240,232,0.08) 50%, transparent)',
          }}
        />
      </div>
    </section>
  )
}
