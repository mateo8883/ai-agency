export const nav = {
  links: ['Product', 'Pricing', 'Contact'],
  cta: 'Get Started',
}

export const hero = {
  label: 'RESTAURANT FEEDBACK',
  headline: 'Turn unhappy customers\ninto loyal customers.',
  body: 'One press. Instant alert. Second chance.',
  cta: 'Start free trial',
  ctaSecondary: 'See how it works →',
}

export const socialProof = {
  label: 'Trusted by 200+ restaurants',
  names: ['La Mesa', 'Oro Kitchen', 'Brasa Group', 'The Palm House'],
}

export const whyItWorks = {
  label: 'WHY IT WORKS',
  headline: 'Built for every person\nin the room.',
  cards: [
    {
      color: 'green' as const,
      title: 'For guests',
      body: 'No app to download. No form to fill. No awkward conversation. Just a press at the end of a meal.',
    },
    {
      color: 'amber' as const,
      title: 'For staff',
      body: 'Clear signal. Exact table. No guessing. Respond while the guest is still there.',
    },
    {
      color: 'red' as const,
      title: 'For owners',
      body: 'Trend data. Response times. Weekly reports. See your restaurant the way your guests do.',
    },
  ],
}

export const dashboard = {
  label: 'THE DASHBOARD',
  headline: 'See your restaurant\nthe way your guests do.',
  body: 'Real-time feedback. Response time tracking. Weekly trends. Every metric a restaurant owner needs.',
  stats: [
    { value: '2m', label: 'avg. response time', color: 'green' as const },
    { value: '94%', label: 'recovery rate', color: 'amber' as const },
  ],
  overview: {
    title: 'Weekly Overview',
    subtitle: 'This week vs. last',
    counts: [
      { value: 247, label: 'Positive', color: 'green' as const },
      { value: 38, label: 'Neutral', color: 'amber' as const },
      { value: 14, label: 'Alerts', color: 'red' as const },
    ],
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    bars: [65, 80, 55, 90, 75, 45, 70],
  },
}

export const testimonial = {
  quote:
    'The first week we used Feelix we saved three tables that would have left a bad review. Now I can\'t imagine running without it.',
  author: 'Carlos M. — Owner, La Mesa',
}

export const pricing = {
  label: 'PRICING',
  headline: 'Simple pricing.',
  plans: [
    {
      name: 'Starter',
      price: { monthly: 49, annual: 39 },
      features: ['1 location', '3 buttons', 'Email alerts', 'Monthly report'],
      cta: 'Get started',
      recommended: false,
    },
    {
      name: 'Growth',
      price: { monthly: 99, annual: 79 },
      features: ['3 locations', 'Unlimited buttons', 'Instant alerts', 'Weekly reports', 'Response analytics'],
      cta: 'Start free trial',
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 249, annual: 199 },
      features: ['Unlimited locations', 'Unlimited buttons', 'Priority support', 'Custom integrations', 'Dedicated CSM'],
      cta: 'Contact us',
      recommended: false,
    },
  ],
}

export const finalCta = {
  headline: 'Your next unhappy customer\nis your next loyal customer.',
  cta: 'Start free trial',
}

export const footer = {
  links: ['Product', 'Pricing', 'Contact', 'Privacy'],
}
