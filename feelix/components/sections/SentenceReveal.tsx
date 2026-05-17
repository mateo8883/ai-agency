'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

gsap.registerPlugin(ScrollTrigger)

export default function SentenceReveal() {
  const { lang } = useLang()
  const sentences = translations[lang].sentenceReveal
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      containerRef.current?.querySelectorAll<HTMLElement>('.sr-sentence').forEach(sentence => {
        const words = sentence.querySelectorAll<HTMLElement>('.sr-word')
        gsap.fromTo(words,
          { opacity: 0, y: 22, rotateX: -12 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.72, ease: 'power3.out',
            stagger: 0.055,
            scrollTrigger: { trigger: sentence, start: 'top 80%' },
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        background: '#0A0A08',
        padding: '120px 32px 140px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        perspective: '800px',
      }}
    >
      {sentences.map(({ text, accent }, i) => (
        <p
          key={i}
          className="sr-sentence"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: accent ? 500 : 400,
            fontSize: 'clamp(1.25rem, 2.8vw, 1.9rem)',
            lineHeight: 1.45,
            color: accent ? 'rgba(245,240,232,0.88)' : 'rgba(245,240,232,0.48)',
            textAlign: 'center',
            maxWidth: '38ch',
            margin: i < sentences.length - 1 ? '0 0 72px' : '0',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em',
          }}
        >
          {text.split(' ').map((word, j) => (
            <span
              key={j}
              className="sr-word"
              style={{ display: 'inline-block', opacity: 0, willChange: 'transform, opacity' }}
            >
              {word}
            </span>
          ))}
        </p>
      ))}
    </section>
  )
}
