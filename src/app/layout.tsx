import './globals.css' // ✅ Make sure this line exists
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Website Builder',
  description: 'Generate websites with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {children}
      </body>
    </html>
  )
}