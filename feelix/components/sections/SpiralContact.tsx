'use client'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
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

const DOT_CONFIG: { color: string; base: [number, number, number] }[] = [
  { color: '#E63946', base: [-1.1,  0.5,  0.3] },
  { color: '#F5C611', base: [  0,  -0.7, -0.4] },
  { color: '#2EB84B', base: [ 1.1,  0.5,  0.1] },
]

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

// ─── R3F inner scene ─────────────────────────────────────────
function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const d0 = useRef<THREE.Mesh>(null)
  const d1 = useRef<THREE.Mesh>(null)
  const d2 = useRef<THREE.Mesh>(null)
  const dotRefs = [d0, d1, d2]

  // Sync initial camera so there's no pop on first frame
  useEffect(() => {
    camera.position.set(8, 2.2, 0)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame(({ clock }) => {
    const p  = progressRef.current
    const t  = clock.elapsedTime

    // ── Camera path ──────────────────────────────────────────
    const orbitNorm = phase(p, 0, 0.68)         // 0→1 across the orbit window
    const diveP     = phase(p, 0.68, 0.92)      // 0→1 across the dive
    const diveEased = diveP * diveP             // ease-in acceleration

    const theta = orbitNorm * TAU * 2.2 + diveP * 0.6   // 2.2 full orbits → dive continues
    const r     = lerp(8.0, 0.06, diveEased)
    const camY  = lerp(2.2, -8.0, diveEased)

    camera.position.set(
      r * Math.cos(theta),
      camY,
      r * Math.sin(theta),
    )
    // Look-at drifts downward during dive so the "floor" comes into view
    camera.lookAt(0, lerp(0, -4, diveP), 0)

    // ── Dot organic movement ─────────────────────────────────
    dotRefs.forEach((ref, i) => {
      const mesh = ref.current
      if (!mesh) return
      const b = DOT_CONFIG[i].base
      mesh.position.set(
        b[0] + noise(i * 9,  0,     t * 0.30) * 0.28,
        b[1] + noise(0,      i * 9, t * 0.30) * 0.28,
        b[2] + noise(i * 9,  i * 9, t * 0.30) * 0.18,
      )
      mesh.scale.setScalar(1 + noise(i * 6, t * 0.16, 0) * 0.11)
    })
  })

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[6, 8, 4]} intensity={1.0} />
      {DOT_CONFIG.map((cfg, i) => (
        <Trail
          key={i}
          width={0.9}
          length={14}
          color={cfg.color}
          attenuation={(t) => t * t * t}
        >
          <mesh ref={dotRefs[i]} position={cfg.base}>
            <sphereGeometry args={[0.44, 32, 32]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={1.6}
              roughness={0.12}
              toneMapped={false}
            />
          </mesh>
        </Trail>
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.30} intensity={0.65} mipmapBlur />
      </EffectComposer>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function SpiralContact() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const darkRef       = useRef<HTMLDivElement>(null)
  const contactRef    = useRef<HTMLDivElement>(null)
  const progressRef   = useRef<number>(0)
  const [sending, setSending] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const st = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom' })

    const tick = () => {
      const p = st.progress ?? 0
      progressRef.current = p

      // Canvas wrapper fades out as contact takes over
      const canvasFade = 1 - phase(p, 0.90, 0.97)
      if (canvasWrapRef.current) gsap.set(canvasWrapRef.current, { opacity: canvasFade })

      // Dark flash: ramps in then out around the singularity moment
      const darkAlpha = clamp(phase(p, 0.88, 0.92) - phase(p, 0.92, 0.96), 0, 1)
      if (darkRef.current) gsap.set(darkRef.current, { opacity: darkAlpha })

      // Contact room materialises after the flash
      const contactFade = phase(p, 0.94, 1.0)
      if (contactRef.current) gsap.set(contactRef.current, { opacity: contactFade, y: (1 - contactFade) * 28 })
    }

    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill() }
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

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(245,240,232,0.04)',
    border: '1px solid rgba(245,240,232,0.08)',
    color: '#F5F0E8', borderRadius: 10,
    fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9375rem',
  }
  const errStyle: React.CSSProperties = {
    fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.76rem',
    color: '#E63946', marginTop: 2,
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ height: '380vh', background: '#0A0A08', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* 3-D canvas */}
        <div ref={canvasWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Canvas
            style={{ position: 'absolute', inset: 0 }}
            camera={{ position: [8, 2.2, 0], fov: 60, near: 0.01, far: 120 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <Scene progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Dark flash overlay */}
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
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#F5C611' }}>
                Get in touch
              </span>
              <h2 style={{
                fontFamily: 'Lora, serif', fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.15,
                letterSpacing: '-0.01em', color: '#F5F0E8', margin: 0,
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
                  border: 'none', borderRadius: 100, padding: '14px 38px',
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
