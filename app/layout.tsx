import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Motorshop CRM',
  description: 'A modern Customer Relationship Management system for motorcycle shops',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

