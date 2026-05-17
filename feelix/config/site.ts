export const nav = {
  links: ['Producto', 'Precios', 'Contacto'],
  cta: 'Comenzar',
}

export const hero = {
  label: 'EXPERIENCIA EN RESTAURANTE',
  headline: 'Convierte clientes\ninsatisfechos en leales.',
  body: 'Un toque. Alerta inmediata. Segunda oportunidad.',
  cta: 'Prueba gratis',
  ctaSecondary: 'Ver cómo funciona →',
}

export const socialProof = {
  label: 'Confiado por más de 200 restaurantes',
  names: ['La Mesa', 'Oro Kitchen', 'Brasa Group', 'The Palm House'],
}

export const whyItWorks = {
  label: 'POR QUÉ FUNCIONA',
  headline: 'Diseñado para cada persona\nen el salón.',
  cards: [
    {
      color: 'green' as const,
      title: 'Para los comensales',
      body: 'Sin app que descargar. Sin formularios. Sin conversaciones incómodas. Solo un toque al final de la comida.',
    },
    {
      color: 'amber' as const,
      title: 'Para el personal',
      body: 'Señal clara. Mesa exacta. Sin conjeturas. Responde mientras el comensal aún está presente.',
    },
    {
      color: 'red' as const,
      title: 'Para los dueños',
      body: 'Datos y tendencias. Tiempos de respuesta. Reportes semanales. Ve tu restaurante como lo ven tus comensales.',
    },
  ],
}

export const dashboard = {
  label: 'EL PANEL DE CONTROL',
  headline: 'Ve tu restaurante\ncomo lo ven tus comensales.',
  body: 'Retroalimentación en tiempo real. Seguimiento de respuestas. Tendencias semanales. Cada métrica que un dueño necesita.',
  stats: [
    { value: '2m', label: 'tiempo prom. de respuesta', color: 'green' as const },
    { value: '94%', label: 'tasa de recuperación', color: 'amber' as const },
  ],
  overview: {
    title: 'Resumen Semanal',
    subtitle: 'Esta semana vs. la anterior',
    counts: [
      { value: 247, label: 'Positivo', color: 'green' as const },
      { value: 38, label: 'Neutral', color: 'amber' as const },
      { value: 14, label: 'Alertas', color: 'red' as const },
    ],
    days: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    bars: [65, 80, 55, 90, 75, 45, 70],
  },
}

export const testimonial = {
  quote:
    'La primera semana que usamos Feelix salvamos tres mesas que habrían dejado una mala reseña. Ahora no imagino operar sin él.',
  author: 'Carlos M. — Dueño, La Mesa',
}

export const pricing = {
  label: 'PRECIOS',
  headline: 'Precios simples.',
  plans: [
    {
      name: 'Básico',
      price: { monthly: 49, annual: 39 },
      features: ['1 ubicación', '3 botones', 'Alertas por email', 'Reporte mensual'],
      cta: 'Comenzar',
      recommended: false,
    },
    {
      name: 'Crecimiento',
      price: { monthly: 99, annual: 79 },
      features: ['3 ubicaciones', 'Botones ilimitados', 'Alertas instantáneas', 'Reportes semanales', 'Análisis de respuestas'],
      cta: 'Prueba gratis',
      recommended: true,
    },
    {
      name: 'Empresarial',
      price: { monthly: 249, annual: 199 },
      features: ['Ubicaciones ilimitadas', 'Botones ilimitados', 'Soporte prioritario', 'Integraciones personalizadas', 'Gerente dedicado'],
      cta: 'Contáctanos',
      recommended: false,
    },
  ],
}

export const finalCta = {
  headline: 'Tu próximo cliente insatisfecho\nes tu próximo cliente leal.',
  cta: 'Prueba gratis',
}

export const footer = {
  links: ['Producto', 'Precios', 'Contacto', 'Privacidad'],
}
