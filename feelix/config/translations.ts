const es = {
  nav: {
    links: ['Producto', 'Contacto'] as string[],
    cta: 'Comenzar',
  },
  hero: {
    label: 'PARA TU RESTAURANTE',
    headline: 'Convierte clientes molestos\nen clientes fieles.',
    body: 'Un toque. Alerta inmediata. Segunda oportunidad.',
    cta: 'Prueba gratis',
    ctaSecondary: 'Ver cómo funciona →',
  },
  whyItWorks: {
    label: 'POR QUÉ FUNCIONA',
    headline: 'Hecho para todos\nen tu restaurante.',
    cards: [
      { color: 'green' as const, title: 'Para tus clientes', body: 'Sin app. Sin papeles. Sin preguntas raras. Solo aprietan un botón al terminar de comer.' },
      { color: 'amber' as const, title: 'Para tu equipo', body: 'Señal clara. Mesa exacta. Sin adivinar. Llegas mientras el cliente todavía está sentado.' },
      { color: 'red' as const, title: 'Para ti', body: 'Sabes cuántos se fueron contentos y cuántos no. Ves qué mesas dan más problemas. Cada semana, en números.' },
    ],
  },
  dashboard: {
    label: 'TU PANEL',
    headline: 'Mira tu restaurante\ncomo lo ven tus clientes.',
  },
  product: {
    label: 'EL APARATO',
    headline: 'Un aparato.\nTres botones.',
    body: 'Sin app. Sin enredos. Cada cliente dice cómo le fue con un solo toque.',
    buttons: [
      { color: '#E63946' as const, glow: 'rgba(230,57,70,0.5)' as const, title: 'Alerta', desc: 'El cliente no quedó contento. Ve a atenderlo antes de que salga.' },
      { color: '#F5C611' as const, glow: 'rgba(245,198,17,0.5)' as const, title: 'Neutral', desc: 'No quedó del todo bien. Todavía puedes hacer algo.' },
      { color: '#2EB84B' as const, glow: 'rgba(46,184,75,0.5)' as const, title: 'Positivo', desc: 'Le fue bien. De esos clientes quieres más.' },
    ],
  },
  howItWorks: {
    label: 'Cómo Funciona',
    p1: { step: '01 — Alerta', color: '#E63946', headline: 'El cliente aprieta.\nFeelix lo recibe\nen ese momento.', sub: 'Un toque en la mesa. Sin app. Sin esperar. Ya está registrado antes de que se levante.' },
    p2: { step: '02 — Respuesta', color: '#F5C611', headline: 'Tu equipo sabe\nantes de que se vayan.', sub: 'Aviso al instante. Número de mesa. Cuánto tiempo llevan. Todo lo que necesitas para ir de una.' },
    p3: { step: '03 — Resultado', color: '#2EB84B', sub: 'de clientes molestos atendidos\nantes de llegar a la puerta.' },
    pills: ['Alertas', 'Neutral', 'Positivo'] as string[],
    canvas: {
      title: 'Actividad en vivo', now: 'Ahora',
      rows: [{ label: 'Mesa 7', type: 'Alerta' }, { label: 'Mesa 3', type: 'Neutral' }, { label: 'Mesa 11', type: 'Positivo' }],
      ago: 'hace', avgResponse: 'resp. prom.  2m 14s',
    },
  },
  sentenceReveal: [
    { text: 'Cuando un cliente aprieta, Feelix registra el momento.', accent: false },
    { text: 'Tu equipo se entera al instante.',                         accent: false },
    { text: 'Mide qué tan rápido responden.',                          accent: false },
    { text: 'Cada toque se convierte en datos para mejorar tu restaurante.', accent: true },
  ] as { text: string; accent: boolean }[],
  finalCta: {
    headline: 'El cliente que se va molesto hoy\npuede volver mañana.',
    cta: 'Prueba gratis',
  },
  contact: {
    label: 'HABLEMOS',
    headline: 'Cuéntanos\nde tu restaurante.',
    nameLabel: 'Nombre', namePlaceholder: 'Tu nombre', nameError: 'Escribe tu nombre',
    emailLabel: 'Correo', emailPlaceholder: 'tu@restaurante.com', emailError: 'Ese correo no parece válido',
    messageLabel: 'Mensaje', messagePlaceholder: 'Cuéntanos sobre tu restaurante…', messageError: 'Escribe un poco más',
    submit: 'Háblanos', sending: 'Enviando…',
    successToast: '¡Listo! Te escribimos pronto.', errorToast: 'Algo falló. Intenta de nuevo.',
  },
  footer: { links: ['Producto', 'Contacto'] as string[] },
}

