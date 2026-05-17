'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

gsap.registerPlugin(ScrollTrigger)

// Stable anchors, independent of the (translated) link labels
const NAV_ANCHORS = ['#producto', '#contact']

function FeelixLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
        <circle cx="4"  cy="7" r="4" fill="#E63946" />
        <circle cx="18" cy="7" r="4" fill="#F5C611" />
        <circle cx="32" cy="7" r="4" fill="#2EB84B" />
      </svg>
      <span
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#F5F0E8' }}
      >
        feelix
      </span>
    </a>
  )
}

export default function Nav() {
  const { lang, toggle } = useLang()
  const nav = translations[lang].nav
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const st = ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => {
        el.style.backdropFilter = 'blur(16px)'
        gsap.to(el, { background: 'rgba(10,10,8,0.88)', borderBottom: '1px solid rgba(245,240,232,0.06)', duration: 0.4, ease: 'power2.out' })
      },
      onLeaveBack: () => {
        el.style.backdropFilter = ''
        gsap.to(el, { background: 'transparent', borderBottom: '1px solid transparent', duration: 0.4, ease: 'power2.out' })
      },
    })

    return () => { st.kill() }
  }, [])

  return (
    <nav
      ref={navRef}
      style={{ background: 'transparent', position: 'sticky', top: 0, zIndex: 50 }}
      className="w-full px-8 md:px-16 py-4 flex items-center justify-between"
    >
      <FeelixLogo />

      <ul className="hidden md:flex items-center gap-8">
        {nav.links.map((link, i) => (
          <li key={link}>
            <a
              href={NAV_ANCHORS[i] ?? '#'}
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, fontSize: '0.9375rem', color: '#F5F0E8' }}
              className="opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggle}
          style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
            fontSize: '0.75rem', letterSpacing: '0.08em',
            color: 'rgba(245,240,232,0.45)',
            background: 'rgba(245,240,232,0.06)',
            border: '1px solid rgba(245,240,232,0.1)',
            borderRadius: 100, padding: '6px 14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(245,240,232,0.9)'
            e.currentTarget.style.borderColor = 'rgba(245,240,232,0.22)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(245,240,232,0.45)'
            e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)'
          }}
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>

        <a
          href="#contact"
          style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: '0.875rem', letterSpacing: '-0.01em',
            background: '#2EB84B', color: '#0A0A08',
            borderRadius: 100, padding: '10px 24px',
            textDecoration: 'none', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {nav.cta}
        </a>
      </div>

    </nav>
  )
}
