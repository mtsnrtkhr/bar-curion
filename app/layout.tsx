import type { Metadata } from 'next'
import './globals.css'
import ClientRedirectHandler from './ClientRedirectHandler'

export const metadata: Metadata = {
  title: 'Bar Curion',
  description: 'Cocktail recipe management app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientRedirectHandler />
        {children}
      </body>
    </html>
  )
}