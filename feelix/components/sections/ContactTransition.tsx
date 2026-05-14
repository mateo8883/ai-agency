'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createNoise3D } from 'simplex-noise'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

gsap.registerPlugin(ScrollTrigger)

// ── Fill these in from your EmailJS dashboard (emailjs.com) ──
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const noise = createNoise3D()
const TAU   = Math.PI * 2
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t
const ha    = (hex: string, a: number) =>
  hex + Math.round(clamp(a, 0, 1) * 255).toString(16).padStart(2, '0')

const DOTS = ['#E63946', '#F5C611', '#2EB84B']

const FRAGMENTS = [
  { text: '2m response',   r: 108, speed: 0.62, offset: 0 },
  { text: '94% recovery',  r: 150, speed: 0.46, offset: TAU * 0.27 },
  { text: '247 happy',     r: 188, speed: 0.55, offset: TAU * 0.54 },
  { text: 'Table 7',       r: 126, speed: 0.70, offset: TAU * 0.17 },
  { text: 'real-time',     r: 165, speed: 0.40, offset: TAU * 0.71 },
  { text: '< 3 minutes',   r: 200, speed: 0.60, offset: TAU * 0.88 },
]

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

export default function ContactTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const darkRef    = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const [sending, setSending] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const section = sectionRef.current
    const canvas  = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const st = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom' })

    const tick = (time: number) => {
      const p  = st.progress ?? 0
      const t  = time * 0.001
      const W  = canvas.width
      const H  = canvas.height
      const cx = W / 2
      const cy = H / 2

      ctx.clearRect(0, 0, W, H)

      const enterFade = phase(p, 0.0,  0.10)
      const speedMult = 0.38 + phase(p, 0.08, 0.72) * 4.0
      const blurAmt   = phase(p, 0.54, 0.80) * 9
      const collapseP = phase(p, 0.78, 0.91)
      const flashP    = phase(p, 0.83, 0.93)
      const flashAlpha = Math.sin(flashP * Math.PI) * 0.9
      const totalAngle = t * speedMult

      // Faint orbit rings
      FRAGMENTS.forEach(frag => {
        const r = frag.r * (1 - collapseP)
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, TAU)
        ctx.strokeStyle = `rgba(245,240,232,${enterFade * 0.045 * (1 - collapseP)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Orbiting text fragments
      ctx.save()
      if (blurAmt > 0.3) ctx.filter = `blur(${blurAmt}px)`
      FRAGMENTS.forEach((frag, i) => {
        const theta  = totalAngle * frag.speed + frag.offset
        const orbitR = frag.r * (1 - collapseP)
        const jx = noise(i * 5, 0, t * 0.18) * 5 * (1 - collapseP)
        const jy = noise(0, i * 5, t * 0.18) * 5 * (1 - collapseP)
        const x  = cx + orbitR * Math.cos(theta) + jx
        const y  = cy + orbitR * Math.sin(theta) + jy

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(theta + Math.PI / 2)
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `400 11px "Space Grotesk", sans-serif`
        ctx.fillStyle = `rgba(245,240,232,${enterFade * 0.52 * (1 - collapseP)})`
        ctx.fillText(frag.text, 0, 0)
        ctx.restore()
      })
      ctx.filter = 'none'
      ctx.restore()

      // Three center dots spinning as a cluster
      DOTS.forEach((color, i) => {
        const theta   = totalAngle * 0.80 + (i * TAU / 3)
        const dotR    = lerp(26, 0, collapseP)
        const jx = noise(i * 11, 0, t * 0.3) * 2.5
        const jy = noise(0, i * 11, t * 0.3) * 2.5
        const x  = cx + dotR * Math.cos(theta) + jx
        const y  = cy + dotR * Math.sin(theta) + jy
        const sz = lerp(9, 0, collapseP)
        const alpha = enterFade

        // Glow halo
        const grd = ctx.createRadialGradient(x, y, 0, x, y, sz * 3)
        grd.addColorStop(0,   ha(color, alpha * 0.65))
        grd.addColorStop(0.5, ha(color, alpha * 0.18))
        grd.addColorStop(1,   ha(color, 0))
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, sz * 3, 0, TAU)
        ctx.fill()

        // Core dot
        ctx.fillStyle = ha(color, alpha)
        ctx.beginPath()
        ctx.arc(x, y, sz, 0, TAU)
        ctx.fill()
      })

      // Collapse flash
      if (flashAlpha > 0.005) {
        const flashR = flashAlpha * 90 + 3
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR)
        grd.addColorStop(0,   `rgba(255,255,255,${flashAlpha})`)
        grd.addColorStop(0.25,`rgba(245,240,210,${flashAlpha * 0.6})`)
        grd.addColorStop(0.7, `rgba(245,240,200,${flashAlpha * 0.1})`)
        grd.addColorStop(1,   'rgba(245,240,200,0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, flashR, 0, TAU)
        ctx.fill()
      }

      // Canvas fades out as contact appears
      const canvasFade = 1 - phase(p, 0.91, 0.97)
      gsap.set(canvas, { opacity: canvasFade })

      // Dark overlay: fades in then out
      const darkAlpha = clamp(phase(p, 0.89, 0.92) - phase(p, 0.92, 0.96), 0, 1)
      if (darkRef.current) gsap.set(darkRef.current, { opacity: darkAlpha })

      // Contact form fades in
      const contactFade = phase(p, 0.94, 1.0)
      if (contactRef.current) gsap.set(contactRef.current, { opacity: contactFade, y: (1 - contactFade) * 28 })
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      window.removeEventListener('resize', resize)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      await emailjs.send(
        EMAILJS_SERVICE, EMAILJS_TEMPLATE,
        { from_name: data.name, from_email: data.email, message: data.message },
        EMAILJS_KEY,
      )
      toast.success("We'll be in touch soon!")
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const errStyle: React.CSSProperties = {
    fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.76rem', color: '#E63946', marginTop: 2,
  }
  const fieldStyle: React.CSSProperties = {
    background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.08)',
    color: '#F5F0E8', borderRadius: 10, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9375rem',
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ height: '400vh', background: '#0A0A08', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Orbital canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        />

        {/* Dark moment overlay */}
        <div
          ref={darkRef}
          style={{ position: 'absolute', inset: 0, background: '#0A0A08', opacity: 0, zIndex: 15, pointerEvents: 'none' }}
        />

        {/* Contact room */}
        <div
          ref={contactRef}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, zIndex: 20, padding: '0 32px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 40 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#F5C611' }}>Get in touch</span>
              <h2 style={{
                fontFamily: 'Lora, serif', fontStyle: 'italic',
                fontWeight: 400, fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
                lineHeight: 1.15, letterSpacing: '-0.01em',
                color: '#F5F0E8', margin: 0,
              }}>
                Let&apos;s build something together.
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.74rem', color: 'rgba(245,240,232,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Name</label>
                <Input {...register('name')} placeholder="Your name" style={{ ...fieldStyle, height: 46 }} />
                {errors.name && <span style={errStyle}>{errors.name.message}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.74rem', color: 'rgba(245,240,232,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Email</label>
                <Input {...register('email')} type="email" placeholder="you@restaurant.com" style={{ ...fieldStyle, height: 46 }} />
                {errors.email && <span style={errStyle}>{errors.email.message}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.74rem', color: 'rgba(245,240,232,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Message</label>
                <Textarea {...register('message')} placeholder="Tell us about your restaurant…" rows={4} style={{ ...fieldStyle, resize: 'none' as const }} />
                {errors.message && <span style={errStyle}>{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  alignSelf: 'flex-start', marginTop: 4,
                  background: sending ? 'rgba(46,184,75,0.4)' : '#2EB84B',
                  color: '#0A0A08',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: '0.9375rem', letterSpacing: '-0.01em',
                  border: 'none', borderRadius: 100,
                  padding: '14px 38px',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  boxShadow: sending ? 'none' : '0 0 32px rgba(46,184,75,0.28)',
                  transition: 'all 0.2s',
                }}
              >
                {sending ? 'Sending…' : 'Talk to us'}
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  )
}
