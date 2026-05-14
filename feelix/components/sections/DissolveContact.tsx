'use client'
import { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
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

const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const noise = createNoise3D()
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

// Equilateral triangle — Feelix brand mark, green at top
const LOGO_R = 0.62
const DOT_CONFIG = [
  { color: '#2EB84B', base: [0, LOGO_R, 0]                                          as [number,number,number], fallMult: 0.86 },
  { color: '#E63946', base: [LOGO_R * Math.sin(2 * Math.PI / 3), -LOGO_R * 0.5, 0]  as [number,number,number], fallMult: 1.00 },
  { color: '#F5C611', base: [-LOGO_R * Math.sin(2 * Math.PI / 3), -LOGO_R * 0.5, 0] as [number,number,number], fallMult: 1.15 },
]

const DUST_COUNT     = 60
const SCATTER_COUNT  = 35    // per dot

const schema = z.object({
  name:    z.string().min(2,  'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

// ── Ambient dust field ────────────────────────────────────────
function AmbientDust({ progressRef }: { progressRef: { current: number } }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, base } = useMemo(() => {
    const base = new Float32Array(DUST_COUNT * 3)
    const pos  = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 7
      const z = (Math.random() - 0.5) * 4
      base[i*3] = pos[i*3] = x
      base[i*3+1] = pos[i*3+1] = y
      base[i*3+2] = pos[i*3+2] = z
    }
    return { pos, base }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ;(ref.current.material as THREE.PointsMaterial).opacity = phase(progressRef.current, 0.05, 0.50)
    const attr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr  = attr.array as Float32Array
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i*3]   = base[i*3]   + noise(i * 0.12, 0, t * 0.06) * 0.4
      arr[i*3+1] = base[i*3+1] + noise(0, i * 0.12, t * 0.06) * 0.4
      arr[i*3+2] = base[i*3+2] + noise(i * 0.12, i * 0.12, t * 0.06) * 0.2
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F5F0E8" size={0.016} transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Scatter cloud per dot — emerges as the dot dissolves ──────
function ScatterCloud({
  color, base, slot, progressRef,
}: {
  color: string
  base: [number, number, number]
  slot: number
  progressRef: { current: number }
}) {
  const ref = useRef<THREE.Points>(null)
  const { pos, dirs } = useMemo(() => {
    const pos  = new Float32Array(SCATTER_COUNT * 3)
    const dirs = new Float32Array(SCATTER_COUNT * 3)
    for (let i = 0; i < SCATTER_COUNT; i++) {
      pos[i*3]   = base[0]; pos[i*3+1] = base[1]; pos[i*3+2] = base[2]
      const u = Math.random(), v = Math.random()
      const theta = 2 * Math.PI * u
      const phi   = Math.acos(2 * v - 1)
      dirs[i*3]   = Math.sin(phi) * Math.cos(theta)
      dirs[i*3+1] = Math.sin(phi) * Math.sin(theta)
      dirs[i*3+2] = Math.cos(phi) * 0.35  // slight z-compression — feels more 2D/delicate
    }
    return { pos, dirs }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = progressRef.current
    const t = clock.elapsedTime
    const dP = phase(p, 0.44, 0.84)

    if (dP < 0.005) { ;(ref.current.material as THREE.PointsMaterial).opacity = 0; return }

    const appear = phase(dP, 0, 0.28)
    const vanish = 1 - phase(dP, 0.58, 1.0)
    ;(ref.current.material as THREE.PointsMaterial).opacity = appear * vanish * 0.80

    const attr   = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr    = attr.array as Float32Array
    const spread = dP * 1.0

    for (let i = 0; i < SCATTER_COUNT; i++) {
      const seed = i * 0.13 + slot * 55
      arr[i*3]   = base[0] + dirs[i*3]   * spread + noise(seed, 0, t * 0.18) * 0.28 * dP
      arr[i*3+1] = base[1] + dirs[i*3+1] * spread + noise(0, seed, t * 0.18) * 0.28 * dP
      arr[i*3+2] = base[2] + dirs[i*3+2] * spread
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.024} transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ── Logo dot — falls and dissolves, leaves a trail ───────────
function LogoDot({
  color, base, slot, fallMult, progressRef,
}: {
  color: string
  base: [number, number, number]
  slot: number
  fallMult: number
  progressRef: { current: number }
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = progressRef.current
    const t = clock.elapsedTime

    // Fall: ease-in downward, each dot at its own speed
    const fallP = phase(p, 0.06, 0.84)
    const fall  = fallP * fallP * 3.0 * fallMult

    // Dissolve: shrink + fade
    const dissolve = phase(p, 0.46, 0.82)
    const alive    = 1 - dissolve
    ;(ref.current.material as THREE.MeshStandardMaterial).opacity = alive
    ref.current.scale.setScalar(Math.max(0.001, alive))

    // Idle drift before falling starts
    const idle = 1 - phase(p, 0.20, 0.40)
    ref.current.position.set(
      base[0] + noise(slot * 5, 0,      t * 0.4) * 0.04 * idle,
      base[1] - fall + noise(0, slot * 5, t * 0.4) * 0.03 * idle,
      base[2],
    )
  })

  return (
    <Trail width={0.3} length={5} color={color} attenuation={(w) => w * w * w}>
      <mesh ref={ref} position={base}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.62} metalness={0} transparent opacity={1} depthWrite={false} />
      </mesh>
    </Trail>
  )
}

// ── Camera orbits around the falling dots ────────────────────
function CameraRig({ progressRef }: { progressRef: { current: number } }) {
  const { camera } = useThree()
  useFrame(() => {
    const p  = progressRef.current
    const op = phase(p, 0.0, 0.88)
    const theta = op * Math.PI * 3          // 1.5 full orbits as you scroll
    camera.position.set(
      5 * Math.sin(theta),
      lerp(0.5, -1.2, op),
      5 * Math.cos(theta),
    )
    camera.lookAt(0, lerp(0.2, -1.8, op), 0)
  })
  return null
}

// ── R3F scene ─────────────────────────────────────────────────
function Scene({ progressRef }: { progressRef: { current: number } }) {
  return (
    <>
      <CameraRig progressRef={progressRef} />
      <ambientLight intensity={0.88} />
      <directionalLight position={[3, 5, 4]} intensity={0.55} />
      <AmbientDust progressRef={progressRef} />
      {DOT_CONFIG.map((cfg, i) => (
        <group key={i}>
          <LogoDot color={cfg.color} base={cfg.base} slot={i} fallMult={cfg.fallMult} progressRef={progressRef} />
          <ScatterCloud color={cfg.color} base={cfg.base} slot={i} progressRef={progressRef} />
        </group>
      ))}
    </>
  )
}

// ── Main component ────────────────────────────────────────────
export default function DissolveContact() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const canvasRef   = useRef<HTMLDivElement>(null)
  const contactRef  = useRef<HTMLDivElement>(null)
  const progressRef = useRef<number>(0)
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

      // Canvas fades to black as form appears
      if (canvasRef.current) gsap.set(canvasRef.current, { opacity: 1 - phase(p, 0.88, 0.96) })

      const fade = phase(p, 0.90, 1.0)
      if (contactRef.current) {
        gsap.set(contactRef.current, {
          opacity: fade,
          y: (1 - fade) * 30,
          pointerEvents: fade > 0.5 ? 'auto' : 'none',
        })
      }
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
      style={{ height: '320vh', background: '#0A0A08', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* R3F — dots dissolve into particles */}
        <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Canvas
            style={{ position: 'absolute', inset: 0 }}
            camera={{ position: [0, 0.5, 5], fov: 50, near: 0.01, far: 80 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <Scene progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Contact — fades in from the dark */}
        <div
          ref={contactRef}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, zIndex: 20, padding: '0 32px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 44 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                fontSize: '0.65rem', letterSpacing: '0.16em',
                textTransform: 'uppercase' as const, color: '#F5C611',
              }}>
                One press. One connection.
              </span>
              <h2 style={{
                fontFamily: 'Lora, serif', fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.15,
                letterSpacing: '-0.01em', color: '#F5F0E8', margin: 0,
              }}>
                Let&apos;s build something<br />together.
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
                  alignSelf: 'flex-start', marginTop: 6,
                  background: sending ? 'rgba(46,184,75,0.4)' : '#2EB84B',
                  color: '#0A0A08',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: '0.9375rem', letterSpacing: '-0.01em',
                  border: 'none', borderRadius: 100, padding: '14px 40px',
                  cursor: sending ? 'not-allowed' : 'pointer',
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
