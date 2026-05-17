'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// ── Fill these in from your EmailJS dashboard (emailjs.com) ──
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

const field: React.CSSProperties = {
  background: 'rgba(245,240,232,0.04)',
  border: '1px solid rgba(245,240,232,0.08)',
  color: '#F5F0E8',
  borderRadius: 10,
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '0.9375rem',
}

const label: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '0.78rem',
  color: 'rgba(245,240,232,0.45)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}

const errStyle: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '0.78rem',
  color: '#E63946',
  marginTop: 2,
}

export default function Contact() {
  const [sending, setSending] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
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

  return (
    <section id="contact" style={{ background: '#0A0A08', padding: '120px 32px 180px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        <div style={{ marginBottom: 52, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#F5C611' }}>Get in touch</span>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.04, letterSpacing: '-0.04em', color: '#F5F0E8', margin: 0 }}>
            Let&apos;s talk.
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', lineHeight: 1.65, color: 'rgba(245,240,232,0.42)', margin: 0 }}>
            Tell us about your restaurant. We&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={label}>Name</label>
            <Input {...register('name')} placeholder="Your name" style={{ ...field, height: 48 }} />
            {errors.name && <span style={errStyle}>{errors.name.message}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={label}>Email</label>
            <Input {...register('email')} type="email" placeholder="you@restaurant.com" style={{ ...field, height: 48 }} />
            {errors.email && <span style={errStyle}>{errors.email.message}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={label}>Message</label>
            <Textarea {...register('message')} placeholder="Tell us about your restaurant…" rows={5} style={{ ...field, resize: 'none' as const }} />
            {errors.message && <span style={errStyle}>{errors.message.message}</span>}
          </div>

          <button
            type="submit"
            disabled={sending}
            style={{
              marginTop: 8, alignSelf: 'flex-start',
              background: sending ? 'rgba(46,184,75,0.45)' : '#2EB84B',
              color: '#0A0A08',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: '0.9375rem', letterSpacing: '-0.01em',
              border: 'none', borderRadius: 100,
              padding: '15px 40px',
              boxShadow: sending ? 'none' : '0 0 32px rgba(46,184,75,0.28)',
              transition: 'all 0.2s',
            }}
          >
            {sending ? 'Sending…' : 'Talk to us'}
          </button>

        </form>
      </div>
    </section>
  )
}
