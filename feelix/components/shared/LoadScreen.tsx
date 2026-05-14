'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type FaceType = 'happy' | 'neutral' | 'unhappy'

const FACES: Record<FaceType, [number, number][]> = {
  happy:   [[1,1],[5,1],[0,3],[6,3],[1,4],[5,4],[2,5],[3,5],[4,5]],
  neutral: [[1,1],[5,1],[1,4],[2,4],[3,4],[4,4],[5,4]],
  unhappy: [[1,1],[5,1],[2,3],[3,3],[4,3],[1,4],[5,4],[0,5],[6,5]],
}

const P = 18
const FACE_DATA: { type: FaceType; color: string }[] = [
  { type: 'unhappy', color: '#E63946' },
  { type: 'neutral', color: '#F5C611' },
  { type: 'happy',   color: '#2EB84B' },
]

export default function LoadScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const wordRef   = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const pixels = el.querySelectorAll<HTMLElement>('.ls-px')

    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(pixels,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: { amount: 0.9, from: 'random' }, duration: 0.35, ease: 'back.out(2.5)' }
    )
    tl.fromTo(wordRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.1'
    )
    tl.to({}, { duration: 0.75 })
    tl.to(el, { opacity: 0, duration: 0.55, ease: 'power2.inOut', onComplete: () => setGone(true) })

    return () => { tl.kill() }
  }, [])

  if (gone) return null

  return (
    <div
      ref={screenRef}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#1C1B19', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        {FACE_DATA.map(({ type, color }) => (
          <div key={type} style={{ position: 'relative', width: P * 7, height: P * 7 }}>
            {FACES[type].map(([col, row]) => (
              <div
                key={`${col}-${row}`}
                className="ls-px"
                style={{ position: 'absolute', left: col * P, top: row * P, width: P * 0.82, height: P * 0.82, background: color }}
              />
            ))}
          </div>
        ))}
      </div>
      <span
        ref={wordRef}
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.04em', color: '#F5F0E8', opacity: 0 }}
      >
        feelix
      </span>
    </div>
  )
}
