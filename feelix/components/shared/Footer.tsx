'use client'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

// Stable anchors, independent of the (translated) link labels
const FOOTER_ANCHORS = ['#producto', '#contact']

function FeelixLogo() {
  return (
    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <svg width="28" height="11" viewBox="0 0 28 11" fill="none">
        <circle cx="3"  cy="5.5" r="3" fill="#E63946" />
        <circle cx="14" cy="5.5" r="3" fill="#F5C611" />
        <circle cx="25" cy="5.5" r="3" fill="#2EB84B" />
      </svg>
      <span style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
        fontSize: '1rem', letterSpacing: '-0.02em', color: '#F5F0E8',
      }}>
        feelix
      </span>
    </a>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const footer = translations[lang].footer

  return (
    <footer
      style={{
        background: '#0A0A08',
        borderTop: '1px solid rgba(245,240,232,0.06)',
        padding: '40px 48px',
      }}
    >
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24,
      }}>
        <FeelixLogo />

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          {footer.links.map((link, i) => (
            <a
              key={link}
              href={FOOTER_ANCHORS[i] ?? '#'}
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400,
                fontSize: '0.875rem', color: 'rgba(245,240,232,0.35)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,232,0.75)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,232,0.35)' }}
            >
              {link}
            </a>
          ))}
        </nav>

        <p style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem',
          color: 'rgba(245,240,232,0.22)', margin: 0,
        }}>
          © {new Date().getFullYear()} Feelix
        </p>
      </div>
    </footer>
  )
}
