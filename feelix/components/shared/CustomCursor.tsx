'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return

    document.body.style.cursor = 'none'

    const move = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', move)
    return () => { window.removeEventListener('mousemove', move); document.body.style.cursor = '' }
  }, [])

  const base: React.CSSProperties = { position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, top: 0, left: 0 }

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 6, height: 6, background: '#0F0E0C', transform: 'translate(-3px, -3px)' }} />
      <div ref={ringRef} style={{ ...base, width: 28, height: 28, border: '1.5px solid rgba(15,14,12,0.35)', transform: 'translate(-14px, -14px)' }} />
    </>
  )
}
