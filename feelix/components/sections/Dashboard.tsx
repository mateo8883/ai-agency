'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dashboard } from '@/config/site'
import { MagicCard } from '@/components/ui/magic-card'

gsap.registerPlugin(ScrollTrigger)

const C: Record<string, string> = { green: '#2EB84B', amber: '#F5C611', red: '#E63946' }

function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const { bars, days } = dashboard.overview
    const W = el.width, H = el.height
    const step = W / (bars.length * 2 + 1)
    const prog = { v: 0 }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      bars.forEach((val, i) => {
        const x = step + i * step * 2
        const h = (val / 100) * (H - 24) * prog.v
        ctx.globalAlpha = 0.45 + (val / 100) * 0.4
        ctx.fillStyle = '#2EB84B'
        ctx.beginPath()
        ctx.roundRect(x, H - h - 20, step * 0.82, h, 2)
        ctx.fill()
        ctx.globalAlpha = 0.35
        ctx.fillStyle = '#F5F0E8'
        ctx.font = '10px Space Grotesk, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(days[i], x + step * 0.41, H - 4)
      })
    }

    const gctx = gsap.context(() => {
      gsap.to(prog, {
        v: 1, duration: 1.4, ease: 'power2.out', onUpdate: draw,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    })
    return () => gctx.revert()
  }, [])

  return <canvas ref={canvasRef} width={480} height={130} style={{ width: '100%', maxWidth: 480 }} />
}

export default function Dashboard() {
  const statsRef = useRef<HTMLDivElement>(null)
  const cardRef  = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const refs: [React.RefObject<HTMLElement | null>, number][] = [[statsRef, 0], [cardRef, 0.05], [quoteRef, 0.1]]
      refs.forEach(([ref, delay]) => {
        gsap.fromTo(ref.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay,
            scrollTrigger: { trigger: ref.current, start: 'top 82%' } }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section style={{ background: '#0A0A08', padding: '80px 32px 140px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>

        <div ref={statsRef} style={{ opacity: 0, display: 'flex', gap: 64, borderTop: '1px solid rgba(245,240,232,0.06)', paddingTop: 36 }}>
          {dashboard.stats.map(({ value, label, color }) => (
            <div key={label}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: C[color], letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>

        <div ref={cardRef} style={{ opacity: 0, width: '100%' }}>
          <MagicCard className="p-8 rounded-2xl" gradientFrom="#2EB84B" gradientTo="#E63946">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#F5F0E8' }}>{dashboard.overview.title}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginTop: 4 }}>{dashboard.overview.subtitle}</div>
            </div>
            <BarChart />
          </MagicCard>
        </div>

        <p ref={quoteRef} style={{ opacity: 0, fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2.6vw, 1.65rem)', lineHeight: 1.55, color: 'rgba(245,240,232,0.85)', textAlign: 'center', maxWidth: '32ch', margin: '24px auto 0' }}>
          &ldquo;Every press tells a story.<br />Feelix turns that story into action.&rdquo;
        </p>

      </div>
    </section>
  )
}
