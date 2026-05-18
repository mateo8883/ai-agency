import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/shared/SmoothScroll'
import Providers from '@/components/shared/Providers'

export const metadata: Metadata = {
  title: 'Feelix — Convierte clientes insatisfechos en leales',
  description: 'Botones físicos de retroalimentación para tu negocio. Un toque, alerta inmediata, segunda oportunidad.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Toaster position="bottom-center" theme="dark" />
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}
