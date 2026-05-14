import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import SmoothScroll from '@/components/shared/SmoothScroll'
import CustomCursor from '@/components/shared/CustomCursor'

export const metadata: Metadata = {
  title: 'Feelix — Turn unhappy moments into loyal customers',
  description: 'Physical feedback buttons for restaurants. One press, instant alert, second chance.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        <Toaster position="bottom-center" theme="dark" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
