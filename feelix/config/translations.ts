const es = {
  nav: {
    links: ['Producto', 'Contáctanos'] as string[],
    cta: 'Comenzar',
  },
  hero: {
    label: 'PARA TU NEGOCIO',
    headline: 'Convierte clientes molestos\nen clientes fieles.',
    body: 'Un toque. Alerta inmediata. Segunda oportunidad.',
    cta: 'Prueba gratis',
    ctaSecondary: 'Ver cómo funciona →',
  },
  whyItWorks: {
    label: 'POR QUÉ FUNCIONA',
    headline: 'Hecho para todos\nen tu negocio.',
    cards: [
      { color: 'green' as const, title: 'Para tus clientes', body: 'Sin app. Sin papeles. Sin preguntas raras. Solo aprietan un botón al terminar.' },
      { color: 'amber' as const, title: 'Para tu equipo', body: 'Señal clara. Punto exacto. Sin adivinar. Llegas mientras el cliente todavía está ahí.' },
      { color: 'red' as const, title: 'Para ti', body: 'Sabes cuántos se fueron contentos y cuántos no. Ves qué puntos dan más problemas. Cada semana, en números.' },
    ],
  },
  dashboard: {
    label: 'TU PANEL',
    headline: 'Mira tu negocio\ncomo lo ven tus clientes.',
  },
  product: {
    label: 'EL APARATO',
    headline: 'Un aparato.\nTres botones.',
    body: 'Sin app. Sin enredos. Cada cliente dice cómo le fue con un solo toque.',
    buttons: [
      { color: '#E63946' as const, glow: 'rgba(230,57,70,0.5)' as const, title: 'Alerta', desc: 'El cliente no quedó contento. Ve a atenderlo antes de que se vaya.' },
      { color: '#F5C611' as const, glow: 'rgba(245,198,17,0.5)' as const, title: 'Neutral', desc: 'No quedó del todo bien. Todavía puedes hacer algo.' },
      { color: '#2EB84B' as const, glow: 'rgba(46,184,75,0.5)' as const, title: 'Positivo', desc: 'Le fue bien. De esos clientes quieres más.' },
    ],
  },
  howItWorks: {
    label: 'Cómo Funciona',
    p1: { step: '01 — Alerta', color: '#E63946', headline: 'El cliente aprieta.\nFeelix lo recibe\nen ese momento.', sub: 'Un toque en el punto. Sin app. Sin esperar. Ya está registrado antes de que se vaya.' },
    p2: { step: '02 — Respuesta', color: '#F5C611', headline: 'Tu equipo sabe\nantes de que se vayan.', sub: 'Aviso al instante. Número de punto. Cuánto tiempo llevan. Todo lo que necesitas para ir de una.' },
    p3: { step: '03 — Resultado', color: '#2EB84B', sub: 'de clientes molestos atendidos\nantes de llegar a la puerta.' },
    pills: ['Alertas', 'Neutral', 'Positivo'] as string[],
    canvas: {
      title: 'Actividad en vivo', now: 'Ahora',
      rows: [{ label: 'Punto 7', type: 'Alerta' }, { label: 'Punto 3', type: 'Neutral' }, { label: 'Punto 11', type: 'Positivo' }],
      ago: 'hace', avgResponse: 'resp. prom.  2m 14s',
    },
  },
  sentenceReveal: [
    { text: 'Cuando un cliente aprieta, Feelix registra el momento.', accent: false },
    { text: 'Tu equipo se entera al instante.',                         accent: false },
    { text: 'Mide qué tan rápido responden.',                          accent: false },
    { text: 'Cada toque se convierte en datos para mejorar tu negocio.', accent: true },
  ] as { text: string; accent: boolean }[],
  finalCta: {
    headline: 'El cliente que se va molesto hoy\npuede volver mañana.',
    cta: 'Prueba gratis',
  },
  contact: {
    label: 'HABLEMOS',
    headline: 'Cuéntanos\nde tu negocio.',
    nameLabel: 'Nombre', namePlaceholder: 'Tu nombre', nameError: 'Escribe tu nombre',
    emailLabel: 'Correo', emailPlaceholder: 'tu@empresa.com', emailError: 'Ese correo no parece válido',
    messageLabel: 'Mensaje', messagePlaceholder: 'Cuéntanos sobre tu negocio…', messageError: 'Escribe un poco más',
    submit: 'Háblanos', sending: 'Enviando…',
    successToast: '¡Listo! Te escribimos pronto.', errorToast: 'Algo falló. Intenta de nuevo.',
  },
  footer: { links: ['Producto', 'Contáctanos'] as string[] },
}

