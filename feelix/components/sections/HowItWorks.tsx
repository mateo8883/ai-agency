'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LanguageContext'
import { translations } from '@/config/translations'

gsap.registerPlugin(ScrollTrigger)

type CanvasTr = typeof translations['es']['howItWorks']['canvas']

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawDashboard(canvas: HTMLCanvasElement, tr: CanvasTr) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width, H = canvas.height

  ctx.fillStyle = '#0A0A08'
  ctx.fillRect(0, 0, W, H)

  // Live dot
  ctx.fillStyle = '#2EB84B'
  ctx.beginPath()
  ctx.arc(18, 22, 4.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(245,240,232,0.88)'
  ctx.font = '600 11px "Space Grotesk", sans-serif'
  ctx.fillText(tr.title, 32, 26)

  ctx.fillStyle = 'rgba(245,240,232,0.28)'
  ctx.font = '10px "Space Grotesk", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(tr.now, W - 14, 26)
  ctx.textAlign = 'left'

  ctx.strokeStyle = 'rgba(245,240,232,0.05)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 38)
  ctx.lineTo(W, 38)
  ctx.stroke()

  const colors = ['#E63946', '#F5C611', '#2EB84B']
  const rows = tr.rows.map((r, i) => ({ color: colors[i], label: r.label, type: r.type, time: ['0:45', '2:10', '3:02'][i] }))

  rows.forEach(({ color, label, type, time }, i) => {
    const y = 62 + i * 34

    ctx.fillStyle = color
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.arc(18, y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.fillStyle = 'rgba(245,240,232,0.85)'
    ctx.font = '500 10px "Space Grotesk", sans-serif'
    ctx.fillText(label, 32, y + 4)

    ctx.fillStyle = color + 'BB'
    ctx.font = '10px "Space Grotesk", sans-serif'
    ctx.fillText(type, 100, y + 4)

    ctx.fillStyle = 'rgba(245,240,232,0.28)'
    ctx.textAlign = 'right'
    ctx.fillText(time + ' ' + tr.ago, W - 14, y + 4)
    ctx.textAlign = 'left'

    if (i < rows.length - 1) {
      ctx.strokeStyle = 'rgba(245,240,232,0.04)'
      ctx.beginPath()
      ctx.moveTo(12, y + 17)
      ctx.lineTo(W - 12, y + 17)
      ctx.stroke()
    }
  })

  // Response bar
  const bY = H - 26
  ctx.fillStyle = 'rgba(245,240,232,0.05)'
  rr(ctx, 12, bY, W - 24, 6, 3)
  ctx.fill()
  ctx.fillStyle = '#2EB84B'
  ctx.globalAlpha = 0.65
  rr(ctx, 12, bY, (W - 24) * 0.55, 6, 3)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.fillStyle = 'rgba(245,240,232,0.32)'
  ctx.font = '9px "Space Grotesk", sans-serif'
  ctx.fillText(tr.avgResponse, 12, bY - 7)
}

function TableDevice({ label }: { label: string }) {
  return (
    <div className="fx-scale-device" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', width: '72%', height: 28, background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)', filter: 'blur(10px)' }} />
        <div style={{
          width: 300, height: 172,
          background: 'linear-gradient(160deg, #2A2825 0%, #181715 60%, #111110 100%)',
          borderRadius: 44,
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 22, padding: '20px 32px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="22" height="9" viewBox="0 0 22 9" fill="none">
              <circle cx="2.5"  cy="4.5" r="2.5" fill="#E63946" opacity="0.45" />
              <circle cx="11"   cy="4.5" r="2.5" fill="#F5C611" opacity="0.45" />
              <circle cx="19.5" cy="4.5" r="2.5" fill="#2EB84B" opacity="0.45" />
            </svg>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.55rem', color: 'rgba(245,240,232,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>feelix</span>
          </div>
          <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            {([
              { color: '#E63946', glow: 'rgba(230,57,70,0.5)' },
              { color: '#F5C611', glow: 'rgba(245,198,17,0.5)' },
              { color: '#2EB84B', glow: 'rgba(46,184,75,0.5)' },
            ] as { color: string; glow: string }[]).map(({ color, glow }, i) => (
              <div key={i} style={{
                width: 58, height: 58, borderRadius: '50%',
                background: `radial-gradient(circle at 38% 30%, ${color}FF, ${color}CC 55%, ${color}88 100%)`,
                boxShadow: `0 8px 24px ${glow}, 0 2px 6px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 3px rgba(255,255,255,0.12)`,
                position: 'relative' as const,
              }}>
                <div style={{ position: 'absolute', top: '22%', left: '22%', width: '30%', height: '22%', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', filter: 'blur(2px)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.6rem', color: 'rgba(245,240,232,0.18)', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  )
}

function LaptopMockup({ tr }: { tr: CanvasTr }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => { if (canvasRef.current) drawDashboard(canvasRef.current, tr) }, [tr])

  return (
    <div className="fx-scale-device" style={{ width: 420, userSelect: 'none' as const }}>
      <div style={{
        background: '#181715', borderRadius: '14px 14px 0 0',
        border: '2px solid rgba(255,255,255,0.07)', borderBottom: 'none',
        padding: 12,
        boxShadow: '0 48px 96px rgba(0,0,0,0.65)',
      }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
          {['#E63946', '#F5C611', '#2EB84B'].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.65 }} />
          ))}
        </div>
        <div style={{ background: '#0A0A08', borderRadius: 8, overflow: 'hidden' }}>
          <canvas ref={canvasRef} width={396} height={210} style={{ display: 'block', width: '100%' }} />
        </div>
      </div>
      <div style={{ height: 14, background: '#232220', borderRadius: '0 0 6px 6px', border: '2px solid rgba(255,255,255,0.07)', borderTop: 'none' }} />
      <div style={{ height: 7, background: '#1A1816', width: '54%', margin: '0 auto', borderRadius: '0 0 10px 10px', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }} />
    </div>
  )
}

function Pill({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: color + '18', border: `1px solid ${color}32`,
      borderRadius: 100, padding: '9px 18px',
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(245,240,232,0.85)', letterSpacing: '-0.02em' }}>{count}</span>
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', color: 'rgba(245,240,232,0.38)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
}

export default function HowItWorks() {
  const { lang } = useLang()
  const t = translations[lang].howItWorks

  const sectionRef      = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const p2CopyRef       = useRef<HTMLDivElement>(null)
  const p3WrapRef       = useRef<HTMLDivElement>(null)
  const statRef         = useRef<HTMLSpanElement>(null)
  const dotRefs         = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const st = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom' })

    const tick = () => {
      const p = st.progress ?? 0

      gsap.set(track, { x: -p * 2 * window.innerWidth })

      const p2 = phase(p, 0.36, 0.56)
      if (p2CopyRef.current) gsap.set(p2CopyRef.current, { opacity: p2, y: (1 - p2) * 28 })

      const p3 = phase(p, 0.70, 0.92)
      if (p3WrapRef.current) gsap.set(p3WrapRef.current, { opacity: p3, y: (1 - p3) * 32 })
      if (statRef.current)   statRef.current.textContent = Math.round(94 * p3).toString()

      const active = Math.round(p * 2)
      dotRefs.current.forEach((d, i) => {
        if (!d) return
        gsap.set(d, {
          background: i === active ? '#F5C611' : 'rgba(245,240,232,0.18)',
          scale: i === active ? 1.5 : 1,
        })
      })
    }

    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill() }
  }, [])

  const colCopy: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(20px, 6vw, 72px)', gap: 22 }
  const colDevice: React.CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  const stepLabel = (text: string, color: string) => (
    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.14em', color, textTransform: 'uppercase' as const }}>{text}</span>
  )
  const headline = (text: string) => (
    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem, 4.2vw, 3.4rem)', lineHeight: 1.06, letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0, whiteSpace: 'pre-line' as const }}>{text}</h2>
  )
  const sub = (text: string) => (
    <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', lineHeight: 1.68, color: 'rgba(245,240,232,0.42)', maxWidth: '28ch', margin: 0 }}>{text}</p>
  )

  return (
    <section ref={sectionRef} id="how-it-works" style={{ height: '300vh', background: '#0A0A08', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Section label */}
        <div style={{ position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(245,240,232,0.25)' }}>{t.label}</span>
        </div>

        {/* Progress dots */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} ref={el => { dotRefs.current[i] = el }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(245,240,232,0.18)' }} />
          ))}
        </div>

        {/* Horizontal track */}
        <div ref={trackRef} style={{ display: 'flex', width: '300vw', height: '100vh' }}>

          {/* Panel 1 — Alerta */}
          <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={colCopy}>
              {stepLabel(t.p1.step, t.p1.color)}
              {headline(t.p1.headline)}
              {sub(t.p1.sub)}
            </div>
            <div style={colDevice}>
              <TableDevice label={lang === 'es' ? 'Dispositivo de mesa Feelix' : 'Feelix Table Device'} />
            </div>
          </div>

          {/* Panel 2 — Response */}
          <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={colDevice}>
              <LaptopMockup tr={t.canvas} />
            </div>
            <div ref={p2CopyRef} style={{ ...colCopy, opacity: 0 }}>
              {stepLabel(t.p2.step, t.p2.color)}
              {headline(t.p2.headline)}
              {sub(t.p2.sub)}
            </div>
          </div>

          {/* Panel 3 — Result */}
          <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div ref={p3WrapRef} style={{ opacity: 0, textAlign: 'center' as const, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
              {stepLabel(t.p3.step, t.p3.color)}
              <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
                <span ref={statRef} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(5.5rem, 15vw, 12rem)', letterSpacing: '-0.06em', color: '#2EB84B', fontVariantNumeric: 'tabular-nums' }}>0</span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#2EB84B', letterSpacing: '-0.04em', paddingTop: '0.4em' }}>%</span>
              </div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.0625rem', lineHeight: 1.6, color: 'rgba(245,240,232,0.48)', maxWidth: '26ch', margin: 0, whiteSpace: 'pre-line' as const }}>{t.p3.sub}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                <Pill color="#E63946" label={t.pills[0]} count={14}  />
                <Pill color="#F5C611" label={t.pills[1]} count={38}  />
                <Pill color="#2EB84B" label={t.pills[2]} count={247} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