const en: typeof es = {
  nav: {
    links: ['Product', 'Contact'],
    cta: 'Get Started',
  },
  hero: {
    label: 'RESTAURANT FEEDBACK',
    headline: 'Turn unhappy customers\ninto loyal ones.',
    body: 'One press. Instant alert. Second chance.',
    cta: 'Start free trial',
    ctaSecondary: 'See how it works →',
  },
  whyItWorks: {
    label: 'WHY IT WORKS',
    headline: 'Built for every person\nin the room.',
    cards: [
      { color: 'green', title: 'For guests', body: 'No app to download. No form to fill. No awkward conversation. Just a press at the end of a meal.' },
      { color: 'amber', title: 'For staff', body: 'Clear signal. Exact table. No guessing. Respond while the guest is still there.' },
      { color: 'red', title: 'For owners', body: 'Trend data. Response times. Weekly reports. See your restaurant the way your guests do.' },
    ],
  },
  dashboard: {
    label: 'THE DASHBOARD',
    headline: 'See your restaurant\nthe way your guests do.',
  },
  product: {
    label: 'THE PRODUCT',
    headline: 'One device.\nThree answers.',
    body: 'No app. No friction. Every guest signals their experience with a single press.',
    buttons: [
      { color: '#E63946', glow: 'rgba(230,57,70,0.5)', title: 'Alert', desc: 'Guest is unhappy. Respond before they leave.' },
      { color: '#F5C611', glow: 'rgba(245,198,17,0.5)', title: 'Neutral', desc: 'Mixed experience. A chance to surprise them.' },
      { color: '#2EB84B', glow: 'rgba(46,184,75,0.5)', title: 'Positive', desc: 'Successful visit. The kind of guest who comes back.' },
    ],
  },
  howItWorks: {
    label: 'How It Works',
    p1: { step: '01 — Alert', color: '#E63946', headline: 'A guest signals.\nFeelix captures it\ninstantly.', sub: 'One press at the table. No app. No delay. The moment is logged before they leave the seat.' },
    p2: { step: '02 — Response', color: '#F5C611', headline: 'Your team is alerted\nbefore they leave.', sub: 'Real-time push. Table number. Time elapsed. Every detail needed to respond in seconds.' },
    p3: { step: '03 — Result', color: '#2EB84B', sub: 'of upset guests resolved\nbefore they reach the door.' },
    pills: ['Alerts', 'Neutral', 'Positive'],
    canvas: {
      title: 'Live Activity', now: 'Now',
      rows: [{ label: 'Table 7', type: 'Alert' }, { label: 'Table 3', type: 'Neutral' }, { label: 'Table 11', type: 'Positive' }],
      ago: 'ago', avgResponse: 'avg. response  2m 14s',
    },
  },
  sentenceReveal: [
    { text: 'When a guest presses, Feelix logs the moment.', accent: false },
    { text: 'Alerts your team in real time.',               accent: false },
    { text: 'Tracks how fast they respond.',                accent: false },
    { text: 'Turning every signal into the data behind a better restaurant.', accent: true },
  ],
  finalCta: {
    headline: 'Your next unhappy customer\nis your next loyal customer.',
    cta: 'Start free trial',
  },
  contact: {
    label: 'ONE PRESS. ONE CONNECTION.',
    headline: "Let's build something\ntogether.",
    nameLabel: 'Name', namePlaceholder: 'Your name', nameError: 'Name must be at least 2 characters',
    emailLabel: 'Email', emailPlaceholder: 'you@restaurant.com', emailError: 'Enter a valid email address',
    messageLabel: 'Message', messagePlaceholder: 'Tell us about your restaurant…', messageError: 'Message must be at least 10 characters',
    submit: 'Talk to us', sending: 'Sending…',
    successToast: "We'll be in touch soon!", errorToast: 'Something went wrong. Please try again.',
  },
  footer: { links: ['Product', 'Contact'] },
}

export const translations = { es, en }
export type Trans = typeof es
