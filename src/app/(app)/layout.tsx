import type { Metadata } from 'next'
import { Raleway, Solway } from 'next/font/google'
import '../globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
})

const solway = Solway({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-solway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cursos 2026-1 — Facultad de Educación',
  description: 'Oferta de cursos de pregrado y posgrado de la Facultad de Educación',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${raleway.variable} ${solway.variable}`}>
      <body className="font-body antialiased">
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  )
}
