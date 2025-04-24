import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdagiOS',
  description: 'Construyendo un sistema operativo para dispositivos Apple',
  generator: 'Next.js',
  applicationName: 'AdagiOS',
  icons: {
    icon: 'https://th.bing.com/th/id/OIG1.6ymclvK.uklmQ26OAl69?pid=ImgGn'
    },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