const en: typeof es = {
  nav: {
    links: ['Product', 'Contact Us'],
    cta: 'Get Started',
  },
  hero: {
    label: 'CUSTOMER FEEDBACK',
    headline: 'Turn unhappy customers\ninto loyal ones.',
    body: 'One press. Instant alert. Second chance.',
    cta: 'Start free trial',
    ctaSecondary: 'See how it works →',
  },
  whyItWorks: {
    label: 'WHY IT WORKS',
    headline: 'Built for every person\nin your business.',
    cards: [
      { color: 'green', title: 'For customers', body: 'No app to download. No form to fill. No awkward conversation. Just a press on the way out.' },
      { color: 'amber', title: 'For your team', body: 'Clear signal. Exact spot. No guessing. Respond while the customer is still there.' },
      { color: 'red', title: 'For owners', body: 'Trend data. Response times. Weekly reports. See your business the way your customers do.' },
    ],
  },
  dashboard: {
    label: 'THE DASHBOARD',
    headline: 'See your business\nthe way your customers do.',
  },
  product: {
    label: 'THE PRODUCT',
    headline: 'One device.\nThree answers.',
    body: 'No app. No friction. Every customer signals their experience with a single press.',
    buttons: [
      { color: '#E63946', glow: 'rgba(230,57,70,0.5)', title: 'Alert', desc: 'Customer is unhappy. Respond before they leave.' },
      { color: '#F5C611', glow: 'rgba(245,198,17,0.5)', title: 'Neutral', desc: 'Mixed experience. A chance to surprise them.' },
      { color: '#2EB84B', glow: 'rgba(46,184,75,0.5)', title: 'Positive', desc: 'Successful visit. The kind of customer who comes back.' },
    ],
  },
  howItWorks: {
    label: 'How It Works',
    p1: { step: '01 — Alert', color: '#E63946', headline: 'A customer signals.\nFeelix captures it\ninstantly.', sub: 'One press at the spot. No app. No delay. The moment is logged before they leave.' },
    p2: { step: '02 — Response', color: '#F5C611', headline: 'Your team is alerted\nbefore they leave.', sub: 'Real-time push. Spot number. Time elapsed. Every detail needed to respond in seconds.' },
    p3: { step: '03 — Result', color: '#2EB84B', sub: 'of upset customers resolved\nbefore they reach the door.' },
    pills: ['Alerts', 'Neutral', 'Positive'],
    canvas: {
      title: 'Live Activity', now: 'Now',
      rows: [{ label: 'Spot 7', type: 'Alert' }, { label: 'Spot 3', type: 'Neutral' }, { label: 'Spot 11', type: 'Positive' }],
      ago: 'ago', avgResponse: 'avg. response  2m 14s',
    },
  },
  sentenceReveal: [
    { text: 'When a customer presses, Feelix logs the moment.', accent: false },
    { text: 'Alerts your team in real time.',               accent: false },
    { text: 'Tracks how fast they respond.',                accent: false },
    { text: 'Turning every signal into the data behind a better business.', accent: true },
  ],
  finalCta: {
    headline: 'Your next unhappy customer\nis your next loyal customer.',
    cta: 'Start free trial',
  },
  contact: {
    label: 'ONE PRESS. ONE CONNECTION.',
    headline: "Let's build something\ntogether.",
    nameLabel: 'Name', namePlaceholder: 'Your name', nameError: 'Name must be at least 2 characters',
    emailLabel: 'Email', emailPlaceholder: 'you@business.com', emailError: 'Enter a valid email address',
    messageLabel: 'Message', messagePlaceholder: 'Tell us about your business…', messageError: 'Message must be at least 10 characters',
    submit: 'Talk to us', sending: 'Sending…',
    successToast: "We'll be in touch soon!", errorToast: 'Something went wrong. Please try again.',
  },
  footer: { links: ['Product', 'Contact Us'] },
}

export const translations = { es, en }
export type Trans = typeof es
