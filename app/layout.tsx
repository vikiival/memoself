import type { Metadata } from 'next'
import './globals.css'

import { Providers } from "@/providers/providers";
import { ChainInfo } from '@/components/chain/chain-info'

export const metadata: Metadata = {
  title: 'Memo Self',
  description: 'zk verified memo claim app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <Providers>
        <main>{children}</main>
        <ChainInfo />
      </Providers>
      </body>
    </html>
  )
}
